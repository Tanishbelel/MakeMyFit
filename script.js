const thumbnails = document.querySelectorAll('.product-thumbnail');
const mainImage = document.querySelector('.main-image');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
    
        mainImage.src = thumbnail.src;
    });
});


const navLinks = document.querySelectorAll('.navbar ul li a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
       

        
        navLinks.forEach(nav => {
            nav.classList.remove('active');
            nav.style.transition = 'none'; 
        });

        
        setTimeout(() => {
            link.classList.add('active');
            link.style.transition = 'background-color 0.5s ease'; 
        }, 100);  
    });
});


window.addEventListener('load', () => {
    const currentPage = window.location.pathname.split("/").pop();  

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');  
        }
    });
});
