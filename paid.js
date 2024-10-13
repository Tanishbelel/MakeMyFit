document.querySelectorAll('.follow-btn').forEach(button => {
    button.addEventListener('click', function() {
      const influencerId = this.getAttribute('data-id');
      
      // Simulate a backend delay using setTimeout
      setTimeout(() => {
        // Open influencer-specific page in a new tab
        window.open(`influencer${influencerId}.html`, '_blank');
        
        // Display a popup message to inform the user
        alert(`You are now following influencer ${influencerId}!`);
      }, 2000); // 2000 milliseconds (2 seconds) delay
    });
  });
  
  