import React, { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import { Phone } from 'lucide-react'
import Button from '../Components/UI/Button.jsx'
import { motion } from 'framer-motion'
import Switch from '../Components/swintcher.jsx'
import Footer from '../Components/Footer/Footer.jsx'
import BurgerMenu from '../Components/BurgerMenu.jsx'
import InstallPWAButton from '../Components/InstallPWAButton.jsx'
import FloatingButtons from '../Components/FloatingButtons.jsx'
import SwipeIndicator from '../Components/SwipeIndicator.jsx'
import useSwipeNavigation from '../hooks/useSwipeNavigation.js'
import AOS from 'aos'
import 'aos/dist/aos.css'
import log from '../assets/logotype.png';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const location = useLocation()
  
  // Подключаем свайп навигацию
  const { goToNext, goToPrev, currentIndex, pages } = useSwipeNavigation();

  // Показываем подсказку о свайпах при первом посещении
  useEffect(() => {
    const hasSeenSwipeHint = localStorage.getItem('hasSeenSwipeHint');
    if (!hasSeenSwipeHint) {
      setShowSwipeHint(true);
      setTimeout(() => {
        setShowSwipeHint(false);
        localStorage.setItem('hasSeenSwipeHint', 'true');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
      offset: 100,
      delay: 100,
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const userTheme = localStorage.getItem('theme');
    const isDarkTheme = userTheme === 'dark';

    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsDark(isDarkTheme);
  }, []);

  const handleToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    setTimeout(() => AOS.refresh(), 100);
  };

  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Курсы', path: '/courses' },
    { name: 'Наши услуги', path: '/services' },
    { name: 'Новости', path: '/news' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection-red transition-colors duration-300">
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
            ? 'backdrop-blur-md border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/80 py-3'
            : 'bg-transparent py-5'
          }`}
        data-aos="fade-down"
        data-aos-duration="600"
        data-aos-easing="ease-out-quad"
        data-aos-offset="0"
        data-aos-once="true"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="200"
            data-aos-easing="ease-out-cubic"
          >
            <div className="">
              <img
                src={log}
                alt="Learn IT Logo"
                className="w-[100px]"
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group text-sm font-medium transition-colors"
                data-aos="fade-down"
                data-aos-duration="500"
                data-aos-delay={300 + index * 100}
                data-aos-easing="ease-out-back"
              >
                <span className={isActive(link.path)
                  ? 'text-red-600 dark:text-red-500'
                  : 'text-gray-600 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500'
                }>
                  {link.name}
                </span>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ${
                  isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4" data-aos="fade-left" data-aos-duration="700" data-aos-delay="600">
            <InstallPWAButton />
            <Switch darkChecked={isDark} darkOnchange={handleToggle} />
            <div className="hidden md:flex items-center gap-6">
              <a
                href="tel:+992920091313"
                className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-white transition-colors group"
                data-aos="fade-left"
                data-aos-duration="600"
                data-aos-delay="700"
                data-aos-easing="ease-out-quad"
              >
                <Phone className="w-4 h-4 text-red-500 group-hover:text-red-400" />
                <span className="text-sm font-medium">+992 (92) 009-13-13</span>
              </a>
            </div>
            <BurgerMenu />
          </div>
        </div>
      </header>

      <main className="-mt-2" data-aos="fade" data-aos-duration="1000" data-aos-delay="200">
        <Outlet />
      </main>

      {/* Подсказка о свайпах (только при первом посещении) */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
          >
            <span>👆</span>
            <span>Свайпните влево или вправо для навигации</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Индикаторы свайпа */}
      {currentIndex > 0 && (
        <SwipeIndicator direction="left" visible={true} />
      )}
      {currentIndex < pages.length - 1 && (
        <SwipeIndicator direction="right" visible={true} />
      )}

      <FloatingButtons />
      <Footer />
    </div>
  )
}

export default Layout