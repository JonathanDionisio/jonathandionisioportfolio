// Technical Skills Component
// Clean stacked skill cubes with levitation animations, separated by category

import { gsap } from 'gsap';

// Store animation cleanup functions
let animationTimelines = [];
let hoverTooltips = new Map();

// Load hover sound effect
let hoverSound = null;
try {
  const hoverSoundUrl = new URL('../assets/audio/cubehover.mp3', import.meta.url).href;
  hoverSound = new Audio(hoverSoundUrl);
  hoverSound.volume = 0.3; // Set volume to 30% to avoid being too loud
  hoverSound.preload = 'auto';
} catch (e) {
  console.warn('Could not load cube hover sound:', e);
  // Try fallback path
  try {
    hoverSound = new Audio('/src/assets/audio/cubehover.mp3');
    hoverSound.volume = 0.3;
    hoverSound.preload = 'auto';
  } catch (e2) {
    console.warn('Could not load cube hover sound from fallback path:', e2);
  }
}

// Category labels mapping with descriptions
const categoryLabels = {
  languages: { 
    title: 'PROGRAMMING LANGUAGES',
    description: 'Core programming languages I use for developing applications and software solutions. I was more exposed to mobile and game development languages. Web development languages were not used as much but I have a basic understanding of them.'
  },
  database: { 
    title: 'DATABASE',
    description: 'Database management systems I work with for storing and managing application data. I was not so enthusiastic with SQL databases so I focused more on NoSQL databases that are more friendly to mobile and web applications.'
  },
  frameworks: { 
    title: 'FRAMEWORKS & TOOLS',
    description: 'Development frameworks, tools, and platforms that help me build and deploy applications efficiently. These frameworks and tools was mostly used on my projects and school activities. Some of them I learned on my own time to help me with development. Like Unity and Godot for game development.'
  },
  other: { 
    title: 'OTHER SKILLS',
    description: 'Additional skills and competencies that complement my technical expertise. I was not so enthusicastic on learning these skills but I understand the basics and their importance in the tech industry. I know little about cybersecurity as well.'
  }
};

