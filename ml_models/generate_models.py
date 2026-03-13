"""
TrapEye ML Model Generator  v2.0
Trains and saves:
  1. Phishing URL classifier — VotingClassifier ensemble (RF + GBM + LR)
     Trained on 20 000 balanced samples, 38 features matching feature_extractor.py
  2. Fake News classifier — TF-IDF + Logistic Regression

Run: python ml_models/generate_models.py
"""

import numpy as np
import pickle
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier,
    VotingClassifier,
)
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ──────────────────────────────────────────────────────────────────────
# Feature order must EXACTLY match feature_extractor.py FEATURE_ORDER
# ──────────────────────────────────────────────────────────────────────
# [0]  url_length          [1]  domain_length       [2]  path_length
# [3]  num_dots            [4]  num_subdomains       [5]  has_ip
# [6]  has_https           [7]  has_port             [8]  num_hyphens
# [9]  num_at              [10] num_question         [11] num_ampersand
# [12] num_equals          [13] num_slash            [14] num_percent
# [15] special_char_overload  [16] num_suspicious_keywords
# [17] has_critical_keyword   [18] suspicious_tld    [19] trusted_tld
# [20] domain_entropy      [21] path_entropy         [22] subdomain_entropy
# [23] digit_ratio         [24] has_hex_encoding     [25] has_base64_segment
# [26] has_double_slash    [27] is_dangerous_protocol
# [28] impersonates_brand  [29] is_typosquat         [30] brand_in_subdomain
# [31] is_url_shortener    [32] has_cf_bypass        [33] has_open_redirect
# [34] has_punycode        [35] domain_looks_random  [36] has_suspicious_fragment
# [37] long_query
N_FEATURES = 38


# ══════════════════════════════════════════════════════════════════════
# 1. PHISHING MODEL
# ══════════════════════════════════════════════════════════════════════

def _b(p, n):
    """Bernoulli sample."""
    return np.random.binomial(1, p, n).astype(float)


