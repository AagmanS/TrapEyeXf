import google.generativeai as genai
import base64
import sys
import os
from typing import Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.settings import GEMINI_API_KEY

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def analyze_news_credibility(headline: str, article_text: str) -> str:
    """Use Gemini to analyze news article credibility."""
    if not GEMINI_API_KEY:
        return "Gemini API not configured. Please set GEMINI_API_KEY."

    try:
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        prompt = f"""You are a professional fact-checker and media analyst. Analyze the credibility of the following news article.

Headline: {headline}

Article Text: {article_text[:2000] if article_text else 'No article text provided.'}

Please analyze:
1. Language patterns (sensationalism, emotional manipulation, clickbait)
2. Evidence quality and source reliability indicators
3. Logical consistency of claims
4. Overall credibility assessment

Provide a structured response with:
- Key concerns (if any)
- Positive credibility indicators (if any)
- Brief verdict (2-3 sentences)

Keep your response concise and professional."""

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"Gemini analysis unavailable: {str(e)}"


def analyze_image_for_deepfake(image_bytes: bytes, filename: str) -> str:
    """Use Gemini Vision to analyze image for deepfake indicators."""
    if not GEMINI_API_KEY:
        return "Gemini Vision API not configured. Please set GEMINI_API_KEY."

    try:
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        image_b64 = base64.b64encode(image_bytes).decode()

        # Determine MIME type
        if filename.lower().endswith(".png"):
            mime_type = "image/png"
        elif filename.lower().endswith(".webp"):
            mime_type = "image/webp"
        else:
            mime_type = "image/jpeg"

        image_part = {
            "inline_data": {
                "mime_type": mime_type,
                "data": image_b64
            }
        }

        prompt = """You are an expert in digital media forensics and deepfake detection. 
        
Analyze this image carefully for signs of AI generation or manipulation:

Look for:
1. Unnatural facial features (asymmetry, inconsistent skin texture, odd blending at edges)
2. Lighting and shadow inconsistencies
3. Background artifacts or blurring
4. Hair and teeth irregularities (common deepfake artifacts)
5. Unnatural eye reflections or pupil shapes
6. Compression artifacts inconsistent with authentic photos
7. Overall image coherence

Provide:
- Specific observations (2-4 bullet points)
- Whether the image shows AI/deepfake indicators
- Confidence assessment: Low / Medium / High

Be concise and technical."""

        response = model.generate_content([prompt, image_part])
        return response.text

    except Exception as e:
        return f"Gemini Vision analysis unavailable: {str(e)}"


def analyze_url_context(url: str, page_content: Optional[str] = None) -> str:
    """Use Gemini to analyze URL/webpage context for phishing indicators."""
    if not GEMINI_API_KEY:
        return "Gemini API not configured."

    try:
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        content_section = f"\nPage content preview: {page_content[:500]}" if page_content else ""

        prompt = f"""You are a cybersecurity expert specializing in phishing detection.

Analyze this URL for phishing indicators: {url}{content_section}

Assess:
1. Domain legitimacy and trustworthiness
2. URL structure anomalies
3. Potential brand impersonation
4. Red flags in URL patterns

Provide 2-3 bullet points of key observations and a brief verdict."""

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"Gemini context analysis unavailable: {str(e)}"
