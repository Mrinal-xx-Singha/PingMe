import axios from "axios"

export function extractUrl(text) {
    const urlRegext = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegext)
    return match ? match[0] : null;
}

// Fetch the page and parse OG tags 
export async function fetchLinkPreview(url) {
    try {
        const { data: html } = await axios.get(url, {
            timeout: 5000,
            headers: { "User-Agent": 'bot' }
        })
        // Use regex to extract og:title,og:description,og:image from the HTML
        const getMetaTag = (property) => {
            const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, "i")
            const match = html.match(regex)
            return match ? match[1] : null
        }

        const title = getMetaTag("og:title") || ""
        const description = getMetaTag("og:description") || ""
        const image = getMetaTag("og:image") || ""


        // Only return a preview if we got at least a title
        if (!title) return null
        return { url, title, description, image }
    } catch (error) {
        console.error("Link preview fetch failed:", error.message)
        return null
    }
}