def generate_phishing_dataset(n_phishing=10000, n_legit=10000, seed=42):
    """
    Generate a realistic synthetic dataset of phishing and legitimate URLs.
    Each row is the 38-feature vector in FEATURE_ORDER.
    """
    np.random.seed(seed)
    rng = np.random.default_rng(seed)

    # ── PHISHING samples ───────────────────────────────────────────────
    P = n_phishing
    ph = np.column_stack([
        # [0] url_length — phishing URLs are long
        rng.integers(80, 400, P).astype(float),
        # [1] domain_length
        rng.integers(15, 70, P).astype(float),
        # [2] path_length
        rng.integers(20, 250, P).astype(float),
        # [3] num_dots
        rng.integers(3, 12, P).astype(float),
        # [4] num_subdomains
        rng.integers(2, 7, P).astype(float),
        # [5] has_ip
        _b(0.42, P),
        # [6] has_https  (phishing often skips HTTPS)
        _b(0.25, P),
        # [7] has_port
        _b(0.18, P),
        # [8] num_hyphens
        rng.integers(2, 10, P).astype(float),
        # [9] num_at
        _b(0.22, P),
        # [10] num_question
        rng.integers(1, 8, P).astype(float),
        # [11] num_ampersand
        rng.integers(1, 8, P).astype(float),
        # [12] num_equals
        rng.integers(1, 10, P).astype(float),
        # [13] num_slash
        rng.integers(3, 12, P).astype(float),
        # [14] num_percent
        rng.integers(0, 10, P).astype(float),
        # [15] special_char_overload
        _b(0.65, P),
        # [16] num_suspicious_keywords
        rng.integers(1, 6, P).astype(float),
        # [17] has_critical_keyword
        _b(0.48, P),
        # [18] suspicious_tld
        _b(0.68, P),
        # [19] trusted_tld
        _b(0.10, P),
        # [20] domain_entropy  (high)
        rng.uniform(3.2, 4.8, P),
        # [21] path_entropy
        rng.uniform(3.0, 5.0, P),
        # [22] subdomain_entropy
        rng.uniform(2.5, 4.5, P),
        # [23] digit_ratio
        rng.uniform(0.15, 0.60, P),
        # [24] has_hex_encoding
        _b(0.35, P),
        # [25] has_base64_segment
        _b(0.28, P),
        # [26] has_double_slash
        _b(0.22, P),
        # [27] is_dangerous_protocol
        _b(0.12, P),
        # [28] impersonates_brand
        _b(0.55, P),
        # [29] is_typosquat
        _b(0.40, P),
        # [30] brand_in_subdomain
        _b(0.35, P),
        # [31] is_url_shortener
        _b(0.15, P),
        # [32] has_cf_bypass
        _b(0.20, P),
        # [33] has_open_redirect
        _b(0.30, P),
        # [34] has_punycode
        _b(0.12, P),
        # [35] domain_looks_random
        _b(0.55, P),
        # [36] has_suspicious_fragment
        _b(0.18, P),
        # [37] long_query
        _b(0.60, P),
    ])

    # ── LEGITIMATE samples ─────────────────────────────────────────────
    L = n_legit
    lg = np.column_stack([
        # [0] url_length
        rng.integers(10, 85, L).astype(float),
        # [1] domain_length
        rng.integers(4, 25, L).astype(float),
        # [2] path_length
        rng.integers(0, 60, L).astype(float),
        # [3] num_dots
        rng.integers(1, 4, L).astype(float),
        # [4] num_subdomains
        rng.integers(0, 2, L).astype(float),
        # [5] has_ip
        np.zeros(L),
        # [6] has_https
        np.ones(L),
        # [7] has_port
        np.zeros(L),
        # [8] num_hyphens
        rng.integers(0, 2, L).astype(float),
        # [9] num_at
        np.zeros(L),
        # [10] num_question
        rng.integers(0, 2, L).astype(float),
        # [11] num_ampersand
        rng.integers(0, 2, L).astype(float),
        # [12] num_equals
        rng.integers(0, 3, L).astype(float),
        # [13] num_slash
        rng.integers(1, 5, L).astype(float),
        # [14] num_percent
        np.zeros(L),
        # [15] special_char_overload
        np.zeros(L),
        # [16] num_suspicious_keywords
        np.zeros(L),
        # [17] has_critical_keyword
        np.zeros(L),
        # [18] suspicious_tld
        np.zeros(L),
        # [19] trusted_tld
        _b(0.82, L),
        # [20] domain_entropy  (lower)
        rng.uniform(1.5, 3.2, L),
        # [21] path_entropy
        rng.uniform(1.0, 3.0, L),
        # [22] subdomain_entropy
        rng.uniform(0.0, 2.5, L),
        # [23] digit_ratio
        rng.uniform(0.0, 0.12, L),
        # [24] has_hex_encoding
        np.zeros(L),
        # [25] has_base64_segment
        np.zeros(L),
        # [26] has_double_slash
        np.zeros(L),
        # [27] is_dangerous_protocol
        np.zeros(L),
        # [28] impersonates_brand
        np.zeros(L),
        # [29] is_typosquat
        np.zeros(L),
        # [30] brand_in_subdomain
        np.zeros(L),
        # [31] is_url_shortener
        np.zeros(L),
        # [32] has_cf_bypass
        np.zeros(L),
        # [33] has_open_redirect
        np.zeros(L),
        # [34] has_punycode
        np.zeros(L),
        # [35] domain_looks_random
        np.zeros(L),
        # [36] has_suspicious_fragment
        np.zeros(L),
        # [37] long_query
        _b(0.10, L),
    ])

    X = np.vstack([ph, lg])
    y = np.array([1] * P + [0] * L)

    # Small Gaussian noise to prevent overfitting on synthetic data
    noise = np.random.normal(0, 0.05, X.shape)
    X = np.clip(X + noise, 0, None)

    return X, y


