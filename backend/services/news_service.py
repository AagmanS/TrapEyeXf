import httpx
import asyncio
import sys
import os
from datetime import datetime, timezone
from typing import List, Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.settings import NEWS_API_KEY, NEWS_API_BASE_URL
from utils.ml_utils import predict_fake_news

CATEGORIES = ["technology", "science", "health", "business", "general", "entertainment"]


async def fetch_news(category: str = "general", page_size: int = 20) -> List[dict]:
    """Fetch latest news from NewsAPI and analyze credibility."""
    if not NEWS_API_KEY:
        return _get_mock_news()

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{NEWS_API_BASE_URL}/top-headlines",
                params={
                    "apiKey": NEWS_API_KEY,
                    "category": category,
                    "language": "en",
                    "pageSize": page_size,
                }
            )
            data = response.json()

        articles = []
        for article in data.get("articles", []):
            if not article.get("title"):
                continue

            title = article.get("title", "")
            description = article.get("description", "") or ""
            combined = f"{title} {description}"

            fake_prob = predict_fake_news(combined)
            credibility_score = round((1 - fake_prob) * 100, 1)
            is_suspicious = credibility_score < 40

            articles.append({
                "title": title,
                "description": description,
                "content": article.get("content", ""),
                "source_name": article.get("source", {}).get("name", "Unknown"),
                "source_url": article.get("url", ""),
                "published_at": article.get("publishedAt"),
                "credibility_score": credibility_score,
                "is_suspicious": is_suspicious,
                "category": category,
            })

        return articles

    except Exception as e:
        print(f"News API error: {e}")
        return _get_mock_news()


async def fetch_all_categories() -> List[dict]:
    """Fetch news from multiple categories concurrently."""
    tasks = [fetch_news(cat, 5) for cat in CATEGORIES[:4]]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    all_articles = []
    for r in results:
        if isinstance(r, list):
            all_articles.extend(r)
    return all_articles


def _get_mock_news() -> List[dict]:
    """Mock news data when API key is not available."""
    import random
    mock_articles = [
        {"title": "Scientists Make Breakthrough in Quantum Computing", "source_name": "Reuters",
         "credibility_score": 91.0, "is_suspicious": False, "category": "science"},
        {"title": "SHOCKING: Government HIDING Alien Contact Since 1950s!!!", "source_name": "BlogSite",
         "credibility_score": 12.0, "is_suspicious": True, "category": "general"},
        {"title": "Global Markets See Modest Gains Amid Economic Uncertainty", "source_name": "Bloomberg",
         "credibility_score": 88.0, "is_suspicious": False, "category": "business"},
        {"title": "AI Cures ALL Cancer Types Instantly — They Don't Want You To Know!", "source_name": "AlternativeHealth",
         "credibility_score": 8.0, "is_suspicious": True, "category": "health"},
        {"title": "New Climate Report Warns of Accelerating Temperature Rise", "source_name": "BBC",
         "credibility_score": 93.0, "is_suspicious": False, "category": "science"},
        {"title": "Tech Giant Launches Revolutionary Product Line", "source_name": "TechCrunch",
         "credibility_score": 82.0, "is_suspicious": False, "category": "technology"},
        {"title": "EXCLUSIVE: Celebrity SECRETLY Working for Shadow Government EXPOSED", "source_name": "Tabloid",
         "credibility_score": 5.0, "is_suspicious": True, "category": "entertainment"},
        {"title": "Federal Reserve Holds Interest Rates Steady", "source_name": "Associated Press",
         "credibility_score": 94.0, "is_suspicious": False, "category": "business"},
    ]
    for a in mock_articles:
        a.setdefault("description", a["title"])
        a.setdefault("content", "")
        a.setdefault("source_url", "")
        a.setdefault("published_at", datetime.now(timezone.utc).isoformat())
    return mock_articles
