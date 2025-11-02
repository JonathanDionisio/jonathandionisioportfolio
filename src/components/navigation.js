// Navigation Component
// Creates the top navigation bar and toggle switches

import { gsap } from 'gsap';

let navigationBar = null;
let darkModeToggle = null;
let musicToggle = null;
let navButtons = [];

// Load background music
let backgroundMusic = null;
try {
  const bgMusicUrl = new URL('../assets/audio/bgmusic.mp3', import.meta.url).href;
  backgroundMusic = new Audio(bgMusicUrl);
  backgroundMusic.volume = 0.3; // Set volume to 30% to avoid being too loud
  backgroundMusic.loop = true; // Loop the music
  backgroundMusic.preload = 'auto';
} catch (e) {
  console.warn('Could not load background music:', e);
  try {
    backgroundMusic = new Audio('/src/assets/audio/bgmusic.mp3');
    backgroundMusic.volume = 0.3;
    backgroundMusic.loop = true;
    backgroundMusic.preload = 'auto';
  } catch (e2) {
    console.warn('Could not load background music from fallback path:', e2);
  }
}

export function createNavigation() {
  // Create navigation bar
  navigationBar = document.createElement('nav');
  navigationBar.className = 'main-navigation';
  
  // Create title section
  const titleSection = document.createElement('div');
  titleSection.className = 'nav-title-section';
  
  const titleLine1 = document.createElement('div');
  titleLine1.className = 'nav-title-line1';
  titleLine1.textContent = "JONATHAN'S";
  
  const titleLine2 = document.createElement('div');
  titleLine2.className = 'nav-title-line2';
  titleLine2.textContent = "PORTFOLIO";
  
  titleSection.appendChild(titleLine1);
  titleSection.appendChild(titleLine2);
  
  // Create navigation buttons container
  const navButtonsContainer = document.createElement('div');
  navButtonsContainer.className = 'nav-buttons-container';
  
  // About Me button
  const aboutMeBtn = createNavButton('ABOUT ME', 'poster', () => {
    triggerNavigationAction('poster');
  });
  navButtonsContainer.appendChild(aboutMeBtn);
  
  // Projects & Achievements button
  const projectsBtn = createNavButton('PROJECTS &<br>ACHIEVEMENTS', 'books', () => {
    triggerNavigationAction('books');
  });
  navButtonsContainer.appendChild(projectsBtn);
  
  // Technical Skills button
  const technicalSkillsBtn = createNavButton('TECHNICAL SKILLS', 'monitors', () => {
    triggerNavigationAction('monitors');
  });
  navButtonsContainer.appendChild(technicalSkillsBtn);
  
  navButtons = [aboutMeBtn, projectsBtn, technicalSkillsBtn];
  
  navigationBar.appendChild(titleSection);
  navigationBar.appendChild(navButtonsContainer);
  
  document.body.appendChild(navigationBar);
  
  // Create toggle switches container (bottom right)
  const togglesContainer = document.createElement('div');
  togglesContainer.className = 'toggles-container';
  
  // Dark Mode Toggle
  darkModeToggle = createToggle('Dark Mode', 'dark-mode-toggle', false, (isOn) => {
    handleDarkModeToggle(isOn);
  });
  togglesContainer.appendChild(darkModeToggle);
  
  // Music Toggle
  musicToggle = createToggle('Music', 'music-toggle', true, (isOn) => {
    handleMusicToggle(isOn);
  });
  togglesContainer.appendChild(musicToggle);
  
  // Start playing background music since toggle starts as "on"
  // Wait for audio to be ready and handle browser autoplay policies
  if (backgroundMusic) {
    // Try to play immediately
    const tryPlayMusic = () => {
      if (backgroundMusic && backgroundMusic.readyState >= 2) {
        // Audio is loaded enough to play
        backgroundMusic.play().catch(err => {
          console.debug('Autoplay blocked, user interaction required:', err);
          // This is normal - many browsers require user interaction before audio can play
        });
      } else if (backgroundMusic) {
        // Wait for audio to load
        backgroundMusic.addEventListener('canplay', () => {
          backgroundMusic.play().catch(err => {
            console.debug('Autoplay blocked, user interaction required:', err);
          });
        }, { once: true });
      }
    };
    
    // Try after a short delay to ensure DOM is ready
    setTimeout(tryPlayMusic, 300);
  }
  
  document.body.appendChild(togglesContainer);
  
  // Animate navigation in
  gsap.fromTo(navigationBar,
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 }
  );
  
  gsap.fromTo(togglesContainer,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', delay: 0.7 }
  );
  
  return { navigationBar, togglesContainer };
}

function createNavButton(text, type, onClick) {
  const button = document.createElement('button');
  button.className = 'nav-button';
  button.dataset.type = type;
  button.innerHTML = text;
  
  button.addEventListener('click', () => {
    if (!button.classList.contains('disabled')) {
      onClick();
    }
  });
  
  // Add hover effect
  button.addEventListener('mouseenter', () => {
    if (!button.classList.contains('disabled')) {
      gsap.to(button, { scale: 1.05, duration: 0.2 });
    }
  });
  
  button.addEventListener('mouseleave', () => {
    if (!button.classList.contains('disabled')) {
      gsap.to(button, { scale: 1, duration: 0.2 });
    }
  });
  
  return button;
}

