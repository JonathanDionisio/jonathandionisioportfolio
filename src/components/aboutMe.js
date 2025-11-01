// About Me Component
// This component creates and manages the About Me detail panel

import { gsap } from 'gsap';

// Store slideshow intervals for cleanup
let slideshowIntervals = [];

export function createAboutMePanel(panelContainer) {
  // Clear existing content and intervals
  panelContainer.innerHTML = '';
  slideshowIntervals.forEach(interval => clearInterval(interval));
  slideshowIntervals = [];
  
  // Create main wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'about-me-wrapper';
  
  // Header Section
  const header = document.createElement('div');
  header.className = 'about-header';
  header.innerHTML = `
    <h2 class="header-title">Jonathan L. Dionisio</h2>
  `;
  wrapper.appendChild(header);
  
  // Introduction Section
  const introSection = createSection('Introduction', 'intro-section');
  const introContent = document.createElement('p');
  introContent.className = 'intro-text';
  introContent.textContent = "Motivated IT student seeking an internship position as a developer specializing in game or mobile application development. Eager to apply and enhance my programming skills while learning from experienced professionals and contributing to real-world creative projects.";
  introSection.appendChild(introContent);
  wrapper.appendChild(introSection);
  
  // Contacts Section
  const contactsSection = createSection('Contacts', 'contacts-section');
  const contactsGrid = document.createElement('div');
  contactsGrid.className = 'contacts-grid';
  
  // Phone
  const phoneIconUrl = new URL('../assets/images/phoneicon.png', import.meta.url).href;
  const phoneItem = createContactItem(phoneIconUrl, 'Phone', '+63-969-565-6213', null);
  contactsGrid.appendChild(phoneItem);
  
  // Email
  const emailIconUrl = new URL('../assets/images/gmailicon.png', import.meta.url).href;
  const emailItem = createContactItem(emailIconUrl, 'Email', 'jonathandionisiooo@gmail.com', null);
  contactsGrid.appendChild(emailItem);
  
  // LinkedIn - clickable
  const linkedinIconUrl = new URL('../assets/images/linkedinicon.png', import.meta.url).href;
  const linkedinItem = createContactItem(linkedinIconUrl, 'LinkedIn', 'Jonathan-Dionisio', 'https://www.linkedin.com/in/jonathan-dionisio-0845392ab/', true);
  contactsGrid.appendChild(linkedinItem);
  
  // GitHub - clickable
  const githubIconUrl = new URL('../assets/images/githubicon.png', import.meta.url).href;
  const githubItem = createContactItem(githubIconUrl, 'GitHub', 'JonathanDionisio', 'https://github.com/JonathanDionisio', true);
  contactsGrid.appendChild(githubItem);
  
  contactsSection.appendChild(contactsGrid);
  wrapper.appendChild(contactsSection);
  
  // Education Section with Slideshow
  const educationSection = createSection('Education', 'education-section');
  
  // Create education slideshow
  const educationSlideshow = createEducationSlideshow();
  educationSection.appendChild(educationSlideshow);
  wrapper.appendChild(educationSection);
  
  // Objective Section
  const objectiveSection = createSection('Objective', 'objective-section');
  const objectiveText = document.createElement('p');
  objectiveText.className = 'objective-text';
  objectiveText.textContent = "To leverage my skills in software development and 3D graphics to create innovative digital experiences that make a positive impact. I aim to work with cutting-edge technologies and contribute to meaningful projects while continuously learning and growing professionally.";
  objectiveSection.appendChild(objectiveText);
  wrapper.appendChild(objectiveSection);
  

  
  // Interests Section
  const interestsSection = createSection('Interests', 'interests-section');
  const interestsGrid = document.createElement('div');
  interestsGrid.className = 'interests-grid';
  const interests = ['Web Development', '3D Graphics', 'Game Development', 'UI/UX Design', 'Music Production', 'Photography'];
  interests.forEach(interest => {
    const interestTag = document.createElement('div');
    interestTag.className = 'interest-tag';
    interestTag.textContent = interest;
    interestsGrid.appendChild(interestTag);
  });
  interestsSection.appendChild(interestsGrid);
  wrapper.appendChild(interestsSection);
  
  // Goals Section
  const goalsSection = createSection('Goals', 'goals-section');
  const goalsList = document.createElement('ul');
  goalsList.className = 'goals-list';
  const goals = [
    'Master advanced 3D graphics and WebGL technologies',
    'Contribute to open-source projects',
    'Build a successful career in frontend development',
    'Create innovative web applications',
    'Mentor other developers'
  ];
  goals.forEach(goal => {
    const goalItem = document.createElement('li');
    goalItem.className = 'goal-item';
    goalItem.innerHTML = `<span class="goal-icon">🎯</span> ${goal}`;
    goalsList.appendChild(goalItem);
  });
  goalsSection.appendChild(goalsList);
  wrapper.appendChild(goalsSection);
  
  // Append wrapper to panel
  panelContainer.appendChild(wrapper);
  
  // Animate sections on load
  animateSections(wrapper);
  
  return wrapper;
}

function createSection(title, className) {
  const section = document.createElement('div');
  section.className = `section ${className}`;
  const sectionTitle = document.createElement('h3');
  sectionTitle.className = 'section-title';
  sectionTitle.textContent = title;
  section.appendChild(sectionTitle);
  return section;
}

