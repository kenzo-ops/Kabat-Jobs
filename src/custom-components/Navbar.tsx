import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Home, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import supabase from '@/supabase-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type UserProfile = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  custom_avatar_url?: string | null;
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Fetch user profile data
          const { data: profileData, error } = await supabase.rpc('get_user_profile', {
            user_id_param: authUser.id
          });

          if (!error && profileData && profileData.length > 0) {
            setUser({
              id: authUser.id,
              name: profileData[0].name,
              email: profileData[0].email,
              avatar_url: profileData[0].avatar_url,
              custom_avatar_url: profileData[0].custom_avatar_url,
            });
          } else {
            // Fallback to auth user data
            setUser({
              id: authUser.id,
              email: authUser.email,
              avatar_url: authUser.user_metadata?.avatar_url,
              custom_avatar_url: null,
              name: authUser.user_metadata?.name || authUser.user_metadata?.full_name,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getAvatarUrl = () => {
    if (user?.custom_avatar_url) return user.custom_avatar_url;
    if (user?.avatar_url?.includes('googleusercontent.com')) {
      return user.avatar_url.replace('s96-c', 's400-c');
    }
    return user?.avatar_url || null;
  };

  const getUserInitials = () => {
    const name = user?.name || user?.email || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDisplayName = () => {
    return user?.name || user?.email?.split('@')[0] || 'User';
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
          fixed top-0 md:top-5 left-1/2 -translate-x-1/2
          z-[9999]
          flex justify-between items-center
          px-4 sm:px-6 md:px-8
          py-3 md:py-2
          rounded-none md:rounded-full
          font-poppins
          bg-gradient-to-r from-custom-secondary to-custom-third
          shadow-lg backdrop-blur-md
          transition-all duration-300 ease-out
          w-full md:max-w-[calc(100vw-1rem)]
          ${isScrolled ? "md:w-[92%] lg:w-[88%] xl:w-[80%]" : "md:w-[95%] lg:w-[92%] xl:w-[85%]"}
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

        {/* DESKTOP AUTH BUTTONS / USER AVATAR */}
        {!loading && (
          <>
            {user ? (
              // User Avatar with Dropdown
              <div className="hidden md:flex items-center mx-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/30">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 overflow-hidden flex-shrink-0">
                        {getAvatarUrl() ? (
                          <img
                            src={getAvatarUrl()!}
                            alt={getDisplayName()}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                            {getUserInitials()}
                          </div>
                        )}
                      </div>
                      <span className="text-white text-sm font-medium max-w-[120px] truncate">
                        {getDisplayName()}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-black/90 backdrop-blur-xl border-white/10">
                    <DropdownMenuItem
                      onClick={() => navigate('/home')}
                      className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      <span>Feeds</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Auth Buttons
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
            )}
          </>
        )}

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
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
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

          {/* Auth Buttons / User Info */}
          {!loading && (
            <div className={`flex flex-col gap-3 mt-10 w-full max-w-xs transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: isMobileMenuOpen ? '500ms' : '0ms' }}
            >
              {user ? (
                <>
                  {/* User Info Card */}
                  <div className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 overflow-hidden flex-shrink-0">
                      {getAvatarUrl() ? (
                        <img
                          src={getAvatarUrl()!}
                          alt={getDisplayName()}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                          {getUserInitials()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-base truncate">{getDisplayName()}</p>
                      <p className="text-white/60 text-xs truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Feeds Button */}
                  <Link
                    to="/home"
                    onClick={toggleMobileMenu}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-center border border-blue-400/30 flex items-center justify-center gap-2"
                  >
                    <Home className="h-5 w-5" />
                    <span>Feeds</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full py-4 rounded-2xl bg-red-500/20 backdrop-blur-sm border-2 border-red-400/30 text-red-400 font-bold text-lg shadow-xl hover:bg-red-500/30 hover:scale-105 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

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