export function createTechnicalSkillsPanel(panelContainer) {
  // Clear existing content
  panelContainer.innerHTML = '';
  cleanup();
  
  // Create main wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'technical-skills-wrapper';
  
  // Header
  const header = document.createElement('div');
  header.className = 'skills-header';
  header.innerHTML = '<h2 class="skills-title">Technical Skills</h2>';
  wrapper.appendChild(header);
  
  // Create container for all skill categories in a grid layout
  const categoriesGrid = document.createElement('div');
  categoriesGrid.className = 'categories-grid';
  
  // Define skill data organized by category - user specified grouping
  const skillsData = {
    languages: [
      { name: 'JavaScript', icon: 'jsicon.PNG', description: 'Dynamic programming language for web development. I was not able to learn enough anything logic related when it comes to web development but I was able to learn some basics on my own just like how I develop this portfolio' },
      { name: 'HTML5', icon: 'htmlicon.png', description: 'Markup language for structuring web content. I was able to learn HTML when I was in my SHS. I guess centering a div is still kinda complicated, jk. I also dont know why I put HTML in a programming language section mb for that' },
      { name: 'CSS3', icon: 'cssicon.jpg', description: 'Styling language for web development. I also was able to learn this when I was in my SHS, thats when I realized that designing is something I need to improve.' },
      { name: 'C#', icon: 'csharpicon.png', description: 'Microsoft\'s object-oriented programming language. I was able to learn this on my own by exploring to develop random systems then I got interested in game development.' },
      { name: 'C++', icon: 'cplusicon.PNG', description: 'High-performance programming language, I was able to use this when Im developing games in unity and godot.' },
      { name: 'Java', icon: 'javaicon.PNG', description: 'Object-oriented programming language, the first language that I was able to learn and also the language that allowed me to understand the fundamentals and basics when it comes programming, I was able to learn this when I was in SHS.' },
      { name: 'Python', icon: 'pythonicon.png', description: 'Versatile high-level programming language. I was not able to learn this in SHS but I learn a very little amount when I was in college. I was able to learn a little of this language when I was developing games in godot.' },
      { name: 'Dart', icon: 'darticon.png', description: 'Programming language optimized for UI development. I pretty familiar when using this language since this what I always used for developing mobile development.' }
    ],
    frameworks: [
      { name: 'Android Studio', icon: 'androidstudioicon.png', description: 'IDE for Android app development. First IDE I use for developing a mobile application and I also able to develop a game with it. It was easy to use, user friendly but I also think this IDE is very laggy but I would still use it for mobile development.' },
      { name: 'VS Code', icon: 'vscodeicon.png', description: 'Popular code editor by Microsoft. The first IDE was able to use was eclipse but I hated that IDE to my very bone that I didnt even mentioned it in my portfolio or resume. Thank god VScode exist. very familiar with it. Used it with different system developments.' },
      { name: 'Cisco', icon: 'ciscoicon.png', description: 'Networking and IT infrastructure solutions. I was only able to learn and use cisco in school, I was not able to learn this in my own or explore it on my own. I also dont think I have a cisco certification. I might try to get one soon.' },
      { name: 'Godot', icon: 'godoticon.png', description: 'Open-source game engine. Very good IDE for 2D game development, very user friendly and lightweight. Not so complicated to use and its very accessible. The language was also easy to learn, Im pretty familiar with it too.' },
      { name: 'Unity', icon: 'unityicon.png', description: 'Game engine for creating interactive 2D and 3D content. I was able to use this in school for school activities and school projects and I also used this for my hobby and developing random incomplete self game projects. Very versatile game IDE, I think its very good if you want to develop a 3D complex game and if you cant afford unreal engine or other softwares. But this IDE its pretty heavy too. Im pretty familiar with it just like godot. I would use this when I develop a 3D game.' },
      { name: 'Canva', icon: 'canvaicon.jpg', description: 'Graphic design platform. I was able to use this when I was SHS, my first every graphic design platform I was able to use, pretty familiar with it.' },
      { name: 'Figma', icon: 'figmaicon.jpg', description: 'Collaborative interface design tool. I discover this in college, I was able to utilize this in multiple school workloads. Im pretty familiar with it, I was able to use it to multple school activities, projects and self projects. I also able to use it for collaborations.' },
      { name: 'React', icon: 'reactjsicon.png', description: 'JavaScript library for building user interfaces. I was able to learn this late in my college, but Im pretty familiar with it, I was able to use it to development web apps for school activities and projects, I also this for this portfolio.' },
      { name: 'Git', icon: 'giticon.png', description: 'Distributed version control system. No one really taught me to use this properly but I was able to do some basics of it.' },
      { name: 'Vite', icon: 'viteicon.png', description: 'fast build tool and development server for frontend applications that can be used with many different frameworks like React. Its the one I used for developing this portfolio' },
      { name: 'firebase', icon: 'firebaseicon.png', description: 'Firebase is the first database tool that I was able to use and I used it on a personal programming practice, Im still kinda familiar to the setup but I have not use the other features of the firebase.' },
      { name: 'Flutter', icon: 'fluttericon.png', description: 'Google\'s UI toolkit for cross-platform apps. Flutter had to be best one to use when developing mobile applications since it has huge varities of features and flexible for different platforms. Im familiar with flutter, I was able to use it on multiple mobile development activites and I was able to use it on my vscode and currently using it in my android studio.' }
    ],
    database: [
      { name: 'Firebase', icon: 'firebaseicon.png', description: 'Google\'s platform for mobile and web application development. I was only able to use firebase server for a self project I was creating but I was not able to use the other tools and features that it provides. Im not very familiar with it, but I was able to use it sometimes in college.' },
      { name: 'MongoDB', icon: 'mongodbicon.png', description: 'NoSQL document database for modern applications. The best and easy to use database to use for not too complex systems. I was able to use this to some school activities and projects, I was also able to use this for my capstone. Im familiar with it.' }
    ],
    other: [
      { name: 'Basic Networking', description: 'Understanding network protocols and infrastructure, I was able to learn some basic networking in college but I was not to explore and expand my skills with it.', color: '#fcd34d' },
      { name: 'Troubleshooting', description: 'Diagnosing and resolving technical issues, Im capable of understanding a structure of a system or a structure a code and troubleshoot it, I was able to troubleshoot different problems in system development. I was also able to find and solve some problems without using any kind of AI. Im also able to troubleshoot hardware since I was able to explore and learn some hardware system with my personal computer at home, I was also able to troubleshoot different devices and yes I was able to find the problems and solve some of it without the help of AI.', color: '#f87171' },
      { name: 'UI/UX Design', description: 'Creating intuitive and visually appealing user interfaces. I was designing since I was in SHS and I was not that good at it, but in college I was able to try and improve my skills and creativity when designing. I was able to practice my designing UI and other things. Unfortunately, I do still think I should practice more if I compare my design with the designs I see in the community.', color: '#4ade80' }
    ]
  };
  
  // Create a separate column for each category
  Object.keys(skillsData).forEach((categoryName, categoryIndex) => {
    const categoryColumn = createCategoryColumn(categoryName, skillsData[categoryName], categoryIndex);
    categoriesGrid.appendChild(categoryColumn);
  });
  
  wrapper.appendChild(categoriesGrid);
  panelContainer.appendChild(wrapper);
  
  // Animate in
  gsap.fromTo(wrapper,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  );
  
  return wrapper;
}

