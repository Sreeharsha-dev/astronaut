import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const mySocials = [
    {
      href: "https://github.com/Sreeharsha-dev",
      icon: Github,
      name: "GitHub"
    },
    {
      href: "https://linkedin.com/in/sreeharsha-muttamatam",
      icon: Linkedin,
      name: "LinkedIn"
    },
    {
      href: "mailto:sreeharsha2427@gmail.com",
      icon: Mail,
      name: "Email"
    }
  ];

  return (
    <section className={`flex flex-wrap items-center justify-between gap-5 pb-3 text-sm text-neutral-400 px-6 py-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Animated Top Border */}
      <div className="mb-4 relative w-full h-[1px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 animate-pulse hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Terms & Privacy Links */}
      {/* <div className="flex gap-2 animate-fade-in">
        <p className="hover:text-purple-400 transition-colors duration-300 cursor-pointer relative group">
          Terms & Conditions
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
        </p>
        <p className="text-purple-400 animate-pulse">|</p>
        <p className="hover:text-purple-400 transition-colors duration-300 cursor-pointer relative group">
          Privacy Policy
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
        </p>
      </div> */}

      {/* Social Media Icons */}
      <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {mySocials.map((social, index) => {
          const IconComponent = social.icon;
          return (
            <a
              href={social.href}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full hover:bg-neutral-800/50 transition-all duration-300 hover:scale-110 hover:rotate-12"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <IconComponent className="w-5 h-5 text-neutral-400 group-hover:text-purple-400 transition-colors duration-300" />
              
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-purple-400/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
              
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {social.name}
              </div>
            </a>
          );
        })}
      </div>

      {/* Copyright */}
      <p className="animate-fade-in text-neutral-400 hover:text-purple-400 transition-colors duration-300" style={{ animationDelay: '0.4s' }}>
        © {new Date().getFullYear()} Sreeharsha Muttamatam. All rights reserved.
      </p>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          section {
            flex-direction: column;
            text-align: center;
            gap: 3;
          }
          
          .flex.gap-2, .flex.gap-3 {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Footer;