function createToggle(label, className, initialState, onChange) {
  const toggleWrapper = document.createElement('div');
  toggleWrapper.className = `toggle-wrapper ${className}`;
  
  const toggle = document.createElement('div');
  toggle.className = 'toggle-switch';
  toggle.dataset.state = initialState ? 'on' : 'off';
  
  const track = document.createElement('div');
  track.className = 'toggle-track';
  
  const thumb = document.createElement('div');
  thumb.className = 'toggle-thumb';
  
  const icon = document.createElement('div');
  icon.className = 'toggle-icon';
  
  // Load icon images
  let iconUrl = '';
  try {
    if (className === 'dark-mode-toggle') {
      iconUrl = new URL('../assets/images/moonicon.png', import.meta.url).href;
    } else if (className === 'music-toggle') {
      iconUrl = new URL('../assets/images/musicicon.png', import.meta.url).href;
    }
  } catch (e) {
    // Fallback paths
    if (className === 'dark-mode-toggle') {
      iconUrl = '/src/assets/images/moonicon.png';
    } else if (className === 'music-toggle') {
      iconUrl = '/src/assets/images/musicicon.png';
    }
  }
  
  const iconImg = document.createElement('img');
  iconImg.src = iconUrl;
  iconImg.alt = label;
  icon.appendChild(iconImg);
  
  track.appendChild(thumb);
  toggle.appendChild(track);
  toggle.appendChild(icon);
  
  toggle.addEventListener('click', () => {
    if (toggleWrapper.classList.contains('disabled')) return;
    
    const currentState = toggle.dataset.state === 'on';
    const newState = !currentState;
    
    toggle.dataset.state = newState ? 'on' : 'off';
    
    // Animate toggle
    const trackWidth = track.offsetWidth || 50;
    const thumbWidth = thumb.offsetWidth || 20;
    
    if (newState) {
      const targetLeft = trackWidth - thumbWidth - 4;
      gsap.to(thumb, { 
        left: targetLeft, 
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(track, { 
        backgroundColor: 'rgba(74, 158, 255, 0.6)', 
        duration: 0.3 
      });
    } else {
      gsap.to(thumb, { 
        left: 4, 
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(track, { 
        backgroundColor: 'rgba(221, 201, 201, 0.8)', 
        duration: 0.3 
      });
    }
    
    onChange(newState);
  });
  
  // Initialize state
  if (initialState) {
    setTimeout(() => {
      const trackWidth = track.offsetWidth || 50;
      const thumbWidth = thumb.offsetWidth || 20;
      thumb.style.left = `${trackWidth - thumbWidth - 4}px`;
      track.style.backgroundColor = 'rgba(74, 158, 255, 0.6)';
      toggle.dataset.state = 'on';
    }, 150);
  } else {
    thumb.style.left = '4px';
    track.style.backgroundColor = 'rgba(221, 201, 201, 0.8)';
    toggle.dataset.state = 'off';
  }
  
  toggleWrapper.appendChild(toggle);
  
  return toggleWrapper;
}

function triggerNavigationAction(type) {
  // Get portfolio data based on type
  const portfolioData = {
    poster: {
      title: "About Me",
      content: "Hi! I'm Jonathan Dionisio. I'm a passionate developer with expertise in web development, 3D graphics, and interactive experiences. Welcome to my digital portfolio!",
      icon: "💻"
    },
    monitors: {
      title: "Technical Skills",
      content: "• Bachelor's in Computer Science\n• Proficient in JavaScript, React, Three.js\n• Experienced with modern web technologies\n• Always learning and growing",
      icon: "📚"
    },
    books: {
      title: "Projects & Achievements",
      content: "• Built interactive 3D web experiences\n• Developed responsive web applications\n• Created portfolio websites\n• Open source contributor",
      icon: "🏆"
    }
  };
  
  const info = portfolioData[type];
  if (info) {
    // Dispatch custom event to trigger panel display
    const event = new CustomEvent('navButtonClick', { detail: { type, info } });
    window.dispatchEvent(event);
  }
}

function handleDarkModeToggle(isOn) {
  // Dark mode functionality - dispatch event to main.js
  const event = new CustomEvent('darkModeToggle', { detail: { isOn } });
  window.dispatchEvent(event);
  console.log('Dark mode:', isOn ? 'ON' : 'OFF');
}

function handleMusicToggle(isOn) {
  // Music toggle functionality
  if (!backgroundMusic) {
    console.warn('Background music not loaded');
    return;
  }
  
  if (isOn) {
    // Play music in loop
    backgroundMusic.play().catch(err => {
      console.warn('Could not play background music:', err);
    });
    console.log('Music: ON');
  } else {
    // Pause music
    backgroundMusic.pause();
    console.log('Music: OFF');
  }
}

export function setNavigationDisabled(isDisabled) {
  if (!navigationBar) return;
  
  // Disable navigation buttons but keep visible when panel is open
  navButtons.forEach(button => {
    if (isDisabled) {
      button.classList.add('disabled');
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.5';
      button.style.filter = 'blur(1px)';
    } else {
      button.classList.remove('disabled');
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
      button.style.filter = 'none';
    }
  });
  
  // Keep toggles visible but disabled
  if (darkModeToggle) {
    if (isDisabled) {
      darkModeToggle.classList.add('disabled');
      darkModeToggle.style.pointerEvents = 'none';
      darkModeToggle.style.opacity = '0.5';
      darkModeToggle.style.filter = 'blur(1px)';
    } else {
      darkModeToggle.classList.remove('disabled');
      darkModeToggle.style.pointerEvents = 'auto';
      darkModeToggle.style.opacity = '1';
      darkModeToggle.style.filter = 'none';
    }
  }
  
  if (musicToggle) {
    if (isDisabled) {
      musicToggle.classList.add('disabled');
      musicToggle.style.pointerEvents = 'none';
      musicToggle.style.opacity = '0.5';
      musicToggle.style.filter = 'blur(1px)';
    } else {
      musicToggle.classList.remove('disabled');
      musicToggle.style.pointerEvents = 'auto';
      musicToggle.style.opacity = '1';
      musicToggle.style.filter = 'none';
    }
  }
}

export function getNavigationBar() {
  return navigationBar;
}

