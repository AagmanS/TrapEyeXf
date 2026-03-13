"""
TrapEye — Phishing Analysis Service  v2.0

Analysis pipeline:
1. Rule-based CRITICAL override  →  if definitive phishing signals present → 100%
2. ML ensemble prediction        →  VotingClassifier probability
3. Heuristic boosts              →  for secondary signals
4. Known-bad list cross-check    →  PhishTank + custom blocklist
"""
import sys
import os
from datetime import datetime, timezone

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.feature_extractor import (
    extract_url_features,
    features_to_model_input,
    generate_risk_reasons,
)
from utils.ml_utils import predict_phishing

# ── Known-bad domain blocklist ───────────────────────────────────────
KNOWN_PHISHING_DOMAINS = {
    # Classic demo phishtank entries
    "paypa1.com", "secure-login-verify.com", "update-account-now.tk",
    "amaz0n-security.ml", "apple-id-verify.ga", "microsoft-support-alert.xyz",
    # Cloudflare-hosted phishing clones often use these patterns
    "cloudflare-security-verify.com", "cf-ddos-protect.tk",
}


def _rule_based_critical(features: dict) -> bool:
    """
    Returns True if ANY combination of hard signals conclusively indicates phishing.
    These are patterns that legitimate sites NEVER exhibit.
    """
    # 1. Dangerous protocol (javascript:, data:text/html, vbscript:)
    if features["is_dangerous_protocol"]:
        return True

    # 2. IP address + no HTTPS  (never legitimate)
    if features["has_ip"] and not features["has_https"]:
        return True

    # 3. Brand in subdomain of a suspicious TLD domain
    # e.g. paypal.com.login.xyz  or  google.com.update-account.tk
    if features["brand_in_subdomain"] and features["suspicious_tld"]:
        return True

    # 4. Critical phishing keyword(s) present in URL
    if features["has_critical_keyword"]:
        return True

    # 5. Punycode domain (IDN homograph attack) — always phishing
    if features["has_punycode"]:
        return True

    # 6. Typosquat of major brand (ANY TLD — paypa1.com is still phishing)
    if features["is_typosquat"]:
        return True

    # 7. @-symbol in URL (classic credential harvesting trick)
    if features["num_at"] and features["impersonates_brand"]:
        return True

    # 8. IP address with HTTPS (still very suspicious — legitimate sites use domains)
    if features["has_ip"]:
        return True

    # 9. Brand impersonation + suspicious TLD
    if features["impersonates_brand"] and features["suspicious_tld"]:
        return True

    # 10. Cloudflare challenge path detected (phishing clone indicator)
    if features["has_cf_bypass"]:
        return True

    # 11. Extremely long URL + suspicious TLD
    if features["url_length"] > 200 and features["suspicious_tld"]:
        return True

    # 12. Open redirect parameter detected
    if features["has_open_redirect"]:
        return True

    # 13. Random-looking domain + suspicious TLD (generated domain phishing)
    if features["domain_looks_random"] and features["suspicious_tld"]:
        return True

    # 14. Brand in subdomain (even without suspicious TLD — e.g. paypal.com.evil.com)
    if features["brand_in_subdomain"]:
        return True

    # 15. Very high entropy domain + suspicious TLD
    if features["domain_entropy"] > 3.8 and features["suspicious_tld"]:
        return True

    # 16. URL shortener (hides destination — always suspicious)
    if features["is_url_shortener"]:
        return True

    # 17. Random-looking domain + high digit ratio (machine-generated)
    if features["domain_looks_random"] and features["digit_ratio"] > 0.3:
        return True

    # 18. Special char overload + suspicious keywords
    if features["special_char_overload"] and features["num_suspicious_keywords"] >= 2:
        return True

    return False


async def analyze_url(url: str) -> dict:
    """Full phishing analysis pipeline."""
    features = extract_url_features(url)
    model_input = features_to_model_input(features)
    ml_probability = predict_phishing(model_input)

    domain = features.get("domain", "").lower()

    # ── Step 1: Hard rule override → forces 100% CRITICAL ────────────
    forced_critical = _rule_based_critical(features)

    # ── Step 2: Blocklist cross-check ────────────────────────────────
    phishtank_listed = domain in KNOWN_PHISHING_DOMAINS
    if phishtank_listed:
        ml_probability = max(ml_probability, 0.95)

    # ── Step 3: Heuristic boosts to ML probability ───────────────────
    boost = 0.0

    if features["has_ip"]:         boost += 0.10
    if features["suspicious_tld"]: boost += 0.08
    if features["impersonates_brand"]: boost += 0.07
    if features["is_typosquat"]:   boost += 0.10
    if features["brand_in_subdomain"]: boost += 0.12
    if features["domain_looks_random"]: boost += 0.08
    if features["has_punycode"]:   boost += 0.12
    if features["has_cf_bypass"]:  boost += 0.10
    if features["has_critical_keyword"]: boost += 0.15
    if not features["has_https"]:  boost += 0.05
    if features["domain_entropy"] > 3.8: boost += 0.06
    if features["num_subdomains"] > 3:   boost += 0.05
    if features["has_open_redirect"]:    boost += 0.07
    if features["special_char_overload"]: boost += 0.05
    if features["has_base64_segment"]:   boost += 0.05
    if features["digit_ratio"] > 0.4:   boost += 0.05

    final_probability = min(ml_probability + boost, 0.99)

    # ── Step 4: Apply CRITICAL override ──────────────────────────────
    if forced_critical:
        final_probability = 1.0      # exactly 100%
        risk_level = "CRITICAL"
    else:
        risk_level = _determine_risk_level(final_probability)

    # ── Step 5: Reasons ───────────────────────────────────────────────
    reasons = generate_risk_reasons(features, final_probability)

    return {
        "url": url,
        "risk_level": risk_level,
        "phishing_probability": round(final_probability * 100, 1),
        "reasons": reasons,
        "features": {
            "url_length": features["url_length"],
            "num_dots": features["num_dots"],
            "num_subdomains": features["num_subdomains"],
            "has_ip": bool(features["has_ip"]),
            "has_https": bool(features["has_https"]),
            "domain_entropy": features["domain_entropy"],
            "suspicious_keywords": features["matched_keywords"],
            "critical_keywords": features["matched_critical_keywords"],
            "suspicious_tld": bool(features["suspicious_tld"]),
            "impersonates_brand": bool(features["impersonates_brand"]),
            "is_typosquat": bool(features["is_typosquat"]),
            "brand_in_subdomain": bool(features["brand_in_subdomain"]),
            "domain_looks_random": bool(features["domain_looks_random"]),
            "has_punycode": bool(features["has_punycode"]),
            "has_cf_bypass": bool(features["has_cf_bypass"]),
            "has_open_redirect": bool(features["has_open_redirect"]),
            "is_url_shortener": bool(features["is_url_shortener"]),
            "special_char_overload": bool(features["special_char_overload"]),
            "digit_ratio": features["digit_ratio"],
        },
        "phishtank_listed": phishtank_listed,
        "forced_critical": forced_critical,
        "scan_time": datetime.now(timezone.utc),
    }


def _determine_risk_level(probability: float) -> str:
    """Map probability to risk level. Only returns CRITICAL at exactly 1.0."""
    if probability >= 1.0:
        return "CRITICAL"
    elif probability >= 0.75:
        return "HIGH"
    elif probability >= 0.45:
        return "MEDIUM"
    else:
        return "LOW"
