const slides = document.querySelectorAll(".slide");
let currIndex = 0;
let prevIndex = (currIndex + slides.length - 1) % slides.length;
let nextIndex = (currIndex + 1) % slides.length;

slides[currIndex].classList.add("active-slide");
slides[prevIndex].classList.add("prev-slide");
slides[nextIndex].classList.add("next-slide");

function updateSlides() {
    slides.forEach((slide, index) => {
        slide.classList.remove("prev-slide", "active-slide", "next-slide");
        if (index === prevIndex) {
            slide.classList.add("prev-slide");
        } else if (index === currIndex) {
            slide.classList.add("active-slide");
        } else if (index === nextIndex) {
            slide.classList.add("next-slide");
        }
    });
}

function slidePrev() {
    nextIndex = currIndex; 
    currIndex = prevIndex; 
    prevIndex = (prevIndex + slides.length - 1) % slides.length; 

    updateSlides();
}

function slideNext() {
    prevIndex = currIndex;
    currIndex = nextIndex;
    nextIndex = (nextIndex + 1) % slides.length;

    updateSlides();
}

document.querySelector(".carousel-prev").addEventListener("click", slidePrev);
document.querySelector(".carousel-next").addEventListener("click", slideNext);
