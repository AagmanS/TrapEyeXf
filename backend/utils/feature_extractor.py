"""
TrapEye — Advanced Phishing Feature Extractor
Detects: Cloudflare bypass pages, random-char domains, IP URLs,
         IDN homographs, punycode, URL shorteners, open redirects,
         data-URI tricks, special-char flooding, brand typosquatting,
         hex/base64 obfuscation, suspicious TLDs, and more.
"""
import re
import math
import urllib.parse
from typing import Dict, Any, List


# ──────────────────────────────────────────────────────────────────────
# KEYWORD LISTS
# ──────────────────────────────────────────────────────────────────────
PHISHING_KEYWORDS = [
    "login", "verify", "update", "secure", "account", "banking",
    "paypal", "password", "credential", "signin", "confirm",
    "validate", "ebay", "amazon", "apple", "microsoft", "google",
    "suspend", "unusual", "billing", "payment", "winner", "prize",
    "free", "click", "urgent", "alert", "warning", "token",
    "authenticate", "reset", "recover", "unlock", "reactivate",
    "limited", "expire", "immediately", "action", "required",
    "security", "verification", "access", "identity", "protect",
    "review", "unusual-activity", "hold", "blocked", "confirm-identity",
]

# High-certainty phishing-only keywords (auto CRITICAL)
CRITICAL_KEYWORDS = [
    "confirm-your-account", "verify-now", "update-billing",
    "account-suspended", "login-verify", "secure-login",
    "reset-password", "confirm-login", "account-locked",
    "unusual-signin", "verify-identity", "account-verify",
]

MAJOR_BRANDS = [
    "paypal", "google", "amazon", "apple", "microsoft", "facebook",
    "netflix", "instagram", "twitter", "linkedin", "chase", "wellsfargo",
    "citibank", "hsbc", "barclays", "bankofamerica", "americanexpress",
    "dropbox", "icloud", "outlook", "office365", "yahoo", "gmail",
    "coinbase", "binance", "blockchain", "metamask", "robinhood",
    "ebay", "walmart", "target", "bestbuy", "fedex", "ups", "dhl",
    "usps", "irs", "socialsecurity", "medicare", "venmo", "cashapp",
    "zelle", "steam", "discord", "twitch", "tiktok", "whatsapp",
    "telegram", "signal", "cloudflare", "aws", "azure",
]

SUSPICIOUS_TLDS = {
    ".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".click",
    ".download", ".link", ".work", ".men", ".loan", ".win", ".bid",
    ".trade", ".accountant", ".science", ".date", ".faith", ".review",
    ".racing", ".party", ".cricket", ".country", ".stream",
    ".gdn", ".webcam", ".email", ".space", ".site", ".online",
    ".tech", ".club", ".pw", ".cc", ".biz",          # semi-suspicious
}

TRUSTED_TLDS = {
    ".com", ".org", ".net", ".gov", ".edu", ".co.uk", ".io",
    ".ac.uk", ".gov.uk", ".mil", ".int",
}

# URL shortener domains (almost always obfuscation in phishing context)
URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
    "buff.ly", "adf.ly", "tiny.cc", "lnkd.in", "ift.tt", "dlvr.it",
    "su.pr", "twurl.nl", "short.ie", "cli.gs", "u.to", "rb.gy",
    "cutt.ly", "shorturl.at", "rebrand.ly", "bl.ink",
}

# Cloudflare challenge / DDOS-guard / bot-protection bypass patterns
# Phishing pages often self-host clones behind Cloudflare pages
CLOUDFLARE_BYPASS_PATHS = [
    "/cdn-cgi/", "__cf_chl", "cf_clearance", "cf-ray",
    "cloudflare-nginx", "just-a-moment",
]

# Open-redirect parameter names
OPEN_REDIRECT_PARAMS = [
    "redirect", "return", "returnurl", "next", "goto", "dest",
    "destination", "url", "link", "target", "redir", "forward",
    "continue", "r_url", "redirecturi", "redirect_uri", "callback",
]

