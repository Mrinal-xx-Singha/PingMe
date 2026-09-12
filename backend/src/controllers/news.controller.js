import axios from "axios";

export const getNews = async (req, res) => {
    try {
        const response = await axios.get("https://dev.to/api/articles?per_page=10");

        const articles = response.data.map(post => ({
            id: post.id,
            title: post.title,
            link: post.url,
            author: post.user.username,
            thumbnail: post.cover_image || post.social_image,
        }));

        res.status(200).json(articles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch news feed" });
    }
};
