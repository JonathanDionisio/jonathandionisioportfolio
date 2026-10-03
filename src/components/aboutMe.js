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
  introContent.textContent = "I am a BSIT-MWA graduate and a passionate game enthusiast with a strong interest in technology, software development, and interactive applications. I am seeking opportunities in software development, IT support, and the game industry, including roles in game development and game testing. I am eager to apply my technical knowledge, continue developing my skills, and gain hands-on experience while contributing to real-world projects. I am open to both full-time and internship opportunities and am always willing to learn, adapt, and take on new challenges.";
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
  
  // Experience Section with Slideshow
  const experienceSection = createSection('Experience', 'experience-section');
  
  // Create experience slideshow
  const experienceSlideshow = createExperienceSlideshow();
  experienceSection.appendChild(experienceSlideshow);
  wrapper.appendChild(experienceSection);
  
  // Objective Section
  const objectiveSection = createSection('Objective', 'objective-section');
  const objectiveText = document.createElement('p');
  objectiveText.className = 'objective-text';
  objectiveText.textContent = "To apply and further develop my technical skills through hands-on experience in a professional environment. As a BSIT-MWA graduate and game enthusiast, I aim to build a career in software development, IT support, or the game industry while continuously learning and adapting to new technologies. I seek opportunities where I can contribute to real-world projects, gain valuable industry experience, and grow both professionally and personally.";
  objectiveSection.appendChild(objectiveText);
  wrapper.appendChild(objectiveSection);
  

  
  // Interests Section
  const interestsSection = createSection('Interests', 'interests-section');
  const interestsGrid = document.createElement('div');
  interestsGrid.className = 'interests-grid';
  
  // Interests with descriptions
  const interests = [
    { name: 'Web Development', description: 'Creating interactive and responsive websites using modern frameworks and technologies.' },
    { name: 'Mobile Development', description: 'Building mobile applications for iOS and Android platforms using native and cross-platform tools.' },
    { name: 'Game Development', description: 'Building engaging games and interactive experiences with game engines and web technologies.' },
    { name: 'UI/UX Design', description: 'Designing intuitive user interfaces and seamless user experiences for web and mobile applications.' },
    { name: 'IT Support', description: 'Through my first internship, I gain hands on experience on a IT support environment, I was able to support agents and different employees with several technical issues.' }
  ];
  
  interests.forEach(interest => {
    const interestTag = document.createElement('div');
    interestTag.className = 'interest-tag';
    interestTag.textContent = interest.name;
    interestTag.dataset.description = interest.description;
    
    // Add hover functionality
    setupHoverTooltip(interestTag, interest.description);
    
    interestsGrid.appendChild(interestTag);
  });
  interestsSection.appendChild(interestsGrid);
  wrapper.appendChild(interestsSection);
  
  // Goals Section
  const goalsSection = createSection('Goals', 'goals-section');
  const goalsList = document.createElement('ul');
  goalsList.className = 'goals-list';
  
  // Goals with descriptions
  const goals = [
    { 
      text: ' Gain hands-on experience through real-world projects',
      description: 'Apply my technical knowledge in a professional environment while gaining practical experience and contributing to meaningful projects.'
    },
    { 
      text: 'Build a career in software, IT, and the game industry',
      description: 'Build a career in software, IT, and the game industryPursue opportunities in software development, IT support, game development, and game testing while developing the skills needed for a growing career in technology.'
    },
    { 
      text: ' Learn, adapt, and continuously improve my skills',
      description: 'Stay curious and adaptable by learning new technologies, taking on new challenges, and continuously improving my technical and professional skills.'
    }
  ];
  
  goals.forEach(goal => {
    const goalItem = document.createElement('li');
    goalItem.className = 'goal-item';
    goalItem.innerHTML = `<span class="goal-icon"></span> ${goal.text}`;
    goalItem.dataset.description = goal.description;
    
    // Add hover functionality
    setupHoverTooltip(goalItem, goal.description);
    
    goalsList.appendChild(goalItem);
  });
  goalsSection.appendChild(goalsList);
  wrapper.appendChild(goalsSection);
  
  // CV Download Button
  const cvDownloadContainer = document.createElement('div');
  cvDownloadContainer.className = 'cv-download-container';
  cvDownloadContainer.style.cssText = `
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0;
    padding: 0 20px;
  `;
  
  const downloadButton = document.createElement('button');
  downloadButton.className = 'cv-download-button';
  downloadButton.type = 'button';
  downloadButton.style.cssText = `
    background: linear-gradient(135deg, rgba(74, 158, 255, 0.2), rgba(100, 181, 246, 0.2));
    border: 2px solid rgba(74, 158, 255, 0.4);
    border-radius: 12px;
    padding: 15px 35px;
    color: rgba(255, 255, 255, 0.95);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(74, 158, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: inherit;
    outline: none;
  `;
  
  // Create button content with icon

  
  const buttonText = document.createElement('span');
  buttonText.textContent = 'Download Resume';
  
  
 
  downloadButton.appendChild(buttonText);

  
  // Get CV PDF URL - PDF is directly in assets folder
  let cvPdfUrl = '';
  try {
    cvPdfUrl = new URL('../assets/Jonathan_Dionisio_CV.pdf', import.meta.url).href;
  } catch (e) {
    // Fallback path
    cvPdfUrl = '/src/assets/Jonathan_Dionisio_CV.pdf';
  }
  
  // Handle download on click with proper file handling
  downloadButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
      // Fetch the file as a blob to ensure it's properly loaded
      const response = await fetch(cvPdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Jonathan_Dionisio_CV.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      // Button click animation
      gsap.to(downloadButton, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV. Please check if the file exists.');
    }
  });
  
  // Add hover effects
  downloadButton.addEventListener('mouseenter', () => {
    downloadButton.style.background = 'linear-gradient(135deg, rgba(74, 158, 255, 0.3), rgba(100, 181, 246, 0.3))';
    downloadButton.style.borderColor = 'rgba(74, 158, 255, 0.6)';
    downloadButton.style.boxShadow = '0 6px 20px rgba(74, 158, 255, 0.4)';
    downloadButton.style.transform = 'translateY(-3px)';
  });
  
  downloadButton.addEventListener('mouseleave', () => {
    downloadButton.style.background = 'linear-gradient(135deg, rgba(74, 158, 255, 0.2), rgba(100, 181, 246, 0.2))';
    downloadButton.style.borderColor = 'rgba(74, 158, 255, 0.4)';
    downloadButton.style.boxShadow = '0 4px 15px rgba(74, 158, 255, 0.2)';
    downloadButton.style.transform = 'translateY(0)';
  });
  
  // Add focus styles for accessibility
  downloadButton.addEventListener('focus', () => {
    downloadButton.style.outline = '2px solid rgba(74, 158, 255, 0.5)';
    downloadButton.style.outlineOffset = '2px';
  });
  
  downloadButton.addEventListener('blur', () => {
    downloadButton.style.outline = 'none';
  });
  
  cvDownloadContainer.appendChild(downloadButton);
  wrapper.appendChild(cvDownloadContainer);
  
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
      period: 'June 2020 - August 2022',
      images: [],
      achievements: ['High Honors 2022']
    },
    {
      level: 'National University Manila',
      program: 'Bachelor of Science in Information Technology (Mobile and Web Applications)',
      period: 'August 2022 - September 2026',
      images: [],
      achievements: [
        'Cum Laude 2026',
        'Dean\'s Lister 2022 - 2024'
      ]
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
      new URL('../assets/images/nubuilding.PNG', import.meta.url).href,
      new URL('../assets/images/nugradgroup.jpg', import.meta.url).href
    ];
  } catch (e) {
    // Fallback paths
    educationData[0].images = ['/src/assets/images/sjgroup.jpg', '/src/assets/images/sjbuilding.PNG'];
    educationData[1].images = ['/src/assets/images/nugroup.jpg', '/src/assets/images/nubuilding.PNG', '/src/assets/images/nugradgroup.jpg'];
    
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
    `;
    
    // Achievements scrolling ticker (below level and program, above period)
    if (edu.achievements && edu.achievements.length > 0) {
      const achievementsContainer = document.createElement('div');
      achievementsContainer.className = 'education-achievements-ticker';
      
      const achievementsTrack = document.createElement('div');
      achievementsTrack.className = 'achievements-track';
      
      // Create achievements with duplicates for seamless looping
      const achievementsBadges = edu.achievements.map(achievement => {
        const badge = document.createElement('span');
        badge.className = 'achievement-badge';
        badge.textContent = `🏆 ${achievement}`;
        return badge;
      });
      
      // Add original badges
      achievementsBadges.forEach(badge => {
        const clone = badge.cloneNode(true);
        achievementsTrack.appendChild(clone);
      });
      
      // Add duplicates for seamless loop
      achievementsBadges.forEach(badge => {
        const clone = badge.cloneNode(true);
        achievementsTrack.appendChild(clone);
      });
      
      achievementsContainer.appendChild(achievementsTrack);
      content.appendChild(achievementsContainer);
    }
    
    // Add period at the end
    const periodSpan = document.createElement('span');
    periodSpan.className = 'education-period';
    periodSpan.textContent = edu.period;
    content.appendChild(periodSpan);
    
    eduItem.appendChild(slideshow);
    eduItem.appendChild(content);
    
    // Animate on load
    gsap.set(eduItem, { opacity: 0, y: 20 });
    gsap.to(eduItem, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.2 });
    
    slideshowContainer.appendChild(eduItem);
  });
  
  return slideshowContainer;
}

function createExperienceSlideshow() {
  const slideshowContainer = document.createElement('div');
  slideshowContainer.className = 'experience-slideshow-container';
  
  // Experience data - generate image URLs
  const experienceData = [
    {
      company: 'Concentrix',
      position: 'IT Support Intern',
      period: 'November 2025 - January 2026',
      images: [
        new URL('../assets/images/concentrixbuilding.png', import.meta.url).href, 
        new URL('../assets/images/concentrixgroup.jpg', import.meta.url).href, 
        new URL('../assets/images/concentrixwork.jfif', import.meta.url).href
      ]
    }, 
    {
      company: 'Nexvision Innovations Inc.',
      position: 'Full Stack Mobile and Web Developer Intern / Project Lead Intern',
      period: 'January 2026 - May 2026',
      images: [
        new URL('../assets/images/nextitle.jfif', import.meta.url).href, 
        new URL('../assets/images/nexgroup.jpg', import.meta.url).href, 
        new URL('../assets/images/nexgroup2.jpg', import.meta.url).href
      ]
    }
  ];
  
  // Create slideshow for each experience entry
  experienceData.forEach((exp, index) => {
    const expItem = document.createElement('div');
    expItem.className = 'experience-item';
    
    // Image slideshow container
    const slideshow = document.createElement('div');
    slideshow.className = 'experience-slideshow';
    
    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'experience-image-container slideshow-container';
    
    let currentImageIndex = 0;
    const images = exp.images.map(imgPath => {
      const img = document.createElement('img');
      img.src = imgPath;
      img.alt = `${exp.company} - ${exp.position}`;
      img.className = 'experience-slideshow-image';
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
      placeholder.textContent = exp.company.charAt(0);
      imageContainer.appendChild(placeholder);
    }
    
    // Click to zoom handler
    imageContainer.style.cursor = 'pointer';
    imageContainer.addEventListener('click', () => {
      if (images.length > 0) {
        openImageZoom(images[currentImageIndex].src || images[currentImageIndex].getAttribute('src'));
      }
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
    content.className = 'experience-content';
    content.innerHTML = `
      <h2 class="experience-company">${exp.company}</h2>
      <p class="experience-position">${exp.position}</p>
      <span class="experience-period">${exp.period}</span>
    `;
    
    expItem.appendChild(slideshow);
    expItem.appendChild(content);
    
    // Animate on load
    gsap.set(expItem, { opacity: 0, y: 20 });
    gsap.to(expItem, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.2 });
    
    slideshowContainer.appendChild(expItem);
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

function setupHoverTooltip(element, description) {
  let tooltip = null;
  let tooltipTimeout = null;
  
  element.addEventListener('mouseenter', (e) => {
    // Clear any existing timeout
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
    
    // Remove existing tooltip if any
    const existingTooltip = document.querySelector('.hover-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }
    
    // Create tooltip after a short delay
    tooltipTimeout = setTimeout(() => {
      tooltip = document.createElement('div');
      tooltip.className = 'hover-tooltip';
      tooltip.textContent = description;
      document.body.appendChild(tooltip);
      
      // Position tooltip
      positionTooltip(tooltip, element);
      
      // Animate in
      gsap.fromTo(tooltip,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    }, 300); // Small delay before showing
  });
  
  element.addEventListener('mouseleave', () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
    
    if (tooltip) {
      gsap.to(tooltip, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        onComplete: () => {
          if (tooltip && tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
          }
          tooltip = null;
        }
      });
    }
  });
  
  // Update tooltip position on scroll or resize
  window.addEventListener('scroll', () => {
    if (tooltip && element.matches(':hover')) {
      positionTooltip(tooltip, element);
    }
  }, true);
  
  window.addEventListener('resize', () => {
    if (tooltip && element.matches(':hover')) {
      positionTooltip(tooltip, element);
    }
  });
}

function positionTooltip(tooltip, element) {
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;
  
  // Calculate position - prefer top, but use bottom if not enough space
  let top = rect.top + scrollY - tooltipRect.height - 10;
  let left = rect.left + scrollX + (rect.width / 2) - (tooltipRect.width / 2);
  
  // Check if tooltip would go off screen
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Horizontal positioning
  if (left < 10) {
    left = 10;
  } else if (left + tooltipRect.width > viewportWidth - 10) {
    left = viewportWidth - tooltipRect.width - 10;
  }
  
  // Vertical positioning - try top first
  if (top < scrollY + 10) {
    // Not enough space on top, put below
    top = rect.bottom + scrollY + 10;
  }
  
  // Ensure tooltip doesn't go below viewport
  if (top + tooltipRect.height > scrollY + viewportHeight - 10) {
    top = scrollY + viewportHeight - tooltipRect.height - 10;
  }
  
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
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
  
  // Remove any active tooltips
  const existingTooltips = document.querySelectorAll('.hover-tooltip');
  existingTooltips.forEach(tooltip => tooltip.remove());
  
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
