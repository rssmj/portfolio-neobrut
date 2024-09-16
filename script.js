document.addEventListener('DOMContentLoaded', () => {
  const background = document.getElementById('background');
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Create dots
  const totalDots = Math.floor((screenWidth * screenHeight) / 400); // One dot per 400px²
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    background.appendChild(dot);
  }

  const dots = document.querySelectorAll('.dot');
  const rootStyles = getComputedStyle(document.documentElement);

  // Throttle function to limit the rate of mousemove event execution
  function throttle(fn, wait) {
    let time = Date.now();
    return function (...args) {
      if (time + wait - Date.now() < 0) {
        fn(...args);
        time = Date.now();
      }
    };
  }

  // Adjust the glow based on distance and theme
  function adjustDots(e) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const dotColor = rootStyles.getPropertyValue('--dot-color').trim();

    dots.forEach((dot) => {
      const rect = dot.getBoundingClientRect();
      const dotX = rect.left + rect.width / 2;
      const dotY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - dotX, e.clientY - dotY);

      // Invert effect for light theme
      if (currentTheme === 'light') {
        if (distance < 100) {
          // Dots get darker as the mouse gets closer in light theme
          dot.style.backgroundColor = `rgba(0, 0, 0, ${2 + distance / 255})`;
        } else {
          // Reset distant dots to default color
          dot.style.backgroundColor = dotColor;
        }
      } else {
        // Dark theme: dots get brighter as the mouse gets closer
        if (distance < 100) {
          dot.style.backgroundColor = `rgba(255, 255, 255, ${
            1 - distance / 255
          })`;
        } else {
          dot.style.backgroundColor = dotColor;
        }
      }
    });
  }

  // Add throttled mousemove event
  document.addEventListener('mousemove', throttle(adjustDots, 0)); // 100ms throttle
});

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-menu');
  const navLinkItems = document.querySelectorAll('.nav-links a');
  const htmlElement = document.documentElement;

  // Function to update the theme icon
  function updateIcon() {
    const themeIcon = document.getElementById('theme-icon');
    if (htmlElement.getAttribute('data-theme') === 'dark') {
      themeIcon.textContent = '☀️'; // Sun icon for light mode
    } else {
      themeIcon.textContent = '🌙'; // Moon icon for dark mode
    }
  }

  // Update the icon on initial load
  updateIcon();

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    let theme =
      htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateIcon();
  });

  // Toggle navigation menu on icon click
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Handle navigation with JavaScript to avoid page reload
  navLinkItems.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent full page reload
      const target = event.target.getAttribute('href'); // Get link target

      // Load the content of the new page into the current page
      fetch(target)
        .then((response) => response.text())
        .then((html) => {
          const newContent = new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector('main').innerHTML;
          document.querySelector('main').innerHTML = newContent;
        });

      // Close the nav menu if in mobile view
      if (navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    });
  });
});
