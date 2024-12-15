export type WikipediaResult = {
    title: string;
    snippet: string;
    url: string;
};

export async function wikipediaSearch(query: string, language: string = 'en'): Promise<WikipediaResult[]> {
    try {
        // Dynamically adjust the Wikipedia API URL based on the user's language
        const apiUrl = `https://${language}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&origin=*`;

        // Perform the API call using fetch
        const response = await fetch(apiUrl);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Extract and map search results
        const results = data.query?.search || [];

        return results.map((result: { title: string, snippet: string }) => {
            return {
                title: result.title,
                snippet: result.snippet,
                url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
            };
        });
    } catch (error) {
        console.error('Error fetching data from Wikipedia:', error);
        return [];
    }
}
