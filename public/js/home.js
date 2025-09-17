import { API_HOST, fetchData } from './utils.js';

export function initHome() {
    console.log("Initializing Home component");

    // Add any home-specific logic here
    // For example, fetching stats or user progress
    fetchData(`${API_HOST}/api/flashcards`).then(data => {
        // Update the UI with the fetched data
        console.log('Flashcards data:', data);
    });
}
