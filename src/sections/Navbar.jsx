import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function Navigation({ mobile = false, onLinkClick }) {
  const navItems = [
    { name: "Home", href: "#home", icon: "🏠" },
    { name: "About", href: "#about", icon: "👨‍💻" },
    { name: "Work", href: "#projects", icon: "💼" },
    { name: "Contact", href: "#contact", icon: "📧" },
  ];

  return (
    <ul className={`${mobile ? "flex flex-col space-y-4" : "flex space-x-8"}`}>
      {navItems.map((item, index) => (
        <motion.li
          key={item.name}
          initial={mobile ? { opacity: 0, y: -20 } : {}}
          animate={mobile ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <a
            className={`
              group relative flex items-center space-x-2 px-4 py-2 rounded-full 
              text-neutral-300 hover:text-white transition-all duration-300
              ${mobile ? "text-lg justify-center" : "text-sm"}
              hover:bg-white/10 backdrop-blur-sm
            `}
            href={item.href}
            onClick={onLinkClick}
          >
            <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.05 }}
            />
          </a>
        </motion.li>
      ))}
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Main Floating Navbar */}
      <motion.div
        className={`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
          transition-all duration-500 ease-in-out
          ${scrolled ? "w-auto" : "w-full max-w-6xl"}
        `}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className={`
            relative mx-4 rounded-2xl backdrop-blur-xl border border-white/10
            transition-all duration-500 ease-in-out
            ${
              scrolled
                ? "bg-black/40 shadow-2xl shadow-purple-500/10"
                : "bg-black/20 shadow-xl shadow-black/20"
            }
          `}
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.a
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                MSH
              </motion.a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex">
                <Navigation onLinkClick={handleLinkClick} />
              </nav>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <motion.span
                    className="w-5 h-0.5 bg-white mb-1 rounded-full"
                    animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-white mb-1 rounded-full"
                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-white rounded-full"
                    animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md"
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10 p-6">
                <nav>
                  <Navigation mobile={true} onLinkClick={handleLinkClick} />
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Navbar;