"""
TrapEye — ML Utilities  v2.0
Loads phishing + fake-news models, with enhanced heuristic fallbacks.
"""
import pickle
import os
import sys
import numpy as np
from typing import Any, Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.settings import PHISHING_MODEL_PATH, FAKE_NEWS_MODEL_PATH, FAKE_NEWS_VECTORIZER_PATH

_phishing_model: Optional[Any] = None
_fakenews_model: Optional[Any] = None
_fakenews_vectorizer: Optional[Any] = None


def load_phishing_model():
    global _phishing_model
    if _phishing_model is None:
        if os.path.exists(PHISHING_MODEL_PATH):
            with open(PHISHING_MODEL_PATH, "rb") as f:
                _phishing_model = pickle.load(f)
    return _phishing_model


def load_fakenews_model():
    global _fakenews_model, _fakenews_vectorizer
    if _fakenews_model is None:
        if os.path.exists(FAKE_NEWS_MODEL_PATH):
            with open(FAKE_NEWS_MODEL_PATH, "rb") as f:
                _fakenews_model = pickle.load(f)
        if os.path.exists(FAKE_NEWS_VECTORIZER_PATH):
            with open(FAKE_NEWS_VECTORIZER_PATH, "rb") as f:
                _fakenews_vectorizer = pickle.load(f)
    return _fakenews_model, _fakenews_vectorizer


def predict_phishing(features: list) -> float:
    """Returns phishing probability (0.0 to 1.0)."""
    model = load_phishing_model()
    if model is None:
        return _heuristic_phishing_score(features)
    try:
        X = np.array(features, dtype=float).reshape(1, -1)
        prob = model.predict_proba(X)[0][1]
        return float(prob)
    except Exception:
        return _heuristic_phishing_score(features)


def predict_fake_news(text: str) -> float:
    """Returns fake news probability (0.0 to 1.0)."""
    model, vectorizer = load_fakenews_model()
    if model is None or vectorizer is None:
        return _heuristic_fake_news_score(text)
    try:
        X = vectorizer.transform([text])
        prob = model.predict_proba(X)[0][1]
        return float(prob)
    except Exception:
        return _heuristic_fake_news_score(text)


# ──────────────────────────────────────────────────────────────────────
# HEURISTIC FALLBACK — mirrors generate_models.py feature order (38 features)
# ──────────────────────────────────────────────────────────────────────
def _heuristic_phishing_score(features: list) -> float:
    """
    Enhanced heuristic covering all 38 features when ML model is unavailable.
    Feature order: see feature_extractor.py FEATURE_ORDER
    """
    try:
        (
            url_length, domain_length, path_length, num_dots, num_subdomains,
            has_ip, has_https, has_port,
            num_hyphens, num_at, num_question, num_ampersand, num_equals,
            num_slash, num_percent, special_char_overload,
            num_kw, has_critical_kw,
            suspicious_tld, trusted_tld,
            domain_entropy, path_entropy, subdomain_entropy,
            digit_ratio,
            has_hex, has_base64, has_double_slash, is_dangerous_proto,
            impersonates_brand, is_typosquat, brand_in_subdomain,
            is_url_shortener, has_cf_bypass, has_open_redirect,
            has_punycode, domain_looks_random, has_suspicious_fragment,
            long_query,
        ) = features[:38]
    except ValueError:
        return 0.5  # safe default if feature count mismatch

    score = 0.0

    # Hard-weight signals
    if is_dangerous_proto:    score += 0.50
    if has_ip:                score += 0.30
    if brand_in_subdomain:    score += 0.28
    if has_critical_kw:       score += 0.25
    if is_typosquat:          score += 0.22
    if has_punycode:          score += 0.22
    if has_cf_bypass:         score += 0.18
    if impersonates_brand:    score += 0.18
    if suspicious_tld:        score += 0.18
    if domain_looks_random:   score += 0.15
    if has_open_redirect:     score += 0.14
    if num_at > 0:            score += 0.14
    if has_base64:            score += 0.12
    if is_url_shortener:      score += 0.10
    if has_hex:               score += 0.10
    if not has_https:         score += 0.10
    if special_char_overload: score += 0.10

    # Medium-weight signals
    if num_subdomains > 3:    score += 0.08 * (num_subdomains - 2)
    if num_kw > 0:            score += 0.06 * min(num_kw, 5)
    if domain_entropy > 3.8:  score += 0.10
    elif domain_entropy > 3.4: score += 0.06
    if digit_ratio > 0.4:     score += 0.08
    if url_length > 200:      score += 0.10
    elif url_length > 100:    score += 0.06
    if has_double_slash:      score += 0.06
    if long_query:            score += 0.06
    if has_port:              score += 0.05
    if num_hyphens > 5:       score += 0.06

    # Reduce for trusted domains
    if trusted_tld:           score -= 0.10

    return min(max(score, 0.0), 0.99)


def _heuristic_fake_news_score(text: str) -> float:
    """Fallback heuristic for fake news when model unavailable."""
    text_lower = text.lower()
    sensational_words = [
        "shocking", "unbelievable", "explosive", "breaking", "exclusive",
        "secret", "miracle", "cure", "conspiracy", "exposed", "banned",
        "hidden", "they don't want", "wake up", "sheeple", "cover-up",
        "coverup", "whistleblower", "deep state", "fake media",
    ]
    score = sum(0.07 for w in sensational_words if w in text_lower)
    all_caps = sum(1 for w in text.split() if w.isupper() and len(w) > 2)
    score += min(all_caps * 0.05, 0.25)
    score += text.count("!") * 0.03
    score += text.count("?") * 0.02
    return min(score, 0.95)
