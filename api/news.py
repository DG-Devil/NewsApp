# api/news.py
import os, json, requests
from datetime import datetime, timedelta

def handler(event, context):
    query = event.get("query") or {}
    q = query.get("query")
    if not q:
        return {"statusCode": 400, "body": "Query parameter missing"}

    API_KEY = os.environ.get("NEWS_API_KEY")
    if not API_KEY:
        return {"statusCode": 500, "body": "API key not configured"}

    today = datetime.utcnow()
    two_days_ago = today - timedelta(days=2)

    params = {
        "q": q,
        "from": two_days_ago.strftime("%Y-%m-%d"),
        "to": today.strftime("%Y-%m-%d"),
        "sortBy": "publishedAt",
        "language": "en",
        "apiKey": API_KEY
    }

    try:
        response = requests.get("https://newsapi.org/v2/everything", params=params)
        data = response.json()
    except Exception as e:
        return {"statusCode": 500, "body": f"Error fetching news: {str(e)}"}

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(data)
    }
