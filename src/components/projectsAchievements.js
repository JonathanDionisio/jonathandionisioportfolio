// Projects and Achievements Component
// This component creates and manages the Projects & Achievements detail panel
// Features project cards that open carousels on click, plus an Achievements section

import { gsap } from 'gsap';

// Store carousel intervals for cleanup
let carouselIntervals = [];

// Load hover sound effect
let hoverSound = null;
try {
  const hoverSoundUrl = new URL('../assets/audio/cubehover.mp3', import.meta.url).href;
  hoverSound = new Audio(hoverSoundUrl);
  hoverSound.volume = 0.3;
  hoverSound.preload = 'auto';
} catch (e) {
  console.warn('Could not load cube hover sound:', e);
  try {
    hoverSound = new Audio('/src/assets/audio/cubehover.mp3');
    hoverSound.volume = 0.3;
    hoverSound.preload = 'auto';
  } catch (e2) {
    console.warn('Could not load cube hover sound from fallback path:', e2);
  }
}

// Function to play hover sound
function playHoverSound() {
  if (hoverSound) {
    try {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(err => {
        console.debug('Could not play hover sound:', err);
      });
    } catch (e) {
      console.debug('Error playing hover sound:', e);
    }
  }
}

export function createProjectsAchievementsPanel(panelContainer) {
  // Clear existing content and intervals
  panelContainer.innerHTML = '';
  carouselIntervals.forEach(interval => clearInterval(interval));
  carouselIntervals = [];
  
  // Create main wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'projects-achievements-wrapper';
  
  // Header Section
  const header = document.createElement('div');
  header.className = 'projects-header';
  header.innerHTML = `
    <h2 class="projects-title">Projects & Achievements</h2>
  `;
  wrapper.appendChild(header);
  
  // Mobile Projects Section - Show cards first
  const mobileProjectsSection = createProjectsSection(
    'Mobile Projects',
    'mobile-projects',
    getMobileProjectsData()
  );
  wrapper.appendChild(mobileProjectsSection);
  
  // Web Projects Section - Show cards first
  const webProjectsSection = createProjectsSection(
    'Web Projects',
    'web-projects',
    getWebProjectsData()
  );
  wrapper.appendChild(webProjectsSection);
  
  // Achievements Section (not carousel)
  const achievementsSection = createAchievementsSection();
  wrapper.appendChild(achievementsSection);
  
  // Append wrapper to panel
  panelContainer.appendChild(wrapper);
  
  // Animate sections on load
  animateSections(wrapper);
  
  return wrapper;
}

function getMobileProjectsData() {
  return [
    {
      name: 'Bloggy',
      description: 'A mobile blogging application with social features. School project integrated with MongoDB Atlas.',
      images: [
        'bloggy1.PNG',
        'bloggy2.PNG',
        'bloggy3.PNG',
        'bloggy4.PNG',
        'bloggy5.PNG',
        'bloggy6.PNG',
        'bloggy7.PNG',
        'bloggy8.PNG'
      ],
      technologies: ['Flutter', 'MongoDB', 'Dart'],
      website: null // Add your website URL here if available
    },
    {
      name: 'GreenConnect Mobile',
      description: 'Sustainable lifestyle mobile app for eco-conscious users. My capstone team and I developed this for our capstone. Mobile version of ConnecGreen system. It includes features such as user authentication, location-based services, real-time chat, e-commerce marketplace, and food waste location collection requests.',
      images: [
        'greenconnectmobile1.jpg',
        'greenconnectmobile2.jpg',
        'greenconnectmobile3.jpg',
        'greenconnectmobile4.jpg',
        'greenconnectmobile5.jpg',
        'greenconnectmobile6.jpg',
        'greenconnectmobile7.jpg',
        'greenconnectmobile8.jpg',
        'greenconnectmobile9.jpg',
        'greenconnectmobile10.jpg'
      ],
      technologies: ['Flutter', 'Dart', 'MongoDB', 'twilio API', 'Mapbox API', 'xendit API'],
      website: null // Add your website URL here if available
    }
  ];
}

