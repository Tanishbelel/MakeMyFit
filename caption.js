document.addEventListener('DOMContentLoaded', function() {
    const outfitInput = document.getElementById('outfitInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const outfitPreview = document.getElementById('outfitPreview');
    const previewImage = document.getElementById('previewImage');
    const shareSection = document.getElementById('social-sharing');
    const facebookShare = document.getElementById('share-facebook');
    const instagramShare = document.getElementById('share-instagram'); // New Instagram button
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    const commentInput = document.getElementById('commentInput');
    const commentBtn = document.getElementById('commentBtn');
    const commentList = document.getElementById('commentList');
    const captionTable = document.getElementById('captionTable'); // Add this line
    const caption = document.getElementById('caption'); // Caption section for API response

    let likeCounter = 0;

    // Trigger file input click when upload button is clicked
    uploadBtn.addEventListener('click', () => {
        outfitInput.click(); // Programmatically click the hidden file input
    });

    // Handle file selection
    outfitInput.addEventListener('change', () => {
        const file = outfitInput.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result; // Set the image source to the file
                outfitPreview.hidden = false; // Show the preview
                shareSection.hidden = false; // Show sharing options

                // Update Facebook sharing link
                facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=http://127.0.0.1:5500/FRONTEND/Components/Feedback/#`;

                // Fetch caption from Perplexity API
                fetchCaption();
            }
            reader.readAsDataURL(file);
        }
    });

    // Like functionality
    likeBtn.addEventListener('click', () => {
        likeCounter++;
        likeCount.textContent = `${likeCounter} Likes`;
    });

    // Add Comment functionality
    commentBtn.addEventListener('click', () => {
        const commentText = commentInput.value;
        if (commentText.trim()) {
            const newComment = document.createElement('li');
            newComment.textContent = commentText;
            commentList.appendChild(newComment);
            commentInput.value = ''; // Clear the input field
        }
    });

    // Fetch caption from Perplexity API
    function fetchCaption() {
        const options = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer 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', // Replace with your API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                messages: [
                    {
                        role: 'system',
                        content: 'Be precise and concise. just results only 5 strings which contain the caption 1 by 1 like 1 ,2,3 ..5 and nothing else',
                    },
                    {
                        role: 'user',
                        content: 'Can you generate a caption for a fashion post? It should be for Instagram.',
                    },
                ],
                max_tokens: 100,
                temperature: 0.2,
            }),
        };

        fetch('https://api.perplexity.ai/chat/completions', options)
            .then((response) => response.json())
            .then((data) => {
                const captionTableBody = captionTable.getElementsByTagName('tbody')[0];
                captionTableBody.innerHTML = ''; // Clear existing captions

                if (data && data.choices && data.choices.length > 0) {
                    const captions = data.choices[0].message.content.split(','); // Split captions by comma
                    
                    captions.forEach((caption, index) => {
                        const row = captionTableBody.insertRow(); // Create a new row
                        const cell = row.insertCell(0); // Create a new cell
                        cell.textContent = `${index + 1}. ${caption.trim()}`; // Add caption text to the cell
                    });
                } else {
                    const row = captionTableBody.insertRow(); // Create a new row for error message
                    const cell = row.insertCell(0); // Create a new cell
                    cell.textContent = 'Failed to generate captions.';
                }
            })
            .catch((err) => {
                console.error(err);
                const captionTableBody = captionTable.getElementsByTagName('tbody')[0];
                captionTableBody.innerHTML = ''; // Clear existing captions
                const row = captionTableBody.insertRow(); // Create a new row for error message
                const cell = row.insertCell(0); // Create a new cell
                cell.textContent = 'Error generating captions.';
            });
    }
});
