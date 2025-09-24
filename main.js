const backendURL = "/api/news";

async function searchNews() {
    const query = document.getElementById("query").value.trim();
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

            // Use article image or fallback image
            const imageUrl = article.urlToImage || "https://via.placeholder.com/180x120?text=No+Image";

            card.innerHTML = `
                <img src="${imageUrl}" alt="News Image">
                <div class="card-content">
                    <h3>${article.title}</h3>
                    <p>${article.description || ""}</p>
                    <small>${article.source.name} - ${new Date(article.publishedAt).toLocaleString()}</small><br>
                    <a href="${article.url}" target="_blank">Read More</a>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p>Error fetching news: ${error}</p>`;
    }
}
