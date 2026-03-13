// Portfolio Content for Manas Khare

export const portfolioData = {
  // Hero Section
  hero: {
    name: "Manas Khare",
    title: "Full Stack Developer & Software Engineer",
    tagline: "Crafting innovative solutions through code and creativity",
    description: "Master's student in Computer Science at Arizona State University, passionate about building scalable applications and solving complex problems with modern technologies.",
    contact: {
      email: "manaskhare63739@gmail.com",
      phone: "+1 (602) 743-5297",
      location: "Arizona, USA",
      linkedin: "www.linkedin.com/in/manas-khare-3b377818b/"
    }
  },

  // About Section
  about: {
    title: "About Me",
    paragraphs: [
      "I'm a passionate software engineer pursuing my Master's in Computer Science at Arizona State University, with a strong foundation in full-stack development and a proven track record of delivering impactful solutions.",
      "With professional experience spanning multiple roles at EQG Glassmach and Brillio, I specialize in building robust order management systems, optimizing APIs, and implementing microservices architecture. My approach combines clean code principles with user-centric design to create applications that truly make a difference.",
      "Beyond development, I'm deeply invested in emerging technologies, having earned certifications in Machine Learning from Stanford University and Oracle Cloud Infrastructure. I believe in continuous learning and bringing innovative solutions to real-world challenges."
    ],
    highlights: [
      "Top 25 in Zeta Hacks (200+ teams)",
      "1st Place in Hack-A-Code",
      "Top 5 in HackBMU 4.0",
      "Machine Learning Certified"
    ]
  },

  // Experience Section
  experience: [
    {
      title: "Software Developer",
      company: "EQG Glassmach",
      location: "Por, Gujarat, India",
      period: "Sep 2024 – July 2025",
      description: "Led development of enterprise solutions with focus on scalability and performance",
      achievements: [
        "Architected and developed a comprehensive order management system that revolutionized internal workflows, significantly improving processing efficiency and resource accessibility across teams",
        "Collaborated with cross-functional teams to gather requirements, implement clean code practices, and deliver robust features while maintaining high code quality",
        "Enhanced system stability and performance through rigorous testing, debugging, and optimization, resulting in measurable improvements in application responsiveness"
      ],
      technologies: ["SpringBoot", "React", "MySQL", "Microservices"]
    },
    {
      title: "Associate Engineer",
      company: "Brillio",
      location: "Bengaluru, Karnataka, India",
      period: "Mar 2024 – Sep 2024",
      description: "Delivered client-focused software solutions with emphasis on performance and scalability",
      achievements: [
        "Designed and implemented enterprise-grade software solutions perfectly aligned with client requirements, leveraging SpringBoot, React, and MySQL for optimal performance",
        "Boosted application efficiency by 30% through strategic API optimization and implementation of microservices architecture using Eureka service discovery",
        "Fostered seamless cross-team collaboration to ensure timely delivery of high-quality features and maintain project momentum"
      ],
      technologies: ["SpringBoot", "React", "MySQL", "Eureka", "Microservices"]
    },
    {
      title: "Software Developer Trainee",
      company: "EQG Glassmach",
      location: "Por, Gujarat, India",
      period: "June 2023 – Feb 2024",
      description: "Spearheaded client implementations and system development initiatives",
      achievements: [
        "Successfully led on-site installations for critical projects, ensuring flawless deployment and smooth user adoption at customer locations",
        "Developed innovative order management software from the ground up, dramatically improving operational efficiency and making resources more accessible to users",
        "Demonstrated strong problem-solving skills and adaptability while transitioning from academic learning to professional software development"
      ],
      technologies: ["Java", "Web Development", "System Design"]
    },
    {
      title: "Technical Content Writer",
      company: "Oyesters Training",
      location: "Remote",
      period: "Oct 2020 – Nov 2020",
      description: "Created technical documentation and educational content",
      achievements: [
        "Authored comprehensive technical articles covering software engineering best practices and emerging technologies",
        "Enhanced organizational knowledge sharing by producing clear, well-researched content that improved team learning outcomes"
      ],
      technologies: ["Technical Writing", "Documentation"]
    }
  ],

  // Projects Section
  projects: [
    {
      title: "CRISPR: Promise & Peril",
      category: "Data Visualization",
      description: "An interactive dual-narrative visualization platform exploring the promise and risks of CRISPR gene-editing technology",
      fullDescription: "Built as part of ASU's CSE 578 Data Visualization course, this platform presents two immersive, narrative-driven stories that contrast the optimistic potential and ethical dangers of CRISPR. Users explore topics like genetic disease treatment, agricultural engineering, personalized medicine, and the societal implications of genetic modification.",
      features: [
        "Dual-narrative structure — CRISPR: Promise vs CRISPR: Peril",
        "Interactive data visualizations illustrating genetic engineering concepts",
        "Immersive storytelling with user-driven exploration",
        "Covers ethics, inequality, and unintended mutation risks",
        "Deployed and publicly accessible via Netlify"
      ],
      technologies: ["D3.js", "JavaScript", "HTML5", "CSS3", "Netlify"],
      impact: "Transforms complex biotechnology research into an accessible, engaging interactive experience",
      icon: "🧬",
      link: "https://crispr-promise-peril.netlify.app/"
    },
    {
      title: "DevAssist — Vercel Deployment Agent",
      category: "AI Agent / Automation",
      description: "A lightweight AI agent that automates end-to-end Vercel project deployment using browser automation and a vision model",
      fullDescription: "Built an intelligent deployment agent that learns from real-world Vercel dashboard interactions. It trains a Vision Transformer (ViT-Tiny) on recorded trajectories and then autonomously drives a Chromium browser through the full deployment workflow — from project creation to GitHub import and live deployment.",
      features: [
        "Vision Transformer (ViT-Tiny) encoder for pixel-level UI understanding",
        "Playwright-driven headless Chromium browser automation",
        "Hybrid bootstrapping: manual trajectories + automated learning",
        "Click heatmaps, action classification, and text token generation",
        "Full pipeline from repo selection to live Vercel deployment"
      ],
      technologies: ["Python", "Playwright", "Vision Transformer", "Chromium", "ViT-Tiny"],
      impact: "Fully automates a 5-step Vercel deployment workflow with zero manual intervention",
      icon: "🤖",
      link: "https://github.com/ManasKhare3005/DevAssist"
    },
    {
      title: "Field Engineer Task Management System",
      category: "Enterprise Solution",
      description: "A comprehensive task management platform designed to optimize field operations and resource allocation",
      fullDescription: "Engineered an intelligent system that transforms how field engineers are assigned, prioritized, and tracked. The platform analyzes service types, location proximity, and resource availability to make smart task allocations, significantly reducing manual coordination effort.",
      features: [
        "Intelligent task assignment based on multiple parameters",
        "Real-time scheduling and resource allocation",
        "Location-based optimization",
        "Automated priority management",
        "Comprehensive tracking and reporting"
      ],
      technologies: ["React", "SpringBoot", "MySQL", "Microservices", "Eureka"],
      impact: "Reduced manual task allocation time by 60% and improved resource utilization",
      icon: "🔧"
    },
    {
      title: "Greenify - Plant Disease Detection",
      category: "Machine Learning",
      description: "An AI-powered web application that helps farmers and gardeners protect their plants",
      fullDescription: "Developed an intelligent plant disease detection system using machine learning algorithms. Users can simply upload a photo of their plant, and the ML model analyzes it to identify potential diseases, enabling early intervention and preventive care.",
      features: [
        "Real-time disease detection using ML",
        "User-friendly image upload interface",
        "Detailed disease information and treatment suggestions",
        "Firebase backend for seamless data management",
        "Responsive design for mobile and desktop"
      ],
      technologies: ["Python", "Machine Learning", "JavaScript", "Firebase", "TensorFlow"],
      impact: "Helps users identify plant diseases early with 85%+ accuracy",
      icon: "🌱"
    },
    {
      title: "Look My Show",
      category: "E-Commerce Platform",
      description: "A feature-rich movie ticket booking platform inspired by BookMyShow",
      fullDescription: "Built a complete ticket booking experience that replicates the functionality of major booking platforms. Users can browse movies, select their preferred seats with an interactive seating chart, and complete secure payments - all within a smooth, intuitive interface.",
      features: [
        "Dynamic movie browsing and filtering",
        "Interactive seat selection interface",
        "Secure payment integration",
        "Real-time seat availability updates",
        "Booking confirmation and ticket generation"
      ],
      technologies: ["React", "JavaScript", "HTML5", "CSS3", "Firebase"],
      impact: "Delivered seamless booking experience with 95% user satisfaction",
      icon: "🎬"
    },
    {
      title: "Rail Express Service",
      category: "Service Platform",
      description: "Location-based service platform inspired by Indian Railways",
      fullDescription: "Created a comprehensive web platform that connects railway passengers with essential services. The application provides easy access to catering, medical assistance, and porter services based on the user's location, making railway travel more convenient and comfortable.",
      features: [
        "Location-based service discovery",
        "Real-time service availability",
        "Simple booking interface",
        "Multiple service categories",
        "User-friendly design"
      ],
      technologies: ["JavaScript", "HTML5", "CSS3", "Firebase"],
      impact: "Simplified access to railway services for thousands of travelers",
      icon: "🚂"
    },
    {
      title: "coWin Vaccine Slot Booking Bot",
      category: "Automation Tool",
      description: "Automated vaccination slot booking system with smart preferences",
      fullDescription: "Developed an automation tool during the COVID-19 pandemic to help people secure vaccination slots. The bot monitors available slots based on user preferences like location, age group, and preferred dates, automatically booking when slots become available.",
      features: [
        "Automated slot monitoring",
        "Custom preference settings",
        "Real-time availability checking",
        "Automatic booking when slots open",
        "Multi-user support"
      ],
      technologies: ["JavaScript", "HTML5", "CSS3", "Chrome Dev Tools"],
      impact: "Helped hundreds of users secure vaccination appointments during critical times",
      icon: "💉"
    }
  ],

  // Skills Section
  skills: {
    categories: [
      {
        title: "Programming Languages",
        icon: "💻",
        items: [
          { name: "Python", stars: 4 },
          { name: "Java", stars: 3 },
          { name: "JavaScript", stars: 4 },
          { name: "C/C++", stars: 4 }
        ]
      },
      {
        title: "Frontend Development",
        icon: "🎨",
        items: [
          { name: "React", stars: 5 },
          { name: "HTML5/CSS3", stars: 5 },
          { name: "Tailwind", stars: 4 },
          { name: "Responsive Design", stars: 4 }
        ]
      },
      {
        title: "Backend & Database",
        icon: "⚙️",
        items: [
          { name: "SpringBoot", stars: 3 },
          { name: "Microservices", stars: 3 },
          { name: "MySQL", stars: 4 },
          { name: "Firebase", stars: 4 }
        ]
      },
      {
        title: "Tools & Technologies",
        icon: "🛠️",
        items: [
          { name: "Git/GitHub", stars: 5 },
          { name: "Machine Learning", stars: 3 },
          { name: "Oracle Cloud", stars: 3 },
          { name: "Eureka", stars: 3 }
        ]
      }
    ]
  },

  // Education Section
  education: [
    {
      degree: "Master of Science in Computer Science",
      school: "Arizona State University",
      location: "Arizona, USA",
      period: "Aug 2025 – Present",
      description: "Pursuing advanced studies in software engineering, distributed systems, and artificial intelligence",
      icon: "🎓"
    },
    {
      degree: "B.Tech. in Computer Science & Engineering",
      school: "SRM Institute of Science and Technology",
      location: "India",
      period: "June 2019 – June 2023",
      gpa: "8.42 CGPA",
      description: "Graduated with honors, specializing in software development and machine learning",
      icon: "🎓"
    }
  ],

  // Certifications
  certifications: [
    {
      name: "Machine Learning",
      provider: "Stanford University",
      icon: "🏆"
    },
    {
      name: "Machine Learning Foundations: A Case Study Approach",
      provider: "University of Washington",
      icon: "🏆"
    },
    {
      name: "Oracle Cloud Infrastructure Foundations",
      provider: "Oracle",
      icon: "🏆"
    }
  ],

  // Achievements
  achievements: [
    {
      title: "Top 25 - Zeta Hacks",
      description: "Selected among top 25 teams out of 200+ participating teams in this prestigious hackathon",
      icon: "🏅"
    },
    {
      title: "Top 5 - HackBMU 4.0",
      description: "Secured position in top 5 teams, demonstrating exceptional problem-solving and innovation",
      icon: "🏅"
    },
    {
      title: "1st Place - Hack-A-Code",
      description: "Won first position among 35 competing teams, showcasing superior coding skills and creativity",
      icon: "🥇"
    }
  ]
};
