import sys
import os
import re
from datetime import datetime, timezone

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.ml_utils import predict_fake_news
from services.gemini_service import analyze_news_credibility

SENSATIONAL_PATTERNS = [
    r"\bshocking\b", r"\bexplosive\b", r"\bmiracle\b", r"\bcure\b",
    r"\bconspiracy\b", r"\bsecret\b", r"\bbanned\b", r"\bexclusive\b",
    r"\bbreaking\b", r"\bcritical\b", r"\bwake up\b", r"\bthey (don't|won'?t) want\b",
    r"\!{2,}", r"\b(?:[A-Z]{4,})\b"
]

SOURCE_CREDIBILITY = {
    "reuters": 0.94, "bbc": 0.92, "associated press": 0.93, "apnews": 0.93,
    "npr": 0.91, "cnn": 0.78, "foxnews": 0.72, "theguardian": 0.88,
    "nytimes": 0.87, "washingtonpost": 0.86, "bloomberg": 0.89,
    "techcrunch": 0.80, "wired": 0.82, "theverge": 0.81,
    "infowars": 0.12, "naturalnews": 0.15, "breitbart": 0.35,
    "blogspot": 0.30, "wordpress": 0.35,
}


async def analyze_fake_news(headline: str, article_text: str = "", source_url: str = "") -> dict:
    """Full fake news analysis pipeline."""
    combined_text = f"{headline} {article_text}"

    # ML model prediction
    ml_probability = predict_fake_news(combined_text)

    # Gemini reasoning
    gemini_reasoning = analyze_news_credibility(headline, article_text)

    # Language pattern analysis
    language_flags = _detect_language_patterns(headline, article_text)

    # Source credibility
    source_score = _get_source_credibility(source_url)

    # Composite fake probability
    sensationalism_score = len(language_flags) * 0.05
    fake_probability = (ml_probability * 0.5) + (sensationalism_score * 0.3) + \
                       ((1 - source_score) * 0.2)
    fake_probability = min(max(fake_probability, 0.0), 0.99)

    credibility_score = round((1 - fake_probability) * 100, 1)
    fake_pct = round(fake_probability * 100, 1)

    ml_classification = "FAKE" if ml_probability > 0.5 else "LEGITIMATE"
    overall_verdict = _get_verdict(fake_probability)

    return {
        "headline": headline,
        "credibility_score": credibility_score,
        "fake_probability": fake_pct,
        "ml_classification": ml_classification,
        "gemini_reasoning": gemini_reasoning,
        "language_flags": language_flags,
        "overall_verdict": overall_verdict,
        "scan_time": datetime.now(timezone.utc),
    }


def _detect_language_patterns(headline: str, article_text: str) -> list:
    """Detect sensationalist or misleading language patterns."""
    flags = []
    text = f"{headline} {article_text}".lower()

    if any(re.search(p, text, re.IGNORECASE) for p in SENSATIONAL_PATTERNS[:6]):
        flags.append("Sensationalist language detected")

    all_caps_words = [w for w in headline.split() if w.isupper() and len(w) > 2]
    if len(all_caps_words) > 1:
        flags.append("Excessive capitalization in headline")

    if headline.count("!") > 1:
        flags.append("Multiple exclamation marks in headline")

    if len(headline) > 120:
        flags.append("Unusually long headline (clickbait pattern)")

    vague_words = ["they", "some people", "experts say", "sources claim", "allegedly"]
    if any(w in text for w in vague_words):
        flags.append("Vague sourcing language detected")

    emotional_words = ["outrage", "furious", "destroy", "annihilate", "crisis", "disaster"]
    if any(w in text for w in emotional_words):
        flags.append("Emotionally charged language detected")

    return flags


def _get_source_credibility(source_url: str) -> float:
    """Get source credibility based on URL."""
    if not source_url:
        return 0.5
    url_lower = source_url.lower()
    for source, score in SOURCE_CREDIBILITY.items():
        if source in url_lower:
            return score
    return 0.5


def _get_verdict(fake_probability: float) -> str:
    if fake_probability >= 0.75:
        return "LIKELY FAKE"
    elif fake_probability >= 0.50:
        return "QUESTIONABLE"
    elif fake_probability >= 0.25:
        return "MOSTLY CREDIBLE"
    else:
        return "CREDIBLE"
