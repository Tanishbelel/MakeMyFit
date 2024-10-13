const festivals = [
    { name: 'Diwali', image: 'Diwali.avif' },
    { name: 'Christmas', image: 'christmas.jpg' },
    { name: 'Holi', image: 'holi.webp' },
    { name: 'Navratri', image: 'navratri.jpg' },
    { name: 'Raksha Bandhan', image: 'Raksha.jpg' },
    { name: 'Pongal', image: 'pongal.jpg' },
    { name: 'Ganesh Chaturthi', image: 'ganesh_chaturthi.jpg' },
    { name: 'Onam', image: 'onam.jpg' },
    { name: 'Vasant Panchami', image: 'vasant_panchami.jpg' }
];

// Display initial set of festivals
let displayedFestivals = 5;  // Show only 5 festivals initially
const festivalGrid = document.getElementById('festivalGrid');
const moreBtn = document.getElementById('moreBtn');

function displayFestivals(count) {
    festivalGrid.innerHTML = '';  // Clear existing grid
    festivals.slice(0, count).forEach(festival => {
        const card = document.createElement('div');
        card.className = 'festival-card';
        card.innerHTML = `
            <img src="${festival.image}" alt="${festival.name}">
            <h3>${festival.name}</h3>
        `;
        card.addEventListener('click', () => showOutfitSuggestions(festival.name));
        festivalGrid.appendChild(card);
    });

    // Hide "More" button if all festivals are shown
    if (count >= festivals.length) {
        moreBtn.style.display = 'none';
    }
}

// Initially display the first set of festivals
displayFestivals(displayedFestivals);

// Add more festivals when "More" button is clicked
moreBtn.addEventListener('click', () => {
    displayedFestivals += 3;  // Show 3 more festivals
    displayFestivals(displayedFestivals);
});

// Show outfit suggestions
const outfitSuggestionDiv = document.getElementById('outfitSuggestion');
const festivalTitle = document.getElementById('festivalTitle');
const suggestionsDiv = document.getElementById('suggestions');
const closeBtn = document.getElementById('closeBtn');

function showOutfitSuggestions(festivalName) {
    festivalTitle.textContent = `Outfit Suggestions for ${festivalName}`;
    
    // Fetch data from backend or database (mocked here)
    const outfitSuggestions = fetchOutfitSuggestionsFromDB(festivalName);

    // Clear old suggestions
    suggestionsDiv.innerHTML = '';

    // Add new suggestions
    outfitSuggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.textContent = suggestion;
        suggestionsDiv.appendChild(suggestionDiv);
    });

    // Show the suggestion modal
    outfitSuggestionDiv.style.display = 'block';
}

closeBtn.addEventListener('click', () => {
    outfitSuggestionDiv.style.display = 'none';
});

// Mock function to simulate fetching data from a database
function fetchOutfitSuggestionsFromDB(festivalName) {
    const suggestions = {
        Diwali: ['Traditional Kurta', 'Saree', 'Lehenga'],
        Christmas: ['Red Dress', 'Sweater', 'Overcoat'],
        Eid: ['Salwar Kameez', 'Sherwani', 'Hijab'],
        Holi: ['White T-shirt', 'Casual Jeans', 'Bright Scarf'],
        Navratri: ['Chaniya Choli', 'Garba Outfits', 'Kurta Pajama'],
        'Raksha Bandhan': ['Salwar Suit', 'Kurti', 'Sherwani'],
        Pongal: ['Traditional Veshti', 'Saree'],
        'Ganesh Chaturthi': ['Kurta Pajama', 'Saree'],
        Onam: ['Kasavu Saree', 'Mundu'],
        'Vasant Panchami': ['Yellow Dress', 'Kurta', 'Sari']
    };

    return suggestions[festivalName] || [];
}
