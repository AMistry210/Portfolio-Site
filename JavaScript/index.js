//custom cursor
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    // Move the cursor dot directly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Smoothly animate the cursor outline
    cursorOutline.animate(
        {
            left: `${posX}px`,
            top: `${posY}px`,
        },
        { duration: 500, fill: "forwards" }
    );
});


const textArray = [
    "Computer Science Graduate",
    "Aspiring Developer",
    "Determined Coder",
    "Lifelong Learner",
    "3D Artist"
];

//typwriter effect
const typingSpeed = 150; 
const pauseBetweenWords = 1500; 
const typewriterSpan = document.querySelector(".typewriter span");

let arrayIndex = 0;
let charIndex = 0;

function typeText() {
    if (charIndex < textArray[arrayIndex].length) {
        typewriterSpan.textContent += textArray[arrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeText, typingSpeed);
    } else {
        setTimeout(eraseText, pauseBetweenWords);
    }
}

function eraseText() {
    if (charIndex > 0) {
        typewriterSpan.textContent = textArray[arrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, typingSpeed);
    } else {
        arrayIndex = (arrayIndex + 1) % textArray.length; 
        setTimeout(typeText, typingSpeed);
    }
}

typeText();

// Dark mode
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check if dark mode is enabled in localStorage
    if (localStorage.getItem('dark-mode') === 'enabled') {
        body.classList.add('dark-mode');
        toggleButton.checked = true; // Ensure the toggle reflects the saved state
    }

    // Toggle dark mode on checkbox state change
    toggleButton.addEventListener('change', () => {
        if (toggleButton.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
    });
});

  