function getWebProjectsData() {
  return [
    {
      name: 'ConnectGreen Web',
      description: 'Web platform for sustainable living and community connection. My capstone team and I developed this for our capstone. Web version of ConnecGreen system. It includes features such as user authentication, location-based services, real-time chat, and food waste location collection requests. Data management for client or admin users.',
      images: [
        'connectgreenimage1.PNG',
        'connectgreenimage2.PNG',
        'connectgreenimage3.PNG',
        'connectgreenimage4.PNG',
        'connectgreenimage5.PNG'
      ],
      technologies: ['React', 'Node.js', 'MongoDB'],
      website:  'https://connectgreenmrf.com/'
    },
    {
      name: 'GreenConnect Market',
      description: 'E-commerce platform for eco-friendly products. My capstone team and I developed this for our web e-commerce project. It features product listings, shopping cart functionality, user reviews, and secure checkout process.',
      images: [
        'greenconnectmarket1.png',
        'greenconnectmarket2.png',
        'greenconnectmarket3.png',
        'greenconnectmarket4.png',
        'greenconnectmarket5.png',
        'greenconnectmarket6.png',
        'greenconnectmarket7.png',
        'greenconnectmarket8.png'
      ],
      technologies: ['React', 'Node.js', 'MongoDB'],
      website: null // Add your website URL here if available
    },
     {
      name: 'Portfolio Website',
      description: 'My first portfolio website showcasing my projects and achievements. I was able to test my skills in web development and design by creating this portfolio site using React, Node.js, and Three.js for 3D graphics. The portfolio dont have much projects and achievements yet since I am still a student and just started my journey in web development. But I will update it regularly as I complete more projects and achieve more milestones in my career.',
      images: [
        'portfolio1.png',
        'portfolio2.png',
        'portfolio3.png',
        'portfolio4.png',
        'portfolio5.png',
    
      ],
      technologies: ['React', 'Node.js', 'Three.js'],
      website: null // Add your website URL here if available
    }
    
  ];
}

function createProjectsSection(title, className, projects) {
  const section = document.createElement('div');
  section.className = `projects-section ${className}-section`;
  
  // Section Title
  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'projects-section-title';
  sectionTitle.textContent = title;
  section.appendChild(sectionTitle);
  
  // Projects Grid (Cards View)
  const projectsGrid = document.createElement('div');
  projectsGrid.className = 'projects-grid';
  
  projects.forEach((project, projectIndex) => {
    const projectCard = createProjectSummaryCard(project, `${className}-${projectIndex}`, className);
    projectsGrid.appendChild(projectCard);
  });
  
  section.appendChild(projectsGrid);
  return section;
}

function createProjectSummaryCard(project, projectId, type) {
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'project-summary-card-wrapper';
  
  const card = document.createElement('div');
  card.className = 'project-summary-card';
  card.dataset.projectId = projectId;
  
  // Get first image for preview
  let previewImageUrl = '';
  try {
    const basePath = type === 'mobile-projects' 
      ? '../assets/images/mobileprojects/' 
      : '../assets/images/webprojects/';
    previewImageUrl = new URL(basePath + project.images[0], import.meta.url).href;
  } catch (e) {
    const fallbackPath = type === 'mobile-projects'
      ? `/src/assets/images/mobileprojects/${project.images[0]}`
      : `/src/assets/images/webprojects/${project.images[0]}`;
    previewImageUrl = fallbackPath;
  }
  
  // Card Image Preview
  const cardImage = document.createElement('div');
  cardImage.className = 'project-summary-image';
  
  const img = document.createElement('img');
  img.src = previewImageUrl;
  img.alt = `${project.name} - Preview`;
  img.onerror = function() {
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = project.name.charAt(0);
    cardImage.appendChild(placeholder);
  };
  
  cardImage.appendChild(img);
  
  // Card Info
  const cardInfo = document.createElement('div');
  cardInfo.className = 'project-summary-info';
  
  const projectName = document.createElement('h4');
  projectName.className = 'project-summary-name';
  projectName.textContent = project.name;
  
  const projectDesc = document.createElement('p');
  projectDesc.className = 'project-summary-description';
  projectDesc.textContent = project.description;
  
  const techTags = document.createElement('div');
  techTags.className = 'project-tech-tags';
  project.technologies.forEach(tech => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = tech;
    techTags.appendChild(tag);
  });
  
  cardInfo.appendChild(projectName);
  cardInfo.appendChild(projectDesc);
  cardInfo.appendChild(techTags);
  
  card.appendChild(cardImage);
  card.appendChild(cardInfo);
  
  // Click handler - Hide grid and show carousel
  card.addEventListener('click', () => {
    playHoverSound();
    showCarouselForProject(card.closest('.projects-section'), project, projectId, type);
  });
  
  cardWrapper.appendChild(card);
  return cardWrapper;
}

