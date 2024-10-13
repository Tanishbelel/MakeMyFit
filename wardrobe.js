document.addEventListener('DOMContentLoaded', () => {
    const itemImageInput = document.getElementById('itemImage');
    const wardrobeGrid = document.getElementById('wardrobeGrid');
    const openCameraBtn = document.getElementById('openCameraBtn');
    const cameraContainer = document.getElementById('cameraContainer');
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('captureBtn');
    const canvas = document.getElementById('canvas');
    const sendForDetectionBtn = document.getElementById('sendForDetectionBtn'); // New button

    let localStream;

    sendForDetectionBtn.addEventListener('click', () => {
        const file = itemImageInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTimeout(() => {
                    const wardrobeItem = document.createElement('div');
                    wardrobeItem.classList.add('wardrobe-item');

                    wardrobeItem.innerHTML = `
                        <div class="item-image">
                            <img src="${reader.result}" alt="Tshirt">
                        </div>
                        <div class="item-details">
                            <h3>Tshirt</h3> <!-- Hardcoded category -->
                            <p>Season: Summer</p> <!-- Hardcoded season -->
                            <p class="item-status status-available">Available</p>
                        </div>
                    `;

                    const removeItemBtn = document.createElement('button');
                    removeItemBtn.classList.add('removeItemBtn');
                    removeItemBtn.innerText = 'Remove';
                    removeItemBtn.addEventListener('click', () => {
                        wardrobeGrid.removeChild(wardrobeItem);
                    });

                    wardrobeItem.appendChild(removeItemBtn);
                    wardrobeGrid.appendChild(wardrobeItem);
                }, 6000); // Delay of 3 seconds
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image.');
        }
    });

    openCameraBtn.addEventListener('click', () => {
        cameraContainer.style.display = 'block';
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                localStream = stream;
                video.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing webcam: ', error);
            });
    });

    captureBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const capturedImage = canvas.toDataURL('image/png');

        const wardrobeItem = document.createElement('div');
        wardrobeItem.classList.add('wardrobe-item');

        wardrobeItem.innerHTML = `
            <div class="item-image">
                <img src="${capturedImage}" alt="Captured Image">
            </div>
            <div class="item-details">
                <h3>Jacket</h3> <!-- Hardcoded category -->
                <p>Season: Winter</p> <!-- Hardcoded season -->
                <p class="item-status status-available">Available</p>
            </div>
        `;

        const removeItemBtn = document.createElement('button');
        removeItemBtn.classList.add('removeItemBtn');
        removeItemBtn.innerText = 'Remove';
        removeItemBtn.addEventListener('click', () => {
            wardrobeGrid.removeChild(wardrobeItem);
        });

        wardrobeItem.appendChild(removeItemBtn);
        wardrobeGrid.appendChild(wardrobeItem);

        // Stop the video stream
        localStream.getTracks().forEach(track => track.stop());
        cameraContainer.style.display = 'none';
    });
});
