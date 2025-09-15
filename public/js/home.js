import { fetchData } from './utils.js';

export function initHome() {
    console.log("Initializing Home component");

    // Add any home-specific logic here
    // For example, fetching stats or user progress
    fetchData('http://localhost:3000/api/flashcards').then(data => {
        // Update the UI with the fetched data
        console.log('Flashcards data:', data);
    });
}