function createCategoryColumn(categoryName, skills, categoryIndex) {
  // Create column container
  const column = document.createElement('div');
  column.className = 'category-column';
  column.dataset.category = categoryName;
  
  // Create category title with hover description
  const title = document.createElement('div');
  title.className = 'category-title';
  const categoryInfo = categoryLabels[categoryName] || { title: categoryName.toUpperCase(), description: '' };
  title.textContent = categoryInfo.title;
  title.dataset.description = categoryInfo.description || '';
  
  // Add hover functionality to title
  setupSkillHover(title, categoryInfo.description || categoryInfo.title);
  
  column.appendChild(title);
  
  // Create container for skill cubes
  const cubesContainer = document.createElement('div');
  cubesContainer.className = 'category-cubes-container';
  column.appendChild(cubesContainer);
  
  // Create skill cubes - stack them nicely without touching
  // Make "other skills" cubes larger for better text readability
  // Make "frameworks" cubes smaller to fit all
  const isOtherSkills = categoryName === 'other';
  const isFrameworks = categoryName === 'frameworks';
  const cubeSize = isOtherSkills ? 90 : (isFrameworks ? 56 : 60); // Smaller for frameworks, larger for other skills
  const padding = 20; // Padding from edges
  const spacingX = isOtherSkills ? 10 : (isFrameworks ? 10 : 15); // Adjust spacing
  const spacingY = isOtherSkills ? 10 : (isFrameworks ? 10 : 15); // Adjust spacing
  const cols = isOtherSkills ? 1 : 2; // Single column for other skills (larger cubes)
  
  // Use setTimeout to ensure container is rendered and we can get actual width
  setTimeout(() => {
    const containerRect = cubesContainer.getBoundingClientRect();
    const containerWidth = containerRect.width || 200; // Use actual rendered width
    const containerHeight = 450;
    
    skills.forEach((skill, skillIndex) => {
      // Calculate position in a clean grid - stack from bottom
      const col = skillIndex % cols;
      const row = Math.floor(skillIndex / cols);
      
      // Calculate position from bottom to top
      const totalRows = Math.ceil(skills.length / cols);
      const startY = containerHeight - padding - cubeSize; // Start from bottom
      
      // Center cubes horizontally - calculate total width needed and center it
      // Total width = sum of all cube widths + sum of all spacing between them
      const totalGridWidth = (cols * cubeSize) + ((cols - 1) * spacingX);
      const gridStartX = (containerWidth - totalGridWidth) / 2; // Center the grid
      
      // Calculate x position for this cube
      // Start from grid start + move by column index * (cube width + spacing) + half cube to center
      const x = gridStartX + (col * (cubeSize + spacingX)) + (cubeSize / 2);
      const y = startY - row * (cubeSize + spacingY);
      
      // Create skill cube element
      const skillElement = document.createElement('div');
      skillElement.className = 'skill-cube';
      if (isOtherSkills) {
        skillElement.classList.add('text-skill-cube'); // Add class for styling
      }
      skillElement.dataset.skillName = skill.name;
      skillElement.dataset.description = skill.description || '';
      
      // Position the cube
      skillElement.style.width = `${cubeSize}px`;
      skillElement.style.height = `${cubeSize}px`;
      skillElement.style.left = `${x - cubeSize / 2}px`;
      skillElement.style.top = `${y - cubeSize / 2}px`;
      
      // Create icon if available
      if (skill.icon) {
        const iconImg = document.createElement('img');
        try {
          iconImg.src = new URL(`../assets/images/${skill.icon}`, import.meta.url).href;
        } catch (e) {
          iconImg.src = `/src/assets/images/${skill.icon}`;
        }
        iconImg.alt = skill.name;
        iconImg.className = 'skill-icon';
        iconImg.onerror = function() {
          if (skill.emoji) {
            skillElement.innerHTML = `<span class="skill-emoji">${skill.emoji}</span>`;
          } else {
            skillElement.textContent = skill.name.substring(0, 3).toUpperCase();
          }
          skillElement.classList.add('text-fallback');
        };
        skillElement.appendChild(iconImg);
      } else if (skill.emoji) {
        skillElement.innerHTML = `<span class="skill-emoji">${skill.emoji}</span>`;
        skillElement.classList.add('emoji-skill');
      } else {
        skillElement.textContent = skill.name;
        skillElement.classList.add('text-skill');
        if (skill.color) {
          skillElement.style.backgroundColor = skill.color;
        }
      }
      
      // Add hover functionality
      setupSkillHover(skillElement, skill.description || skill.name);
      
      // Add levitation animation - similar to title float animation
      const animationDelay = skillIndex * 0.1; // Stagger animations
      const levitationTimeline = gsap.timeline({ repeat: -1, delay: animationDelay });
      levitationTimeline.to(skillElement, {
        y: '-=8',
        duration: 2 + Math.random() * 0.5,
        ease: 'power1.inOut'
      });
      levitationTimeline.to(skillElement, {
        y: '+=8',
        duration: 2 + Math.random() * 0.5,
        ease: 'power1.inOut'
      });
      
      animationTimelines.push(levitationTimeline);
      
      cubesContainer.appendChild(skillElement);
    });
  }, 50);
  
  return column;
}