# Data-URI / javascript pseudo-protocol tricks
DANGEROUS_PROTOCOLS = [
    "javascript:", "data:text/html", "data:application/",
    "vbscript:", "data:image/svg",
]

# Punycode prefix — IDN homograph attack
PUNYCODE_PREFIX = "xn--"


# ──────────────────────────────────────────────────────────────────────
# ENTROPY
# ──────────────────────────────────────────────────────────────────────
def _entropy(text: str) -> float:
    if not text:
        return 0.0
    freq = {}
    for ch in text:
        freq[ch] = freq.get(ch, 0) + 1
    n = len(text)
    return -sum((c / n) * math.log2(c / n) for c in freq.values())


# ──────────────────────────────────────────────────────────────────────
# RANDOM-DOMAIN DETECTOR
# Detects domains that look machine-generated / random
# ──────────────────────────────────────────────────────────────────────
def _looks_random(text: str) -> bool:
    """True if the string looks like random characters (high consonant clusters,
    no recognisable bigrams, high entropy, long with no vowels)."""
    if not text or len(text) < 5:
        return False
    vowels = set("aeiou")
    vowel_ratio = sum(1 for c in text.lower() if c in vowels) / len(text)
    ent = _entropy(text)
    digit_ratio = sum(1 for c in text if c.isdigit()) / len(text)
    # Random string heuristic: very low vowels, very high entropy, or lots of digits mixed with chars
    if ent > 3.8 and vowel_ratio < 0.15:
        return True
    if digit_ratio > 0.4 and len(text) > 8:
        return True
    return False


