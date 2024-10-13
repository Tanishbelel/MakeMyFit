// Sample data for clothing items
const clothingItems = [
    { id: 1, title: "Casual T-Shirt", category: "Dresses", imagePath: "1.png", availableFor: "Donate" },
    { id: 2, title: "Denim Jacket", category: "Outerwear", imagePath: "4.jpg", availableFor: "Rent" },
    { id: 3, title: "Casual T-Shirt", category: "Tops", imagePath: "2.png", availableFor: "Donate" },
    { id: 4, title: "Boots", category: "Footwear", imagePath: "5.avif", availableFor: "Rent" },
    { id: 5, title: "Casual T-Shirt", category: "Footwear", imagePath: "3.png", availableFor: "Donate" },
    { id: 6, title: "Winter Coat", category: "Outerwear", imagePath: "6.jpg", availableFor: "Rent" }
];
    
// Variables to track the modal and card being donated
let modal, closeModal, confirmDonationButton;
let currentCard;

// Load clothing items dynamically
document.addEventListener('DOMContentLoaded', function () {
    const donateGrid = document.getElementById('donateGrid');
    const rentGrid = document.getElementById('rentGrid');

    modal = document.getElementById('donationModal');
    closeModal = document.querySelector('.close');
    confirmDonationButton = document.getElementById('confirmDonation');

    let donateCounter = 0;
    let rentCounter = 0;

    clothingItems.forEach(item => {
        // Stop adding more than 3 cards per section
        if (item.availableFor === 'Donate' && donateCounter >= 3) return;
        if (item.availableFor === 'Rent' && rentCounter >= 3) return;

        const clothingCard = `
            <div class="clothing-card" data-id="${item.id}">
                <div class="card-image">
                    <img src="${item.imagePath}" alt="${item.title}">
                </div>
                <div class="card-details">
                    <h3>${item.title}</h3>
                    <p>Category: ${item.category}</p>
                </div>
                <div class="card-actions">
                    <button>${item.availableFor === 'Donate' ? 'Donate' : 'Rent'}</button>
                </div>
            </div>
        `;

        if (item.availableFor === 'Donate') {
            donateGrid.insertAdjacentHTML('beforeend', clothingCard);
            donateCounter++;  // Increment donate counter
        } else {
            rentGrid.insertAdjacentHTML('beforeend', clothingCard);
            rentCounter++;    // Increment rent counter
        }
    });

    // Event listener for Donate buttons
    donateGrid.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Donate') {
            currentCard = event.target.closest('.clothing-card'); // Get the card being donated
            showModal(); // Show donation confirmation modal
        }
    });

    // Event listeners for Rent buttons (similar to Donate)
    rentGrid.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Rent') {
            alert('Item rented!');
        }
    });

    // Function to show the modal
    function showModal() {
        modal.style.display = 'block';
    }

    // Close the modal
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Confirm donation and remove the card
    confirmDonationButton.addEventListener('click', function () {
        if (currentCard) {
            currentCard.remove(); // Remove the card from the DOM
            displayFittiesMessage(); // Display the 10 fitties message
        }
    });

    // Function to display "You are credited with 10 fitties" message
    function displayFittiesMessage() {
        const donationMessage = document.getElementById('donationMessage');
        // Update the modal message
        donationMessage.textContent = "You are credited with 10 fitties!";
        confirmDonationButton.style.display = 'none'; // Hide the confirmation button after donation

        // Show the modal with updated message for 3 seconds
        setTimeout(() => {
            donationMessage.textContent = "Perplexity - Donating clothes helps reduce carbon footprints by saving energy, water, and preventing landfill waste, significantly lowering greenhouse gas emissions.";
            confirmDonationButton.style.display = 'block'; // Show the confirmation button again
            modal.style.display = 'none'; // Hide the modal after displaying the message
        }, 3000); // Reset the message after 3 seconds
    }
});