function setupSkillHover(element, description) {
  let tooltip = null;
  let tooltipTimeout = null;
  const isTitle = element.classList.contains('category-title');
  
  element.addEventListener('mouseenter', () => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    
    const existingTooltip = document.querySelector('.skill-tooltip');
    if (existingTooltip) existingTooltip.remove();
    
    // Play hover sound (only for cubes, not titles)
    if (!isTitle && hoverSound) {
      try {
        // Reset audio to start and play
        hoverSound.currentTime = 0;
        hoverSound.play().catch(err => {
          // Ignore play errors (e.g., user hasn't interacted with page yet)
          console.debug('Could not play hover sound:', err);
        });
      } catch (e) {
        console.debug('Error playing hover sound:', e);
      }
    }
    
    tooltipTimeout = setTimeout(() => {
      tooltip = document.createElement('div');
      tooltip.className = 'skill-tooltip';
      tooltip.textContent = description;
      document.body.appendChild(tooltip);
      
      positionTooltip(tooltip, element);
      
      gsap.fromTo(tooltip,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
      
      // Scale up on hover (only for cubes, not titles)
      if (!isTitle) {
        gsap.to(element, { scale: 1.2, duration: 0.3, ease: 'power2.out' });
      }
    }, 300);
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
    
    // Scale back down (only for cubes, not titles)
    if (!isTitle) {
      gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
    }
  });
  
  // Update tooltip position on scroll/resize
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
  
  let top = rect.top + scrollY - tooltipRect.height - 10;
  let left = rect.left + scrollX + (rect.width / 2) - (tooltipRect.width / 2);
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (left < 10) left = 10;
  else if (left + tooltipRect.width > viewportWidth - 10) {
    left = viewportWidth - tooltipRect.width - 10;
  }
  
  if (top < scrollY + 10) {
    top = rect.bottom + scrollY + 10;
  }
  
  if (top + tooltipRect.height > scrollY + viewportHeight - 10) {
    top = scrollY + viewportHeight - tooltipRect.height - 10;
  }
  
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

function cleanup() {
  // Stop all animations
  animationTimelines.forEach(timeline => {
    if (timeline) {
      timeline.kill();
    }
  });
  
  animationTimelines = [];
  
  // Remove tooltips
  const tooltips = document.querySelectorAll('.skill-tooltip');
  tooltips.forEach(tooltip => tooltip.remove());
  hoverTooltips.clear();
}

export function hideTechnicalSkillsPanel(panelContainer) {
  cleanup();
  const wrapper = panelContainer.querySelector('.technical-skills-wrapper');
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
