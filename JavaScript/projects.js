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

const textBoxes = document.querySelectorAll('.text-box');
const followImage = document.querySelector('.follow-image');

textBoxes.forEach((textBox) => {
  textBox.addEventListener('mouseenter', () => {
    const imageSrc = textBox.getAttribute('data-image');
    followImage.src = imageSrc; // Set the image source
    followImage.style.display = 'block'; // Show the image
  });

  textBox.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    followImage.style.left = `${clientX + 10}px`; // Offset to the right of the cursor
    followImage.style.top = `${clientY + 10}px`; // Offset below the cursor
  });

  textBox.addEventListener('mouseleave', () => {
    followImage.style.display = 'none'; // Hide the image
  });
});

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

  

