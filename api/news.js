import fetch from "node-fetch";

export default async function handler(req, res) {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query parameter missing" });

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key not configured" });

    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${twoDaysAgo.toISOString().split("T")[0]}&to=${today.toISOString().split("T")[0]}&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