function showCarouselForProject(section, project, carouselId, type) {
  // Get the projects grid
  const projectsGrid = section.querySelector('.projects-grid');
  if (!projectsGrid) return;
  
  // Create carousel wrapper
  const carouselWrapper = createProjectCarousel(project, carouselId, type, () => {
    // Back callback - restore grid
    gsap.to(carouselWrapper, {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      onComplete: () => {
        carouselWrapper.remove();
        projectsGrid.style.display = 'grid';
        gsap.fromTo(projectsGrid,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    });
  });
  
  // Hide the grid
  gsap.to(projectsGrid, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      projectsGrid.style.display = 'none';
      // Insert carousel after section title
      const sectionTitle = section.querySelector('.projects-section-title');
      section.insertBefore(carouselWrapper, sectionTitle.nextSibling);
      
      // Animate carousel in
      gsap.fromTo(carouselWrapper,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  });
}

function createProjectCarousel(project, carouselId, type, onBackCallback) {
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'project-carousel-wrapper';
  
  // Button Container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'carousel-buttons-container';
  
  // Back Button
  const backButton = document.createElement('button');
  backButton.className = 'carousel-back-button';
  backButton.innerHTML = '← Back';
  backButton.addEventListener('click', () => {
    playHoverSound();
    if (onBackCallback) {
      onBackCallback();
    }
  });
  
  // View Button (only show if website is available)
  let viewButton = null;
  if (project.website) {
    viewButton = document.createElement('button');
    viewButton.className = 'carousel-view-button';
    viewButton.innerHTML = 'View Website →';
    viewButton.addEventListener('click', () => {
      playHoverSound();
      window.open(project.website, '_blank', 'noopener,noreferrer');
    });
  }
  
  buttonContainer.appendChild(backButton);
  if (viewButton) {
    buttonContainer.appendChild(viewButton);
  }
  
  // Carousel Header (Title and Pagination)
  const carouselHeader = document.createElement('div');
  carouselHeader.className = 'carousel-header';
  
  const carouselTitle = document.createElement('div');
  carouselTitle.className = 'carousel-title';
  carouselTitle.textContent = project.name;
  
  const pagination = document.createElement('div');
  pagination.className = 'carousel-pagination-top';
  pagination.textContent = '01/01'; // Will be updated dynamically
  
  carouselHeader.appendChild(carouselTitle);
  carouselHeader.appendChild(pagination);
  
  // Carousel Main Container
  const carousel = document.createElement('div');
  carousel.className = 'carousel';
  carousel.id = carouselId;
  
  // Left Arrow
  const leftArrow = document.createElement('button');
  leftArrow.className = 'carousel-arrow carousel-arrow-left';
  leftArrow.innerHTML = '‹';
  leftArrow.setAttribute('aria-label', 'Previous');
  
  // Cards Container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'carousel-cards';
  
  // Generate image URLs and create cards
  let currentIndex = 0;
  const imageUrls = project.images.map(imgName => {
    try {
      const basePath = type === 'mobile-projects' 
        ? '../assets/images/mobileprojects/' 
        : '../assets/images/webprojects/';
      return new URL(basePath + imgName, import.meta.url).href;
    } catch (e) {
      const fallbackPath = type === 'mobile-projects'
        ? `/src/assets/images/mobileprojects/${imgName}`
        : `/src/assets/images/webprojects/${imgName}`;
      return fallbackPath;
    }
  });
  
  imageUrls.forEach((imageUrl, index) => {
    const card = createCarouselCard(project, imageUrl, index);
    cardsContainer.appendChild(card);
  });
  
  // Update pagination
  pagination.textContent = `01/${String(imageUrls.length).padStart(2, '0')}`;
  
  // Right Arrow
  const rightArrow = document.createElement('button');
  rightArrow.className = 'carousel-arrow carousel-arrow-right';
  rightArrow.innerHTML = '›';
  rightArrow.setAttribute('aria-label', 'Next');
  
  // Navigation functions
  const updateCarousel = () => {
    const cards = cardsContainer.querySelectorAll('.carousel-image-card');
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('active');
        gsap.to(card, { opacity: 1, scale: 1, duration: 0.3 });
      } else {
        card.classList.remove('active');
        gsap.to(card, { opacity: 0.3, scale: 0.95, duration: 0.3 });
      }
    });
    
    // Update pagination
    pagination.textContent = `${String(currentIndex + 1).padStart(2, '0')}/${String(imageUrls.length).padStart(2, '0')}`;
    
    // Update pagination dots
    updatePaginationDots(dotsContainer, currentIndex, imageUrls.length);
  };
  
  const goToNext = () => {
    playHoverSound();
    currentIndex = (currentIndex + 1) % imageUrls.length;
    updateCarousel();
  };
  
  const goToPrev = () => {
    playHoverSound();
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    updateCarousel();
  };
  
  leftArrow.addEventListener('click', goToPrev);
  rightArrow.addEventListener('click', goToNext);
  
  // Add swipe support for mobile
  let startX = 0;
  let isDragging = false;
  
  cardsContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  
  cardsContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });
  
  cardsContainer.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    isDragging = false;
  });
  
  carousel.appendChild(leftArrow);
  carousel.appendChild(cardsContainer);
  carousel.appendChild(rightArrow);
  
  // Pagination Dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  imageUrls.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => {
      playHoverSound();
      currentIndex = index;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });
  
  carouselWrapper.appendChild(buttonContainer);
  carouselWrapper.appendChild(carouselHeader);
  carouselWrapper.appendChild(carousel);
  carouselWrapper.appendChild(dotsContainer);
  
  // Initialize first card
  updateCarousel();
  
  return carouselWrapper;
}

