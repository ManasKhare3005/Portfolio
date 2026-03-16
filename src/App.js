import { useState, useEffect } from 'react';
import { portfolioData } from './portfolio-content';
import './App.css';

function StarRating({ stars, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24"
          fill={i < stars ? 'var(--c-accent)' : 'none'}
          stroke="var(--c-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: i < stars ? 1 : 0.25 }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {                                                                                                                                   
        const link = document.querySelector("link[rel~='icon']") || document.createElement('link');                                                       
        link.rel = 'icon';                                                                                                                                
        link.href = darkMode ? '/web_logo_dark.jpg' : '/web_logo.jpg';                                                                                    
        document.head.appendChild(link);                                                                                                                  
      }, [darkMode]);

  const handleNavClick = () => setMobileMenuOpen(false);

  const navSections = ['home', 'about', 'experience', 'education', 'projects', 'skills', 'achievements', 'contact'];

  return (
    <div className="t-bg" data-theme={darkMode ? 'dark' : 'light'}>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 py-4 px-6 transition-all duration-300 ${
        scrollY > 50 ? 'nav-dark shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold gradient-text glow-text">
            Manas Khare
          </div>

          {/* Desktop nav */}
          <div className="space-x-8 hidden md:flex items-center">
            {navSections.map(section => (
              <a key={section} href={`#${section}`} className="nav-link text-sm tracking-wider uppercase capitalize">
                {section}
              </a>
            ))}
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-3">
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              className="flex flex-col gap-1.5 p-2 z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="block w-6 h-0.5 transition-all duration-300" style={{background: 'var(--c-ham)', transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : ''}}></span>
              <span className="block w-6 h-0.5 transition-all duration-300" style={{background: 'var(--c-ham)', opacity: mobileMenuOpen ? 0 : 1}}></span>
              <span className="block w-6 h-0.5 transition-all duration-300" style={{background: 'var(--c-ham)', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : ''}}></span>
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div className={`mobile-menu md:hidden ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="flex flex-col items-center gap-6 pt-20">
            {navSections.map(section => (
              <a key={section} href={`#${section}`} onClick={handleNavClick} className="mobile-nav-link text-lg tracking-wider uppercase capitalize">
                {section}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center hero-elegant relative overflow-hidden">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-7xl md:text-9xl font-bold gradient-text glow-text mb-6">
            Manas Khare
          </h1>
          <h2 className="text-3xl md:text-4xl t-accent mb-6 font-light">
            {portfolioData.hero.title}
          </h2>
          <p className="text-xl t-text-2 mb-8 max-w-3xl mx-auto leading-relaxed">
            {portfolioData.hero.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center t-text-3 mb-8">
            <span>📧 {portfolioData.hero.contact.email}</span>
            <span>📱 {portfolioData.hero.contact.phone}</span>
            <span>📍 {portfolioData.hero.contact.location}</span>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#projects" className="t-btn-primary">View My Work</a>
            <a href="#contact" className="t-btn-outline">Get In Touch</a>
            <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" className="t-btn-outline inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center py-20 px-6 section-dark">
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-12 gradient-text">About Me</h2>
          <div className="space-y-6 text-lg t-text-2 leading-relaxed">
            {portfolioData.about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 section-dark-alt">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 gradient-text">Experience</h2>
          <div className="space-y-8">
            {portfolioData.experience.map((job, index) => (
              <div key={index} className="dark-card p-8 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-bold t-heading mb-2">{job.title}</h3>
                    <h4 className="text-xl t-accent">{job.company} • {job.location}</h4>
                  </div>
                  <span className="t-accent mt-2 md:mt-0">{job.period}</span>
                </div>
                <p className="t-text-3 mb-4 italic">{job.description}</p>
                <ul className="space-y-2 mb-5">
                  {job.achievements.map((achievement, i) => (
                    <li key={i} className="t-text-2 flex items-start gap-3">
                      <span className="t-accent mt-1.5 flex-shrink-0">▹</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map(tech => (
                    <span key={tech} className="t-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-6 section-dark">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 gradient-text">Education</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {portfolioData.education.map((edu, index) => (
              <div key={index} className="dark-card p-8 rounded-2xl">
                <div className="text-5xl mb-4">{edu.icon}</div>
                <h3 className="text-2xl font-bold t-heading mb-2">{edu.degree}</h3>
                <h4 className="text-lg t-accent mb-1">{edu.school}</h4>
                <div className="flex flex-wrap gap-3 text-sm t-text-3 mb-3">
                  <span>📍 {edu.location}</span>
                  <span>📅 {edu.period}</span>
                  {edu.gpa && <span>📊 {edu.gpa}</span>}
                </div>
                <p className="t-text-2">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 section-dark-alt">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-4 gradient-text">Featured Projects</h2>
          <p className="text-center t-text-3 mb-16 text-lg">Building solutions that make a difference</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project) => (
              <div key={project.title} className="dark-card project-card rounded-2xl overflow-hidden">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{project.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold t-heading">{project.title}</h3>
                      <span className="text-sm t-accent">{project.category}</span>
                    </div>
                  </div>
                  <p className="t-text-3 mb-4 text-sm">{project.fullDescription}</p>
                  <div className="t-impact-box">
                    <p className="t-accent-d text-sm font-medium">⚡ {project.impact}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm t-text-3 uppercase tracking-wider mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {project.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="t-text-2 text-sm flex items-start gap-2">
                          <span className="t-accent mt-0.5">▹</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map(tech => (
                      <span key={tech} className="t-tag-sm">{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <div className="mt-auto pt-2">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="t-btn-primary inline-flex items-center gap-2 text-sm">
                      {project.link.includes('github.com') ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View on GitHub
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          View Live
                        </>
                      )}
                    </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 section-dark">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 gradient-text">Technical Skills</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {portfolioData.skills.categories.map((category) => (
              <div key={category.title} className="dark-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold t-heading mb-4 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.title}
                </h3>
                <div className="space-y-3">
                  {category.items.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between">
                      <span className="t-text-2 text-sm font-medium">{skill.name}</span>
                      <StarRating stars={skill.stars} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 px-6 section-dark-alt">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-4 gradient-text">Achievements</h2>
          <p className="text-center t-text-3 mb-16 text-lg">Recognition & Milestones</p>
          <div className="grid md:grid-cols-3 gap-8">
            {portfolioData.achievements.map((achievement, index) => (
              <div key={index} className="dark-card p-8 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-4">{achievement.icon}</div>
                <h3 className="text-2xl font-bold t-heading mb-3">{achievement.title}</h3>
                <p className="t-text-3 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {portfolioData.certifications.map((cert, index) => (
              <div key={index} className="dark-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h4 className="text-lg font-bold t-heading mb-2">{cert.name}</h4>
                <p className="t-text-3 text-sm">{cert.provider}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center py-20 px-6 section-dark relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-12 gradient-text glow-text">Let's Connect</h2>
          <p className="text-2xl t-text-2 mb-12">Ready to collaborate on something amazing?</p>
          <div className="space-y-6 mb-12">
            <a href={`mailto:${portfolioData.hero.contact.email}`}
              className="flex items-center justify-center gap-3 t-text-3 hover:t-accent transition-colors text-lg"
              style={{'--hover-color': 'var(--c-accent)'}}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--c-accent)'}
              onMouseLeave={e => e.currentTarget.style.color = ''}
            >
              <span className="text-3xl">📧</span>
              <span>{portfolioData.hero.contact.email}</span>
            </a>
            <div className="flex items-center justify-center gap-3 t-text-3 text-lg">
              <span className="text-3xl">📱</span>
              <span>{portfolioData.hero.contact.phone}</span>
            </div>
            <div className="flex items-center justify-center gap-3 t-text-3 text-lg">
              <span className="text-3xl">📍</span>
              <span>{portfolioData.hero.contact.location}</span>
            </div>
          </div>
          <div className="flex gap-6 justify-center">
            <a href={`https://www.linkedin.com/in/manas-khare-3b377818b`} target="_blank" rel="noopener noreferrer" className="t-social-btn" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://github.com/ManasKhare3005" target="_blank" rel="noopener noreferrer" className="t-social-btn" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" className="t-social-btn" aria-label="Resume">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="t-footer py-8 px-6 text-center">
        <p className="text-sm">© 2025 Manas Khare. Built with React ✨</p>
      </footer>
    </div>
  );
}