# ──────────────────────────────────────────────────────────────────────
# TYPOSQUATTING DETECTOR
# ──────────────────────────────────────────────────────────────────────
def _levenshtein(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            dp[j] = prev if a[i-1] == b[j-1] else 1 + min(prev, dp[j], dp[j-1])
            prev = temp
    return dp[n]


def _typosquats_brand(domain: str) -> bool:
    """Return True if domain is a typosquat (edit-distance ≤ 2) of a major brand."""
    bare = re.sub(r'\.(com|net|org|io|xyz|tk|ml|ga|cf|gq|top|cc|pw)$', '', domain.lower())
    bare = bare.replace("-", "").replace("0", "o").replace("1", "l").replace("3", "e")
    for brand in MAJOR_BRANDS:
        if bare == brand:
            continue  # exact match already covered by impersonates_brand
        if len(bare) > 3 and _levenshtein(bare, brand) <= 2:
            return True
    return False


# ──────────────────────────────────────────────────────────────────────
# MAIN EXTRACTOR
# ──────────────────────────────────────────────────────────────────────
def extract_url_features(url: str) -> Dict[str, Any]:
    """Extract 40+ features from a URL for phishing detection."""
    raw_url = url
    full_url = url.lower()

    # ── Protocol tricks ──────────────────────────────────────────────
    is_dangerous_protocol = any(full_url.startswith(p) for p in DANGEROUS_PROTOCOLS)

    try:
        parsed = urllib.parse.urlparse(url if "://" in url else f"http://{url}")
    except Exception:
        parsed = urllib.parse.urlparse(f"http://{url}")

    domain = (parsed.netloc or "").lower()
    if ":" in domain:                          # strip port from domain
        domain = domain.split(":")[0]
    path = parsed.path or ""
    query = parsed.query or ""
    fragment = parsed.fragment or ""

    # ── Lengths ──────────────────────────────────────────────────────
    url_length = len(raw_url)
    domain_length = len(domain)
    path_length = len(path)

    # ── Dot & subdomain analysis ─────────────────────────────────────
    num_dots = raw_url.count(".")
    bare_domain = domain.replace("www.", "")
    parts = bare_domain.split(".")
    num_subdomains = max(0, len(parts) - 2)

    # ── IP address ───────────────────────────────────────────────────
    ip_pattern = re.compile(r"^(\d{1,3}\.){3}\d{1,3}$")
    has_ip = bool(ip_pattern.match(domain))

    # ── HTTPS ────────────────────────────────────────────────────────
    has_https = raw_url.lower().startswith("https://")

    # ── Special characters ───────────────────────────────────────────
    num_hyphens = raw_url.count("-")
    num_at = raw_url.count("@")
    num_question = raw_url.count("?")
    num_ampersand = raw_url.count("&")
    num_equals = raw_url.count("=")
    num_slash = raw_url.count("/")
    num_underscore = raw_url.count("_")
    num_tilde = raw_url.count("~")
    num_percent = raw_url.count("%")
    # Special-char flooding score
    special_char_count = num_hyphens + num_at + num_percent + num_tilde + num_underscore
    special_char_overload = int(special_char_count > 10)

    # ── Keywords ─────────────────────────────────────────────────────
    matched_keywords = [kw for kw in PHISHING_KEYWORDS if kw in full_url]
    num_suspicious_keywords = len(matched_keywords)

    matched_critical_keywords = [kw for kw in CRITICAL_KEYWORDS if kw in full_url]
    has_critical_keyword = int(len(matched_critical_keywords) > 0)

    # ── TLD ──────────────────────────────────────────────────────────
    suspicious_tld = any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS)
    trusted_tld = any(domain.endswith(tld) for tld in TRUSTED_TLDS)

    # ── Entropy ──────────────────────────────────────────────────────
    domain_entropy = _entropy(domain)
    path_entropy = _entropy(path)
    subdomain_part = ".".join(parts[:-2]) if num_subdomains > 0 else ""
    subdomain_entropy = _entropy(subdomain_part)

    # ── Digits in domain ─────────────────────────────────────────────
    digit_count = sum(1 for c in domain if c.isdigit())
    digit_ratio = digit_count / max(len(domain), 1)

    # ── Port ─────────────────────────────────────────────────────────
    try:
        has_port = bool(parsed.port)
    except (ValueError, TypeError):
        has_port = False

    # ── Double slash (redirect) ───────────────────────────────────────
    has_double_slash = "//" in (path + query)

    # ── Brand impersonation ──────────────────────────────────────────
    impersonates_brand = any(brand in full_url for brand in MAJOR_BRANDS)

    # ── Typosquatting ────────────────────────────────────────────────
    is_typosquat = _typosquats_brand(domain)

    # ── Hex / Base64 obfuscation ─────────────────────────────────────
    has_hex_encoding = bool(re.search(r"%[0-9a-fA-F]{2}", raw_url))
    has_base64_segment = bool(re.search(r"[A-Za-z0-9+/]{20,}={0,2}", path + query))

    # ── URL shortener ────────────────────────────────────────────────
    is_url_shortener = domain in URL_SHORTENERS

    # ── Cloudflare bypass indicator ──────────────────────────────────
    has_cf_bypass = any(p in full_url for p in CLOUDFLARE_BYPASS_PATHS)

    # ── Open redirect ────────────────────────────────────────────────
    query_lower = query.lower()
    has_open_redirect = any(f"{p}=" in query_lower or f"{p}%3d" in query_lower
                             for p in OPEN_REDIRECT_PARAMS)

    # ── Punycode / IDN homograph ──────────────────────────────────────
    has_punycode = PUNYCODE_PREFIX in domain.lower()

    # ── Random-looking domain ─────────────────────────────────────────
    domain_looks_random = int(_looks_random(parts[0] if parts else domain))

    # ── Multiple subdomains as fake path ─────────────────────────────
    # e.g. paypal.com.evil.tk  — checks if a trusted brand appears in a subdomain
    # but the actual registered domain is suspicious
    brand_in_subdomain = int(
        any(brand in subdomain_part for brand in MAJOR_BRANDS) and
        not any(domain.endswith(f".{brand}.com") or domain == f"{brand}.com" for brand in MAJOR_BRANDS)
    )

    # ── Fragment (javascript tricks) ─────────────────────────────────
    has_suspicious_fragment = int(bool(fragment) and len(fragment) > 30)

    # ── Long query string ─────────────────────────────────────────────
    long_query = int(len(query) > 100)

    # ── Dangerous protocol ────────────────────────────────────────────
    is_dangerous_protocol_int = int(is_dangerous_protocol)

    return {
        # Basic
        "url_length": url_length,
        "domain_length": domain_length,
        "path_length": path_length,
        "num_dots": num_dots,
        "num_subdomains": num_subdomains,
        # Security
        "has_ip": int(has_ip),
        "has_https": int(has_https),
        "has_port": int(has_port),
        # Special chars
        "num_hyphens": num_hyphens,
        "num_at": int(num_at > 0),
        "num_question": num_question,
        "num_ampersand": num_ampersand,
        "num_equals": num_equals,
        "num_slash": num_slash,
        "num_percent": num_percent,
        "special_char_overload": special_char_overload,
        # Keywords
        "num_suspicious_keywords": num_suspicious_keywords,
        "has_critical_keyword": has_critical_keyword,
        # TLD
        "suspicious_tld": int(suspicious_tld),
        "trusted_tld": int(trusted_tld),
        # Entropy
        "domain_entropy": round(domain_entropy, 3),
        "path_entropy": round(path_entropy, 3),
        "subdomain_entropy": round(subdomain_entropy, 3),
        # Digits
        "digit_ratio": round(digit_ratio, 3),
        # Obfuscation
        "has_hex_encoding": int(has_hex_encoding),
        "has_base64_segment": int(has_base64_segment),
        "has_double_slash": int(has_double_slash),
        "is_dangerous_protocol": is_dangerous_protocol_int,
        # Impersonation
        "impersonates_brand": int(impersonates_brand),
        "is_typosquat": int(is_typosquat),
        "brand_in_subdomain": brand_in_subdomain,
        # Tricks
        "is_url_shortener": int(is_url_shortener),
        "has_cf_bypass": int(has_cf_bypass),
        "has_open_redirect": int(has_open_redirect),
        "has_punycode": int(has_punycode),
        "domain_looks_random": domain_looks_random,
        "has_suspicious_fragment": has_suspicious_fragment,
        "long_query": long_query,
        # Raw strings for service layer
        "domain": domain,
        "matched_keywords": matched_keywords,
        "matched_critical_keywords": matched_critical_keywords,
    }