def train_phishing_model():
    print("=" * 60)
    print("  🔵 Training Phishing URL Classifier (Ensemble v2.0)")
    print("=" * 60)

    X, y = generate_phishing_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )

    # ── Sub-models ─────────────────────────────────────────────────────
    rf = RandomForestClassifier(
        n_estimators=300,
        max_depth=18,
        min_samples_split=3,
        min_samples_leaf=1,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    gbm = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=7,
        learning_rate=0.08,
        subsample=0.85,
        min_samples_split=4,
        random_state=42,
    )

    lr = Pipeline([
        ("scaler", StandardScaler()),
        ("lr", LogisticRegression(
            C=2.0,
            class_weight="balanced",
            max_iter=2000,
            solver="lbfgs",
            random_state=42,
        )),
    ])

    # ── Voting ensemble — soft voting uses predicted probabilities ─────
    ensemble = VotingClassifier(
        estimators=[("rf", rf), ("gbm", gbm), ("lr", lr)],
        voting="soft",
        weights=[3, 3, 1],   # RF & GBM are stronger on tabular data
        n_jobs=-1,
    )

    print("  Training ensemble (RF × 300 + GBM × 200 + LR) on 20 000 samples …")
    ensemble.fit(X_train, y_train)

    y_pred = ensemble.predict(X_test)
    y_prob = ensemble.predict_proba(X_test)[:, 1]
    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)

    print(f"\n  ✅ Accuracy : {acc:.2%}")
    print(f"  ✅ ROC-AUC  : {auc:.4f}")
    print()
    print(classification_report(y_test, y_pred, target_names=["Legitimate", "Phishing"]))

    path = os.path.join(OUTPUT_DIR, "phishing_model.pkl")
    with open(path, "wb") as f:
        pickle.dump(ensemble, f)
    print(f"  💾 Saved: {path}")
    return ensemble


# ══════════════════════════════════════════════════════════════════════
# 2. FAKE NEWS MODEL  (unchanged from v1, already performs well)
# ══════════════════════════════════════════════════════════════════════

FAKE_HEADLINES = [
    "SHOCKING: Government secretly injects microchips into COVID vaccines!!!",
    "Scientists PROVE eating chocolate cures all cancers INSTANTLY",
    "EXPLOSIVE: Deep state shadow government exposed by insider",
    "They don't want you to know this miracle cure for diabetes",
    "ALERT: 5G towers secretly spreading mind control radiation",
    "Billionaire BANNED from mainstream media after exposing truth",
    "SECRET NASA footage proves moon landing was FAKED",
    "Big pharma HIDING cure for cancer to protect profits EXPOSED",
    "WAKE UP: Climate change is a hoax invented by globalists",
    "Celebrity satanic rituals exposed by whistleblower EXCLUSIVE",
    "FREE energy device suppressed by oil companies revealed",
    "BREAKING: George Soros caught funding antifa terrorist network",
    "Doctor claims eating raw garlic kills COVID virus instantly",
    "BOMBSHELL: Election machines hacked by foreign government",
    "Researchers DISCOVER ancient cure suppressed for 200 years",
    "CRISIS: Banks planning to confiscate all savings accounts",
    "Alien disclosure IMMINENT as government covers up Area 51",
    "COVID cure discovered by village healer SILENCED by WHO",
    "Fluoride in water PROVEN to lower IQ says suppressed study",
    "REVEALED: Chemtrails contain mind control chemicals",
    "Scientists find cure for all diseases using common herb",
    "URGENT: New world order plans global takeover next month",
    "Elite pedophile ring exposed, media REFUSES to cover it",
    "Man dies 60 seconds after COVID vaccine SHOCKING video",
    "Ancient prophecy predicts imminent apocalypse THIS YEAR",
    "BANNED STUDY: Vaccines linked to autism covered up for decades",
    "SECRET: Bill Gates funding plan to reduce world population",
    "WHISTLEBLOWER: CIA assassinated JFK for exposing truth",
    "PROOF: Moon is artificial structure built by aliens",
    "HIDDEN: Cancer cure suppressed since 1930s by pharmaceutical cartel",
]

