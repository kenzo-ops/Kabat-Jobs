import React, { useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);

    // Lock scroll saat menu terbuka
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const linkHover =
    "relative text-white rounded-lg p-2 lg:p-3 transition-all duration-300 hover:text-blue-100 focus-visible:outline-none shadow-none " +
    "after:content-[''] after:absolute after:left-2 after:right-2 lg:after:left-3 lg:after:right-3 after:bottom-2 after:h-[2px] " +
    "after:rounded-full after:bg-white/60 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`
          fixed top-3 lg:top-5 left-1/2 -translate-x-1/2
          z-[9999]
          flex justify-between items-center
          px-4 sm:px-6 md:px-8
          py-2
          rounded-full
          font-poppins
          bg-gradient-to-r from-custom-secondary to-custom-third
          shadow-lg backdrop-blur-md
          transition-all duration-300 ease-out
          ${isScrolled ? "w-[92%] sm:w-[88%] md:w-[80%]" : "w-[95%] sm:w-[92%] md:w-[85%]"}
        `}
      >
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mx-2 text-secondary">
          Kabat Jobs
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-4 lg:gap-7 mx-3">
          <Link to="/home" className={`${linkHover} text-sm lg:text-base`}>
            Homes
          </Link>
          <a href="#jobs" className={`${linkHover} text-sm lg:text-base`}>
            Jobs
          </a>
          <a href="#add-jobs" className={`${linkHover} text-sm lg:text-base`}>
            Add Jobs
          </a>
          <a href="#FAQ" className={`${linkHover} text-sm lg:text-base`}>
            FAQ
          </a>
        </div>

        {/* DESKTOP AUTH BUTTONS */}
        <div className="hidden md:flex items-stretch overflow-hidden mx-3 border border-white/20 bg-white/10 backdrop-blur-xl rounded-full">
          <Link
            to="/signin"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-900 px-5 py-2 text-sm lg:text-base text-white rounded-full transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-5 py-2 text-sm lg:text-base text-white hover:bg-white/10 transition-all"
          >
            Log In
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white hover:text-blue-100 transition"
        >
          {isMobileMenuOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
        </button>
      </nav>

      {/* MOBILE MENU FULLSCREEN dengan animasi slide down dan blur background */}
      <div className={`
        fixed inset-0 z-[9998]
        md:hidden
        transition-all duration-500 ease-out
        ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        {/* Blur Background Layer - Transparent */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
        
        {/* Menu Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          {/* Logo/Title di atas */}
          <div className={`mb-12 transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}
            style={{ transitionDelay: isMobileMenuOpen ? '50ms' : '0ms' }}
          >
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Kabat Jobs
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
          </div>

          {/* Menu Items dengan card style */}
          <div className="space-y-3 w-full max-w-xs">
            <Link 
              className={`
                block w-full text-center text-white text-xl py-4 px-6 font-semibold rounded-2xl
                bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 hover:border-white/30 hover:scale-105
                transform transition-all duration-300 shadow-lg
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `} 
              style={{ transitionDelay: isMobileMenuOpen ? '100ms' : '0ms' }}
              onClick={toggleMobileMenu} 
              to="/home"
            >
              Homes
            </Link>
            <a 
              className={`
                block w-full text-center text-white text-xl py-4 px-6 font-semibold rounded-2xl
                bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 hover:border-white/30 hover:scale-105
                transform transition-all duration-300 shadow-lg
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              style={{ transitionDelay: isMobileMenuOpen ? '200ms' : '0ms' }}
              onClick={toggleMobileMenu} 
              href="#jobs"
            >
              Jobs
            </a>
            <a 
              className={`
                block w-full text-center text-white text-xl py-4 px-6 font-semibold rounded-2xl
                bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 hover:border-white/30 hover:scale-105
                transform transition-all duration-300 shadow-lg
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              style={{ transitionDelay: isMobileMenuOpen ? '300ms' : '0ms' }}
              onClick={toggleMobileMenu} 
              href="#add-jobs"
            >
              Add Jobs
            </a>
            <a 
              className={`
                block w-full text-center text-white text-xl py-4 px-6 font-semibold rounded-2xl
                bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 hover:border-white/30 hover:scale-105
                transform transition-all duration-300 shadow-lg
                ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              style={{ transitionDelay: isMobileMenuOpen ? '400ms' : '0ms' }}
              onClick={toggleMobileMenu} 
              href="#FAQ"
            >
              FAQ
            </a>
          </div>

          {/* Auth Buttons dengan style lebih menarik */}
          <div className={`flex flex-col gap-3 mt-10 w-full max-w-xs transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: isMobileMenuOpen ? '500ms' : '0ms' }}
          >
            <Link
              to="/signin"
              onClick={toggleMobileMenu}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-center border border-blue-400/30"
            >
              Sign In →
            </Link>
            <Link
              to="/login"
              onClick={toggleMobileMenu}
              className="w-full py-4 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg shadow-xl hover:bg-white/25 hover:scale-105 transition-all duration-300 text-center"
            >
              Log In
            </Link>
          </div>

          {/* Footer text */}
          <div className={`mt-8 text-white/60 text-sm transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: isMobileMenuOpen ? '600ms' : '0ms' }}
          >
            Find your dream job today
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;