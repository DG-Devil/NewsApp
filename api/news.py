# api/news.py
import os
import requests
import json
from datetime import datetime, timedelta

def handler(event, context):
    query_params = event.get("query") or {}
    query = query_params.get("query")
    if not query:
        return {"statusCode": 400, "body": "Query parameter missing"}

    API_KEY = os.environ.get("48d918617df64896b32e4687bc8b5aab")
    if not API_KEY:
        return {"statusCode": 500, "body": "API key not configured"}

    today = datetime.utcnow()
    two_days_ago = today - timedelta(days=2)

    params = {
        "q": query,
        "from": two_days_ago.strftime("%Y-%m-%d"),
        "to": today.strftime("%Y-%m-%d"),
        "sortBy": "publishedAt",
        "language": "en",
        "apiKey": API_KEY
    }

    try:
        res = requests.get("https://newsapi.org/v2/everything", params=params)
        data = res.json()
    except Exception as e:
        return {"statusCode": 500, "body": f"Error fetching news: {str(e)}"}

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps(data)
    }