# ──────────────────────────────────────────────────────────────────────
# MODEL INPUT
# ──────────────────────────────────────────────────────────────────────
FEATURE_ORDER = [
    "url_length", "domain_length", "path_length", "num_dots", "num_subdomains",
    "has_ip", "has_https", "has_port",
    "num_hyphens", "num_at", "num_question", "num_ampersand", "num_equals",
    "num_slash", "num_percent", "special_char_overload",
    "num_suspicious_keywords", "has_critical_keyword",
    "suspicious_tld", "trusted_tld",
    "domain_entropy", "path_entropy", "subdomain_entropy",
    "digit_ratio",
    "has_hex_encoding", "has_base64_segment", "has_double_slash", "is_dangerous_protocol",
    "impersonates_brand", "is_typosquat", "brand_in_subdomain",
    "is_url_shortener", "has_cf_bypass", "has_open_redirect",
    "has_punycode", "domain_looks_random", "has_suspicious_fragment", "long_query",
]


def features_to_model_input(features: Dict[str, Any]) -> list:
    return [features[k] for k in FEATURE_ORDER]


# ──────────────────────────────────────────────────────────────────────
# RISK REASONS
# ──────────────────────────────────────────────────────────────────────
def generate_risk_reasons(features: Dict[str, Any], probability: float) -> List[str]:
    reasons = []

    if features["has_ip"]:
        reasons.append("⚠️ IP address used instead of a domain name — classic phishing")
    if features["is_dangerous_protocol"]:
        reasons.append("🚨 Dangerous protocol detected (javascript:, data:, vbscript:)")
    if features["has_cf_bypass"]:
        reasons.append("🛡️ Cloudflare bypass/challenge page path detected — phishing clone indicator")
    if features["brand_in_subdomain"]:
        reasons.append("🎭 Trusted brand name embedded in subdomain to deceive users")
    if features["is_typosquat"]:
        reasons.append("🔤 Domain is a typosquat of a major brand (e.g. paypa1, gooogle)")
    if features["impersonates_brand"] and not features["is_typosquat"]:
        reasons.append("🏷️ Brand name found in URL — potential impersonation")
    if features["has_punycode"]:
        reasons.append("🌐 Punycode/IDN domain detected — possible homograph attack (e.g. pаypal.com)")
    if features["has_critical_keyword"]:
        kws = ", ".join(features["matched_critical_keywords"][:3])
        reasons.append(f"🔑 High-risk phishing keyword(s): {kws}")
    elif features["num_suspicious_keywords"] > 0:
        kws = ", ".join(features["matched_keywords"][:3])
        reasons.append(f"🔍 Phishing-related keywords detected: {kws}")
    if features["suspicious_tld"]:
        reasons.append("🌍 Suspicious top-level domain (free/abused TLD used in phishing)")
    if not features["has_https"]:
        reasons.append("🔓 No HTTPS — connection is not encrypted")
    if features["num_subdomains"] > 2:
        reasons.append(f"🔗 Deep subdomain nesting ({features['num_subdomains']} levels) — common in phishing")
    if features["domain_entropy"] > 3.8:
        reasons.append(f"🎲 Very high domain entropy ({features['domain_entropy']}) — looks machine-generated")
    elif features["domain_entropy"] > 3.4:
        reasons.append(f"🎲 High domain entropy ({features['domain_entropy']}) — possible random domain")
    if features["domain_looks_random"]:
        reasons.append("🔀 Domain contains random-looking characters (e.g. a8f3k2.tk)")
    if features["digit_ratio"] > 0.4:
        reasons.append(f"🔢 High digit ratio in domain ({features['digit_ratio']:.0%}) — random number domain")
    if features["has_hex_encoding"]:
        reasons.append("🔡 Hex-encoded characters in URL (e.g. %2F, %3D) — obfuscation technique")
    if features["has_base64_segment"]:
        reasons.append("📦 Base64-encoded segment in path/query — payload obfuscation")
    if features["has_open_redirect"]:
        reasons.append("↪️ Open redirect parameter detected — URL may redirect to malicious site")
    if features["is_url_shortener"]:
        reasons.append("🔗 URL shortener detected — hides actual destination")
    if features["url_length"] > 150:
        reasons.append(f"📏 Extremely long URL ({features['url_length']} chars) — typical phishing obfuscation")
    elif features["url_length"] > 100:
        reasons.append(f"📏 Unusually long URL ({features['url_length']} chars)")
    if features["special_char_overload"]:
        reasons.append("⚡ Excessive special characters in URL — obfuscation/flooding")
    if features["num_at"] > 0:
        reasons.append("@ symbol in URL — can be used to spoof the displayed domain")
    if features["has_double_slash"]:
        reasons.append("// Double slash in path — possible redirect or confusion attack")
    if features["has_port"]:
        reasons.append("🔌 Non-standard port in URL — bypassing normal web traffic monitoring")
    if features["long_query"]:
        reasons.append("📝 Very long query string — possible encoded payload")

    if not reasons and probability < 0.3:
        reasons.append("✅ No significant phishing indicators detected")
    elif not reasons:
        reasons.append("⚠️ Multiple subtle phishing patterns detected by ML model")

    return reasons
