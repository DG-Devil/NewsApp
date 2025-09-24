import fetch from "node-fetch";

export default async function handler(req, res) {
    const query = req.query.query;

    if (!query) {
        res.status(400).json({ error: "Query parameter missing" });
        return;
    }

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "API key not configured" });
        return;
    }

    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    const from = twoDaysAgo.toISOString().split("T")[0];
    const to = today.toISOString().split("T")[0];

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${from}&to=${to}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
