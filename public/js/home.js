import { fetchData } from './utils.js';

export function initHome() {
    console.log("Initializing Home component");

    // Add any home-specific logic here
    // For example, fetching stats or user progress
    fetchData('https://us-central1-anylingo-2b0c7.cloudfunctions.net/api/flashcards').then(data => {
        // Update the UI with the fetched data
        console.log('Flashcards data:', data);
    });
}