function createCarouselCard(project, imageUrl, index) {
  const card = document.createElement('div');
  card.className = 'carousel-image-card';
  if (index === 0) card.classList.add('active');
  
  // Card Image
  const cardImage = document.createElement('div');
  cardImage.className = 'carousel-image-container';
  
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = `${project.name} - Image ${index + 1}`;
  img.style.objectFit = 'contain';
  img.onerror = function() {
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.textContent = project.name.charAt(0);
    cardImage.appendChild(placeholder);
  };
  
  cardImage.appendChild(img);
  card.appendChild(cardImage);
  
  // Click to zoom
  card.addEventListener('click', () => {
    openImageZoom(imageUrl);
  });
  
  return card;
}

function updatePaginationDots(container, activeIndex, total) {
  const dots = container.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function createAchievementsSection() {
  const section = document.createElement('div');
  section.className = 'achievements-section';
  
  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'achievements-title';
  sectionTitle.textContent = 'Achievements';
  section.appendChild(sectionTitle);
  
  const achievementsGrid = document.createElement('div');
  achievementsGrid.className = 'achievements-grid';
  
  // Achievement data - you can customize this
  const achievements = [
    {
      title: 'Deans Lister',
      description: 'Maintained a GPA of 3.75 or higher for multiple semesters.',
      icon: '🎓',
      year: 'National University Manila | 2023-2024'
    },
  ];
  
  achievements.forEach((achievement, index) => {
    const achievementCard = document.createElement('div');
    achievementCard.className = 'achievement-card';
    
    const icon = document.createElement('div');
    icon.className = 'achievement-icon';
    icon.textContent = achievement.icon;
    
    const content = document.createElement('div');
    content.className = 'achievement-content';
    
    const title = document.createElement('h4');
    title.className = 'achievement-title';
    title.textContent = achievement.title;
    
    const description = document.createElement('p');
    description.className = 'achievement-description';
    description.textContent = achievement.description;
    
    const year = document.createElement('span');
    year.className = 'achievement-year';
    year.textContent = achievement.year;
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(year);
    
    achievementCard.appendChild(icon);
    achievementCard.appendChild(content);
    
    // Animate on load
    gsap.set(achievementCard, { opacity: 0, y: 20 });
    gsap.to(achievementCard, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out'
    });
    
    achievementsGrid.appendChild(achievementCard);
  });
  
  section.appendChild(achievementsGrid);
  return section;
}

function openImageZoom(imageSrc) {
  // Remove existing zoom overlay if any
  const existingOverlay = document.querySelector('.image-zoom-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create zoom overlay
  const overlay = document.createElement('div');
  overlay.className = 'image-zoom-overlay';
  
  const zoomedImage = document.createElement('img');
  zoomedImage.src = imageSrc;
  zoomedImage.className = 'zoomed-image';
  
  overlay.appendChild(zoomedImage);
  document.body.appendChild(overlay);
  
  // Animate in
  gsap.fromTo(overlay, 
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  );
  gsap.fromTo(zoomedImage,
    { scale: 0.8 },
    { scale: 1, duration: 0.3, ease: 'power2.out' }
  );
  
  // Close on click
  overlay.addEventListener('click', () => {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => overlay.remove()
    });
  });
  
  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          overlay.remove();
          document.removeEventListener('keydown', handleEscape);
        }
      });
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function animateSections(wrapper) {
  const sections = wrapper.querySelectorAll('.projects-section, .achievements-section');
  
  sections.forEach((section, index) => {
    gsap.set(section, { opacity: 0, y: 30 });
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.2,
      ease: 'power2.out'
    });
  });
}

export function hideProjectsAchievementsPanel(panelContainer) {
  // Clear all carousel intervals
  carouselIntervals.forEach(interval => clearInterval(interval));
  carouselIntervals = [];
  
  const wrapper = panelContainer.querySelector('.projects-achievements-wrapper');
  if (wrapper) {
    gsap.to(wrapper, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        wrapper.style.display = 'none';
      }
    });
  }
}