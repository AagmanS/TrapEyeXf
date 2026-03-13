import sys, os, asyncio, json
sys.path.insert(0, r'c:\Users\aagma_r95jbd4\trapeyeX')
# Fix console encoding for Windows
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from backend.services.phishing_service import analyze_url

urls = [
    # Should be CRITICAL (100%)
    ("IP no HTTPS",          "http://192.168.1.105/login/paypal/verify"),
    ("IP with HTTPS",        "https://45.33.32.156/banking/login"),
    ("BrandSubd+bad TLD",    "http://paypal.com.secure-login.xyz/account/confirm"),
    ("Critical keyword",     "https://login-verify.evil.com/confirm-your-account"),
    ("Random domain .ml",    "https://a8f3k2b9x1.ml/verify-account"),
    ("Punycode",             "http://xn--pypal-4ve.com/login"),
    ("Typosquat .com",       "https://paypa1.com/update-billing"),
    ("Typosquat .tk",        "https://paypa1-security.tk/update-billing"),
    ("Open redirect",        "https://accounts.google.evil.xyz/?redirect=http://steal.tk"),
    ("CF bypass path",       "https://evil.com/cdn-cgi/__cf_chl_f_tk=phish"),
    ("Data URI",             "data:text/html,<script>alert(1)</script>"),
    ("Brand+bad TLD",        "https://paypal-login.xyz/verify"),
    ("URL shortener",        "https://bit.ly/3xYz123"),
    ("Brand in subdomain",   "http://google.com.evil-domain.com/login"),
    ("Random+digits",        "https://x7k2m9p1q4.cf/signin"),
    # Should be LOW
    ("Google legit",         "https://www.google.com/search?q=hi"),
    ("GitHub legit",         "https://github.com/openai/gpt-4"),
    ("BBC legit",            "https://www.bbc.co.uk/news"),
    ("Microsoft legit",      "https://www.microsoft.com/en-us/windows"),
    ("StackOverflow legit",  "https://stackoverflow.com/questions/12345"),
    ("Wikipedia legit",      "https://en.wikipedia.org/wiki/Phishing"),
]

async def run():
    results = []
    for label, url in urls:
        r = await analyze_url(url)
        results.append({
            "label": label,
            "risk": r["risk_level"],
            "prob": r["phishing_probability"],
            "forced": r["forced_critical"],
        })
    # Write JSON
    with open(r'c:\Users\aagma_r95jbd4\trapeyeX\ml_models\results2.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print("DONE")

asyncio.run(run())