function createContactItem(iconPath, label, value, link, isClickable) {
  const item = document.createElement('div');
  item.className = 'contact-item';
  
  // Create icon image
  const iconImg = document.createElement('img');
  iconImg.src = iconPath;
  iconImg.alt = label;
  iconImg.className = 'contact-icon-img';
  iconImg.onerror = function() {
    // Fallback to emoji if image fails
    const emojiMap = {
      'phoneicon.png': '📞',
      'gmailicon.png': '📧',
      'linkedinicon.png': '💼',
      'githubicon.png': '🐙'
    };
    const filename = iconPath.split('/').pop();
    this.outerHTML = `<span class="contact-icon">${emojiMap[filename] || '📱'}</span>`;
  };
  
  if (isClickable && link) {
    item.classList.add('clickable');
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'contact-link';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'contact-icon';
    iconSpan.appendChild(iconImg);
    
    anchor.appendChild(iconSpan);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'contact-info';
    infoDiv.innerHTML = `
      <span class="contact-label">${label}</span>
      <span class="contact-value">${value}</span>
    `;
    anchor.appendChild(infoDiv);
    
    const linkIcon = document.createElement('span');
    linkIcon.className = 'external-link-icon';
    linkIcon.textContent = '🔗';
    anchor.appendChild(linkIcon);
    
    // Add hover animation
    anchor.addEventListener('mouseenter', () => {
      gsap.to(anchor, { scale: 1.05, duration: 0.2 });
    });
    anchor.addEventListener('mouseleave', () => {
      gsap.to(anchor, { scale: 1, duration: 0.2 });
    });
    
    item.appendChild(anchor);
  } else {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'contact-icon';
    iconSpan.appendChild(iconImg);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'contact-info';
    infoDiv.innerHTML = `
      <span class="contact-label">${label}</span>
      <span class="contact-value">${value}</span>
    `;
    
    item.appendChild(iconSpan);
    item.appendChild(infoDiv);
  }
  
  return item;
}

function createEducationSlideshow() {
  const slideshowContainer = document.createElement('div');
  slideshowContainer.className = 'education-slideshow-container';
  
  // Education data - generate image URLs
  const educationData = [
    {
      level: 'PHINMA-Saint Jude College Manila',
      program: 'Technical-Vocational-Livelihood Information and Communication Technology',
      period: '2020 - 2022',
      images: []
    },
    {
      level: 'National University Manila',
      program: 'Bachelor of Science in Information Technology (Mobile and Web Applications)',
      period: '2022 - Present',
      images: []
    }
  ];
  
  // Set image URLs for each education entry
  try {
    educationData[0].images = [
      new URL('../assets/images/sjgroup.jpg', import.meta.url).href,
      new URL('../assets/images/sjbuilding.PNG', import.meta.url).href
    ];
    educationData[1].images = [
      new URL('../assets/images/nugroup.jpg', import.meta.url).href,
      new URL('../assets/images/nubuilding.PNG', import.meta.url).href
    ];
  } catch (e) {
    // Fallback paths
    educationData[0].images = ['/src/assets/images/sjgroup.jpg', '/src/assets/images/sjbuilding.PNG'];
    educationData[1].images = ['/src/assets/images/nugroup.jpg', '/src/assets/images/nubuilding.PNG'];
  }
  
  // Create slideshow for each education entry
  educationData.forEach((edu, index) => {
    const eduItem = document.createElement('div');
    eduItem.className = 'education-item';
    
    // Image slideshow container
    const slideshow = document.createElement('div');
    slideshow.className = 'education-slideshow';
    
    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'education-image-container slideshow-container';
    
    let currentImageIndex = 0;
    const images = edu.images.map(imgPath => {
      const img = document.createElement('img');
      img.src = imgPath;
      img.alt = `${edu.level} - ${edu.institution}`;
      img.className = 'education-slideshow-image';
      img.style.display = 'none';
      img.onerror = function() {
        this.style.display = 'none';
      };
      return img;
    });
    
    if (images.length > 0) {
      images[0].style.display = 'block';
      images.forEach(img => imageContainer.appendChild(img));
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';
      placeholder.textContent = edu.level.charAt(0);
      imageContainer.appendChild(placeholder);
    }
    
    // Click to zoom handler
    imageContainer.style.cursor = 'pointer';
    imageContainer.addEventListener('click', () => {
      openImageZoom(images[currentImageIndex].src || images[currentImageIndex].getAttribute('src'));
    });
    
    // Auto-rotate images every 3 seconds
    if (images.length > 1) {
      const interval = setInterval(() => {
        images[currentImageIndex].style.display = 'none';
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].style.display = 'block';
        
        // Smooth fade transition
        gsap.fromTo(images[currentImageIndex], 
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );
      }, 3000);
      slideshowIntervals.push(interval);
    }
    
    slideshow.appendChild(imageContainer);
    
    // Content
    const content = document.createElement('div');
    content.className = 'education-content';
    content.innerHTML = `
      <h2 class="education-level">${edu.level}</h2>
      <p class="education-program">${edu.program}</p>
      <span class="education-period">${edu.period}</span>
    `;
    
    eduItem.appendChild(slideshow);
    eduItem.appendChild(content);
    
    // Animate on load
    gsap.set(eduItem, { opacity: 0, y: 20 });
    gsap.to(eduItem, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.2 });
    
    slideshowContainer.appendChild(eduItem);
  });
  
  return slideshowContainer;
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
  const sections = wrapper.querySelectorAll('.section');
  
  sections.forEach((section, index) => {
    gsap.set(section, { opacity: 0, y: 30 });
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });
}

export function hideAboutMePanel(panelContainer) {
  // Clear all slideshow intervals
  slideshowIntervals.forEach(interval => clearInterval(interval));
  slideshowIntervals = [];
  
  const wrapper = panelContainer.querySelector('.about-me-wrapper');
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
