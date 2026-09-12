import axios from "axios";

export const getNews = async (req, res) => {
    try {
        // Fetching top 10 tech news posts directly from Reddit (No API Key needed!)
        const response = await axios.get("https://www.reddit.com/r/technology/hot.json?limit=10");
        
        const articles = response.data.data.children.map(post => ({
            id: post.data.id,
            title: post.data.title,
            link: `https://reddit.com${post.data.permalink}`,
            author: post.data.author,
            score: post.data.score,
            // Only grab a thumbnail if Reddit actually provided a valid image URL
            thumbnail: post.data.thumbnail.startsWith("http") ? post.data.thumbnail : null,
        }));

        res.status(200).json(articles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch news feed" });
    }
};
