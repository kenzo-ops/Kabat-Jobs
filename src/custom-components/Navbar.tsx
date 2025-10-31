import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkHover =
    "relative text-white rounded-lg p-2 lg:p-3 transition-all duration-300 hover:text-blue-100 focus-visible:outline-none shadow-none " +
    "after:content-[''] after:absolute after:left-2 after:right-2 lg:after:left-3 lg:after:right-3 after:bottom-2 after:h-[2px] " +
    "after:rounded-full after:bg-white/60 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <>
      <nav
        className={`
          fixed top-3 sm:top-5 left-1/2 -translate-x-1/2
          z-[9999]  
          flex justify-between items-center
          p-2
          rounded-full
          font-poppins
          bg-gradient-to-r from-custom-secondary to-custom-third
          shadow-lg backdrop-blur-md
          transition-all duration-300 ease-out
          ${isScrolled ? 'w-[70%]' : 'w-[80%] sm:w-[85%]'}
        `}
      >
        <h1 className="text-lg sm:text-xl md:text-2xl mx-3 sm:mx-5 md:mx-7 text-secondary font-semibold drop-shadow-md">
          Kabat Jobs
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 lg:gap-7 mx-3 sm:mx-5 md:mx-7">
          <Link to="/home" className={`${linkHover} text-sm lg:text-sm`}>
            Homes
          </Link>
          <a href="#jobs" className={`${linkHover} text-sm lg:text-sm`}>
            Jobs
          </a>
          <a href="#add-jobs" className={`${linkHover} text-sm lg:text-sm`}>
            Add Jobs
          </a>
          <a href="#FAQ" className={`${linkHover} text-sm lg:text-sm`}>
            FAQ
          </a>
        </div>

        {/* <div className="hidden z-50 md:flex items-stretch overflow-hidden mx-3 border-2 border-white sm:mx-5 md:mx-7 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent_60%)] border border-white/20 rounded-full">
          <a
            href="#signin"
            className="inline-flex items-center justify-center bg-blue-600 px-5 py-2 text-sm lg:text-base text-white transition-all rounded-full hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        
          >
            Sign In
          </a>
          <a
            href="#login"
            className="inline-flex items-center justify-center px-5 py-2 text-sm lg:text-base text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Log In
          </a>
        </div> */}

        {/* Tombol Sign In dan Log In */}
        <div className="hidden z-50 md:flex items-stretch overflow-hidden mx-3 border-2 border-white sm:mx-5 md:mx-7 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent_60%)] border border-white/20 rounded-full">
          <Link
            to="/signin"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-900 px-5 py-2 text-sm lg:text-base text-white transition-all rounded-full hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-5 py-2 text-sm lg:text-base text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Log In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden mx-3 p-2 text-white hover:text-blue-100 transition-colors focus-visible:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[9998] w-[90%] max-w-sm md:hidden">
          <div className="bg-gradient-to-r from-custom-secondary to-custom-third rounded-2xl shadow-lg backdrop-blur-md border border-white/10 p-6 space-y-4">
            <a
              href="#home"
              onClick={toggleMobileMenu}
              className={`block text-white rounded-lg p-3 text-center font-semibold ${linkHover}`}
            >
              Homes
            </a>
            <a
              href="#jobs"
              onClick={toggleMobileMenu}
              className={`block text-white rounded-lg p-3 text-center font-semibold ${linkHover}`}
            >
              Jobs
            </a>
            <a
              href="#add-jobs"
              onClick={toggleMobileMenu}
              className={`block text-white rounded-lg p-3 text-center font-semibold ${linkHover}`}
            >
              Add Jobs
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
