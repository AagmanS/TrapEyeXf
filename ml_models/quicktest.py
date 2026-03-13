import sys, os, asyncio
sys.path.insert(0, r'c:/Users/aagma_r95jbd4/trapeyeX')
from backend.services.phishing_service import analyze_url

urls = [
    ("IP+no HTTPS",               "http://192.168.1.105/login/paypal/verify"),
    ("Brand in subdomain+bad TLD","http://paypal.com.secure-login.xyz/account/confirm"),
    ("Critical keyword",          "https://login-verify.evil.com/confirm-your-account"),
    ("Random numbers domain",     "https://a8f3k2b9x1.ml/verify-account"),
    ("Punycode homograph",        "http://xn--pypal-4ve.com/login"),
    ("Typosquat+bad TLD",         "https://paypa1-security.tk/update-billing"),
    ("Open redirect",             "https://accounts.google.evil.xyz/?redirect=http://steal.tk"),
    ("Google legit",              "https://www.google.com/search?q=hi"),
    ("GitHub legit",              "https://github.com/openai/gpt-4"),
]

async def run():
    print("=" * 75)
    print(f"{'Label':<35} {'Risk':<12} {'Prob':>6}  {'Forced Critical'}")
    print("-" * 75)
    for label, url in urls:
        r = await analyze_url(url)
        forced = "YES (100%)" if r["forced_critical"] else "no"
        print(f"{label:<35} {r['risk_level']:<12} {r['phishing_probability']:>6.1f}%  {forced}")
    print("=" * 75)

asyncio.run(run())
