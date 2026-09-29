// Portfolio Content for Manas Khare — "Nocturne" edition
// Everything visible on the site lives here. Edit freely.

export const portfolioData = {
  hero: {
    name: "Manas Khare",
    title: "Full-Stack Engineer · ML / AI",
    tagline: "I build software the way I watch the night sky: patiently, curiously, one small light at a time.",
    description: "M.S. Computer Science at Arizona State University. I ship full-stack products and teach machines to see, listen and read.",
    contact: {
      email: "manaskhare63739@gmail.com",
      phone: "+1 (602) 743-5297",
      location: "Arizona, USA",
      linkedin: "https://www.linkedin.com/in/manas-khare-3b377818b/",
      github: "https://github.com/ManasKhare3005",
      resume: "/Resume.pdf"
    }
  },

  // About — written as a letter
  letter: {
    greeting: "Dear visitor,",
    paragraphs: [
      "Thank you for stopping by. I'm Manas, a software engineer pursuing my Master's in Computer Science at Arizona State University.",
      "Before graduate school I spent two years building real systems: order-management platforms at EQG Glassmach and microservice back-ends at Brillio, where API and architecture work made one application 30% faster. I love the whole stack, from a React component all the way down to the database index.",
      "Lately I've been living where software meets machine learning: vision transformers that learn to click through dashboards, speech models that listen to care calls, and language models that turn documents into maps of ideas.",
      "When I'm not building, I'm usually outside under a dark sky, lost in a soundtrack, or rewatching a story that makes me feel something. This site is a little of all three."
    ],
    signoff: "Yours, under the same sky,",
    signature: "Manas"
  },

  // Experience + education, oldest first. The moon waxes as the story goes on.
  journey: [
    {
      kind: "education",
      title: "B.Tech. Computer Science & Engineering",
      org: "SRM Institute of Science and Technology",
      location: "India",
      period: "Jun 2019 – Jun 2023",
      description: "Graduated with an 8.42 CGPA, focused on software development and machine learning.",
      points: [],
      technologies: []
    },
    {
      kind: "work",
      title: "Technical Content Writer",
      org: "Oyesters Training",
      location: "Remote",
      period: "Oct 2020 – Nov 2020",
      description: "Created technical documentation and educational content.",
      points: [
        "Authored technical articles covering software engineering best practices and emerging technologies",
        "Produced clear, well-researched content that improved team learning outcomes"
      ],
      technologies: ["Technical Writing", "Documentation"]
    },
    {
      kind: "work",
      title: "Software Developer Trainee",
      org: "EQG Glassmach",
      location: "Por, Gujarat, India",
      period: "Jun 2023 – Feb 2024",
      description: "Led client implementations and early system development.",
      points: [
        "Led on-site installations for critical projects, ensuring smooth deployment and user adoption",
        "Built order-management software from the ground up, improving operational efficiency"
      ],
      technologies: ["Java", "Web Development", "System Design"]
    },
    {
      kind: "work",
      title: "Associate Engineer",
      org: "Brillio",
      location: "Bengaluru, India",
      period: "Mar 2024 – Sep 2024",
      description: "Delivered client-focused software with an emphasis on performance and scale.",
      points: [
        "Boosted application efficiency by 30% through API optimization and a microservices architecture with Eureka service discovery",
        "Designed enterprise solutions with SpringBoot, React and MySQL aligned to client requirements"
      ],
      technologies: ["SpringBoot", "React", "MySQL", "Eureka", "Microservices"]
    },
    {
      kind: "work",
      title: "Software Developer",
      org: "EQG Glassmach",
      location: "Por, Gujarat, India",
      period: "Sep 2024 – Jul 2025",
      description: "Led development of enterprise solutions focused on scalability and performance.",
      points: [
        "Architected a comprehensive order-management system that reshaped internal workflows across teams",
        "Improved stability and responsiveness through rigorous testing, debugging and optimization"
      ],
      technologies: ["SpringBoot", "React", "MySQL", "Microservices"]
    },
    {
      kind: "education",
      title: "M.S. Computer Science",
      org: "Arizona State University",
      location: "Arizona, USA",
      period: "Aug 2025 – Present",
      description: "Graduate study in software engineering, distributed systems and artificial intelligence.",
      points: [],
      technologies: []
    },
    {
      kind: "work",
      title: "Software Development Intern",
      org: "Ramsey Products Corporation",
      location: "Remote",
      period: "Jun 2026 – Aug 2026 · Sep 2026 – Present",
      description: "Rebuilding a legacy engineering drive-selection tool as a modern web app, live in production. Still waxing.",
      points: [
        "Rebuilt a legacy ASP program as a React + Node/Express app on MySQL/MariaDB, migrating all customer records and historical calculations with zero data loss",
        "Reproduced the published horsepower rating tables, compressing ~231K values into 817 breakpoints (~99.6% smaller) with error under 10⁻⁶",
        "Built a sales dashboard with drill-downs and a scheduled email digest, secured with HMAC-signed role tokens, scrypt hashing and invite-based onboarding",
        "Fixed calculation defects the old system hid, backed by a 48-test regression suite against engineering reference data"
      ],
      technologies: ["React", "Vite", "Node.js", "Express", "MySQL / MariaDB"]
    }
  ],

  // Projects. group: "system" = full-stack planets, "nebula" = ML / AI stars.
  projects: [
    {
      id: "heymax",
      group: "nebula",
      title: "Hey Max",
      category: "Local AI · Voice Assistant",
      description: "A private voice assistant that lives entirely on your laptop: say \"Hey Max\" and it listens, thinks with a local LLM, runs tools and answers out loud. No cloud.",
      features: [
        "Open-vocabulary wake word (sherpa-onnx) with 4 staggered decoders and auto-gain for reliable detection",
        "On-device speech: faster-whisper to listen, Piper to speak",
        "Tool-calling agent on Ollama: qwen3:4b for most commands, escalating to qwen3:8b when it needs to think harder",
        "Safety gate: risky actions like closing apps or shutting down need a spoken yes"
      ],
      technologies: ["Python", "Ollama", "Qwen3", "faster-whisper", "sherpa-onnx", "Piper", "pytest"],
      impact: "Wake word, speech, reasoning and voice all run offline. Phase 1 of 6 is done",
      hue: 290,
      link: "https://github.com/ManasKhare3005/Hey-Max"
    },
    {
      id: "concierge",
      group: "nebula",
      title: "Concierge",
      category: "AI Companion · Lofty GlobeHack 2026",
      description: "A full-stack real-estate AI companion: agents get a live triage board, clients get a document portal that speaks plain English.",
      features: [
        "PDF extraction, categorization and plain-English summaries",
        "Question-aware document Q&A with sentiment-driven readiness triage",
        "Live agent dashboard over Server-Sent Events",
        "Simulated AI voice-bot follow-ups with ElevenLabs audio"
      ],
      technologies: ["TypeScript", "React", "Express", "Prisma", "SSE", "Groq", "ElevenLabs"],
      impact: "Takes a transaction from PDF upload to voice follow-up in one strict-TypeScript monorepo",
      hue: 265,
      link: "https://github.com/ManasKhare3005/Concierge"
    },
    {
      id: "carebridge",
      group: "nebula",
      title: "CareBridge",
      category: "Clinical AI · Speech + Triage",
      description: "Turns raw care-call transcripts into structured clinical and emotional risk signals, and routes each one to a clear next action.",
      features: [
        "faster-whisper speech service with a LoRA fine-tuning pipeline",
        "Transcript confidence scoring that flags uncertain sections",
        "Automated triage routing and callback scheduling",
        "Realtime warm-handoff chat over Socket.IO"
      ],
      technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "FastAPI", "faster-whisper", "LoRA"],
      impact: "One transcript in, one clear action out",
      hue: 175,
      link: "https://github.com/ManasKhare3005/CareBridge"
    },
    {
      id: "conceptweave",
      group: "nebula",
      title: "ConceptWeave",
      category: "LLM · Knowledge Graphs",
      description: "Upload a document and watch it become an interactive knowledge graph of concepts, clusters and the links between them.",
      features: [
        "LLM concept extraction from PDF, TXT and Markdown",
        "all-MiniLM-L6-v2 embeddings with K-Means clustering",
        "Semantic edges and natural-language graph queries",
        "Dockerized FastAPI + React stack with tests"
      ],
      technologies: ["Python", "FastAPI", "React", "PostgreSQL", "Groq", "Embeddings", "Docker"],
      impact: "Turns a wall of text into a map of ideas you can explore",
      hue: 205,
      link: "https://github.com/ManasKhare3005/Concept-Weave"
    },
    {
      id: "resumify",
      group: "nebula",
      title: "Resumify",
      category: "AI Product · Careers",
      description: "An AI resume builder that writes, tailors, scores and exports your resume in one place, so you don't bounce between five websites.",
      features: [
        "Import from PDF, GitHub or a portfolio site",
        "Job-description tailoring and ATS keyword scoring",
        "Cover letters and interview prep generated from your resume",
        "Export to PDF or Overleaf-ready LaTeX"
      ],
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "Firebase", "Groq · LLaMA 3.3", "Puppeteer"],
      impact: "Replaces a five-tool resume workflow with a single app",
      hue: 330,
      link: "https://resumify-hlur.onrender.com/"
    },
    {
      id: "coverageatlas",
      group: "nebula",
      title: "CoverageAtlas",
      category: "Policy Intelligence · RAG",
      description: "Makes payer policy documents searchable, comparable and explainable, with every coverage answer backed by a citation.",
      features: [
        "Policy ingestion from PDF and web with structured rule extraction",
        "Citation-first RAG over Postgres evidence and Qdrant vector search",
        "Plan comparison, policy timelines and version diffing",
        "LiveKit voice agent for real-time grounded coverage questions"
      ],
      technologies: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Qdrant", "Gemini", "LiveKit", "Docker"],
      impact: "Turns dense insurance coverage policies into source-backed answers",
      hue: 355,
      link: "https://coverageatlas.vercel.app/ask"
    },
    {
      id: "devassist",
      group: "nebula",
      title: "DevAssist",
      category: "Vision Agent · Automation",
      description: "A lightweight agent that learns from real dashboard interactions and deploys projects to Vercel on its own.",
      features: [
        "ViT-Tiny encoder for pixel-level UI understanding",
        "Playwright-driven Chromium automation",
        "Hybrid bootstrapping: recorded trajectories + automated learning",
        "Click heatmaps, action classification and text generation"
      ],
      technologies: ["Python", "Playwright", "Vision Transformer", "Chromium"],
      impact: "Fully automates a 5-step Vercel deployment with zero manual intervention",
      hue: 45,
      link: "https://github.com/ManasKhare3005/DevAssist"
    },
    {
      id: "greenify",
      group: "nebula",
      title: "Greenify",
      category: "Computer Vision · AgriTech",
      description: "Upload a photo of a plant and a trained model identifies disease early, with treatment suggestions.",
      features: [
        "Image-based disease detection with TensorFlow",
        "Disease information and treatment suggestions",
        "Firebase back end, responsive UI"
      ],
      technologies: ["Python", "TensorFlow", "JavaScript", "Firebase"],
      impact: "Identifies plant diseases early with 85%+ accuracy",
      hue: 120,
      link: "https://github.com/ManasKhare3005/Greenify"
    },
    {
      id: "clashcheck",
      group: "system",
      title: "ClashCheck",
      category: "1st Place · Design Experiences × Fulton Ambassadors Hackathon",
      description: "An assessment-collision radar: professors check a proposed exam date against their class's anonymous workload before announcing it.",
      features: [
        "Collision engine that surfaces the clearest nearby dates for an assessment",
        "Syllabus and Canvas calendar (.ics) extraction with the Claude API, with a regex fallback",
        "Chrome extension that shows students grade-weighted priority flashcards on Canvas",
        "Separate professor/TA and student dashboards"
      ],
      technologies: ["Node.js", "Express", "Claude API", "Chrome Extension", "pdf-parse", "node-ical"],
      impact: "Won 1st place out of ~30 teams at ASU's Ira A. Fulton Schools of Engineering hackathon",
      hue: 38,
      link: "https://github.com/Manavpatel06/ClashCheck"
    },
    {
      id: "crispr",
      group: "system",
      title: "CRISPR: Promise & Peril",
      category: "Data Visualization · ASU CSE 578",
      description: "A dual-narrative interactive visualization contrasting the promise and the ethical risks of CRISPR gene editing.",
      features: [
        "Two contrasting narratives: Promise vs Peril",
        "Interactive D3 visualizations of genetic-engineering concepts",
        "User-driven exploration of ethics, inequality and mutation risk"
      ],
      technologies: ["D3.js", "JavaScript", "HTML5", "CSS3", "Netlify"],
      impact: "Makes dense biotech research accessible and explorable",
      hue: 300,
      link: "https://crispr-promise-peril.netlify.app/"
    },
    {
      id: "fieldengineer",
      group: "system",
      title: "Field Engineer Task Manager",
      category: "Enterprise · Microservices",
      description: "Smart assignment, prioritization and tracking of field engineers based on service type, proximity and availability.",
      features: [
        "Multi-parameter intelligent task assignment",
        "Real-time scheduling and location-based optimization",
        "Automated priority management and reporting"
      ],
      technologies: ["React", "SpringBoot", "MySQL", "Microservices", "Eureka"],
      impact: "Cut manual task-allocation time by 60%",
      hue: 210
    },
    {
      id: "lookmyshow",
      group: "system",
      title: "Look My Show",
      category: "E-Commerce · Booking",
      description: "A movie-ticket booking platform with interactive seat maps and real-time availability.",
      features: [
        "Interactive seat selection with live availability",
        "Secure payment integration",
        "Booking confirmation and ticket generation"
      ],
      technologies: ["React", "JavaScript", "Firebase"],
      impact: "Seamless booking flow with 95% user satisfaction",
      hue: 0
    },
    {
      id: "railexpress",
      group: "system",
      title: "Rail Express Service",
      category: "Location-Based Services",
      description: "Connects railway passengers with catering, medical and porter services based on where they are.",
      features: [
        "Location-based service discovery",
        "Real-time availability and simple booking"
      ],
      technologies: ["JavaScript", "HTML5", "CSS3", "Firebase"],
      impact: "Simplified access to railway services for travelers",
      hue: 150,
      link: "https://github.com/ManasKhare3005/Rail-Express-Service"
    },
    {
      id: "cowin",
      group: "system",
      title: "coWin Slot Booking Bot",
      category: "Automation",
      description: "Watched vaccination slots during COVID-19 and booked automatically based on location, age and date.",
      features: [
        "Automated slot monitoring with user preferences",
        "Auto-booking the moment a slot opens"
      ],
      technologies: ["JavaScript", "Chrome DevTools"],
      impact: "Helped hundreds of people secure vaccination appointments",
      hue: 190
    }
  ],

  // Skills as constellations. Star shapes are real (normalized x/y, 0–1).
  // level 1–5 sets how bright the star shines.
  constellations: [
    {
      id: "orion",
      name: "ML & AI",
      real: "Orion · the Hunter",
      stars: [
        { name: "Python", level: 5, x: 0.24, y: 0.14 },
        { name: "LLM Apps", level: 4, x: 0.74, y: 0.2 },
        { name: "Embeddings & RAG", level: 3, x: 0.6, y: 0.5 },
        { name: "PyTorch / TensorFlow", level: 3, x: 0.5, y: 0.53 },
        { name: "Vision Transformers", level: 3, x: 0.4, y: 0.56 },
        { name: "Speech (Whisper)", level: 3, x: 0.3, y: 0.88 },
        { name: "Fine-tuning (LoRA)", level: 3, x: 0.78, y: 0.85 }
      ],
      lines: [[0, 1], [0, 4], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6]]
    },
    {
      id: "cassiopeia",
      name: "Frontend",
      real: "Cassiopeia · the Queen",
      stars: [
        { name: "React", level: 5, x: 0.06, y: 0.3 },
        { name: "TypeScript", level: 4, x: 0.3, y: 0.72 },
        { name: "HTML / CSS", level: 5, x: 0.5, y: 0.42 },
        { name: "Tailwind", level: 4, x: 0.7, y: 0.74 },
        { name: "Three.js / D3", level: 3, x: 0.94, y: 0.28 }
      ],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    {
      id: "ursa",
      name: "Backend & Data",
      real: "Ursa Major · the Great Bear",
      stars: [
        { name: "Node / Express", level: 4, x: 0.88, y: 0.26 },
        { name: "SpringBoot", level: 3, x: 0.86, y: 0.58 },
        { name: "PostgreSQL", level: 4, x: 0.62, y: 0.66 },
        { name: "MySQL", level: 4, x: 0.6, y: 0.36 },
        { name: "FastAPI", level: 3, x: 0.42, y: 0.3 },
        { name: "Socket.IO", level: 4, x: 0.24, y: 0.26 },
        { name: "Firebase", level: 4, x: 0.06, y: 0.42 }
      ],
      lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]]
    },
    {
      id: "cygnus",
      name: "Languages",
      real: "Cygnus · the Swan",
      stars: [
        { name: "Python", level: 4, x: 0.5, y: 0.06 },
        { name: "JavaScript", level: 4, x: 0.5, y: 0.4 },
        { name: "Java", level: 3, x: 0.84, y: 0.28 },
        { name: "C / C++", level: 4, x: 0.14, y: 0.56 },
        { name: "TypeScript", level: 4, x: 0.52, y: 0.94 }
      ],
      lines: [[0, 1], [1, 4], [2, 1], [1, 3]]
    },
    {
      id: "lyra",
      name: "Tools & Cloud",
      real: "Lyra · the Lyre",
      stars: [
        { name: "Git / GitHub", level: 5, x: 0.3, y: 0.1 },
        { name: "Docker", level: 3, x: 0.1, y: 0.28 },
        { name: "CI/CD (Actions)", level: 3, x: 0.46, y: 0.36 },
        { name: "Microservices", level: 3, x: 0.74, y: 0.42 },
        { name: "Redis", level: 3, x: 0.66, y: 0.88 },
        { name: "Oracle Cloud", level: 3, x: 0.38, y: 0.82 }
      ],
      lines: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 2]]
    }
  ],

  achievements: [
    { title: "1st Place, Design Experiences × Fulton Ambassadors Hackathon", description: "Won first of ~30 teams at ASU's Ira A. Fulton Schools of Engineering with ClashCheck (Sep 2026).", rank: 1 },
    { title: "1st Place, Hack-A-Code", description: "Won first place among 35 competing teams.", rank: 1 },
    { title: "Top 5, HackBMU 4.0", description: "Finished in the top 5 teams for problem-solving and innovation.", rank: 2 },
    { title: "Top 25, Zeta Hacks", description: "Selected in the top 25 of 200+ teams.", rank: 3 }
  ],

  certifications: [
    { name: "Machine Learning", provider: "Stanford University" },
    { name: "ML Foundations: A Case Study Approach", provider: "University of Washington" },
    { name: "Oracle Cloud Infrastructure Foundations", provider: "Oracle" }
  ],

  // Revealed after all seven lights are found
  secretLetter: [
    "You found all seven lights.",
    "Most people scroll past the small things. You didn't, and that's the kind of attention I try to bring to everything I build.",
    "In one of my favourite stories, little lights like these grant a wish. So go ahead and make one.",
    "And if your wish involves building something together, you know where to find me."
  ]
};
