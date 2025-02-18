let currentIndex = 0;
const projects = document.querySelectorAll('.sectionContent > div');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

function updateCarousel() {
    const offset = -currentIndex * 100;
    document.querySelector('.sectionContent').style.transform = `translateX(${offset}%)`;
}

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = projects.length - 1;
    }
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    if (currentIndex < projects.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
});

updateCarousel();