REAL_HEADLINES = [
    "Federal Reserve raises interest rates by 25 basis points amid inflation concerns",
    "Scientists publish peer-reviewed study on climate change adaptation strategies",
    "New smartphone model released with improved battery life and camera features",
    "Stock markets close modestly higher following positive economic data",
    "Researchers develop new cancer treatment showing promise in clinical trials",
    "Government announces infrastructure spending plan worth billions",
    "Tech company reports quarterly earnings beating analyst expectations",
    "World leaders meet at climate summit to discuss emissions targets",
    "Study finds regular exercise reduces risk of cardiovascular disease",
    "Airlines report record passenger numbers as travel demand rebounds",
    "Pharmaceutical company receives FDA approval for new diabetes drug",
    "City council approves budget for public transportation improvements",
    "University researchers make breakthrough in quantum computing research",
    "Netflix reports subscriber growth in latest quarterly results",
    "NASA announces new mission to explore Jupiter moons",
    "Global food prices stabilize after supply chain disruptions ease",
    "Central bank warns of recession risks amid tight monetary policy",
    "Electric vehicle sales reach new record in first quarter",
    "New study links sedentary lifestyle to increased health risks",
    "International trade talks resume after months of negotiations",
    "Tech startup raises funding round from venture capital investors",
    "Renewable energy capacity surpasses coal for first time in region",
    "Housing market shows signs of cooling as mortgage rates rise",
    "New vaccine approved for clinical trials after positive phase two results",
    "Economic indicators suggest moderate growth for upcoming quarter",
    "Scientists report progress in developing more efficient solar panels",
    "Government releases annual report on economic performance",
    "Researchers publish findings on effectiveness of new antibiotics",
    "City announces expansion of public transit network",
    "International aid organizations respond to regional flooding disaster",
]


def generate_fake_news_dataset():
    np.random.seed(42)
    fake_texts, real_texts = [], []
    sensational_prefixes = ["BREAKING: ", "EXCLUSIVE: ", "SHOCKED: ", "URGENT: ", "ALERT: "]
    neutral_prefixes = ["Report: ", "Study: ", "Officials say: ", "Data shows: ", ""]

    for h in FAKE_HEADLINES:
        fake_texts.append(h)
        for p in sensational_prefixes[:3]:
            fake_texts.append(p + h)
        fake_texts.append(h + " Share before they delete this!")
        fake_texts.append(h + " The mainstream media won't tell you this.")
        fake_texts.append(h + " LIKE AND SHARE!!!")

    for h in REAL_HEADLINES:
        real_texts.append(h)
        for p in neutral_prefixes[:3]:
            real_texts.append(p + h)
        real_texts.append(h + ", according to officials.")
        real_texts.append(h + ", data confirms.")

    min_len = min(len(fake_texts), len(real_texts))
    texts = fake_texts[:min_len] + real_texts[:min_len]
    labels = [1] * min_len + [0] * min_len
    return texts, labels


def train_fake_news_model():
    print("\n" + "=" * 60)
    print("  🔵 Training Fake News Classifier")
    print("=" * 60)
    texts, labels = generate_fake_news_dataset()
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    vectorizer = TfidfVectorizer(
        max_features=8000,
        ngram_range=(1, 2),
        stop_words="english",
        sublinear_tf=True,
    )

    model = LogisticRegression(
        C=1.5,
        class_weight="balanced",
        max_iter=2000,
        random_state=42,
    )

    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    model.fit(X_train_vec, y_train)

    y_pred = model.predict(X_test_vec)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n  ✅ Fake News Accuracy: {acc:.2%}")
    print(classification_report(y_test, y_pred, target_names=["Real", "Fake"]))

    model_path = os.path.join(OUTPUT_DIR, "fake_news_model.pkl")
    vec_path = os.path.join(OUTPUT_DIR, "fake_news_vectorizer.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(model, f)
    with open(vec_path, "wb") as f:
        pickle.dump(vectorizer, f)

    print(f"  💾 Saved: {model_path}")
    print(f"  💾 Saved: {vec_path}")
    return model, vectorizer


# ══════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    train_phishing_model()
    train_fake_news_model()
    print("\n" + "=" * 60)
    print("  ✅ All models trained and saved successfully!")
    print("=" * 60)
