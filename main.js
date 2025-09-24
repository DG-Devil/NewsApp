const backendURL = "/api/news"; // Relative path to Vercel serverless function

async function searchNews() {
    const query = document.getElementById("query").value;
    if (!query) return alert("Please enter a topic");

    const container = document.getElementById("results");
    container.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch(`${backendURL}?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        container.innerHTML = "";
        if (!data.articles || data.articles.length === 0) {
            container.innerHTML = "<p>No articles found.</p>";
            return;
        }

        data.articles.forEach(article => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description || ""}</p>
                <small>${article.source.name} - ${new Date(article.publishedAt).toLocaleString()}</small><br>
                <a href="${article.url}" target="_blank">Read More</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p>Error fetching news: ${error}</p>`;
    }
}
