import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { 
  Menu, X, Phone, Home, BookOpen, Settings, 
  Newspaper, Info, Mail, ChevronRight, LogIn, Sun, Moon
} from 'lucide-react';
import log from '../assets/logotype.png';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  // Монтируем портал только на клиенте
  useEffect(() => {
    setMounted(true);
    
    // Проверяем тему при монтировании
    const checkTheme = () => {
      const isDarkTheme = document.documentElement.classList.contains('dark');
      setIsDark(isDarkTheme);
    };
    
    checkTheme();
    
    // Наблюдаем за изменениями темы
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      setMounted(false);
      observer.disconnect();
    };
  }, []);

  // Функция переключения темы
  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Управление рендерингом для анимации закрытия
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    if (isOpen) {
      closeMenu();
    }
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Главная', path: '/', icon: Home, description: 'Вернуться на главную' },
    { name: 'Курсы', path: '/courses', icon: BookOpen, description: 'Наши обучающие программы' },
    { name: 'Наши услуги', path: '/services', icon: Settings, description: 'Что мы предлагаем' },
    { name: 'Новости', path: '/news', icon: Newspaper, description: 'Последние события' },
  ];

  // Анимации для главного блока
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    },
    exit: { 
      scale: 0, 
      rotate: 180,
      transition: {
        duration: 0.3
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: {
        duration: 0.5,
        delay: 0.1
      }
    },
    exit: { 
      scaleX: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const gradientVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: isDark ? 0.5 : 0.3,
      transition: {
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Кнопка бургера с адаптацией под тему
  const burgerButton = (
    <button
      onClick={toggleMenu}
      className="md:hidden relative w-10 h-10 flex items-center justify-center text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-all duration-300 group z-50"
      aria-label="Меню"
      aria-expanded={isOpen}
    >
      <div className={`absolute inset-0 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-300 ${isOpen ? 'scale-110 opacity-100' : 'scale-0 opacity-0'}`} />
      
      {/* Анимированная иконка */}
      <div className="relative w-6 h-6">
        <X 
          size={24} 
          className={`absolute inset-0 transform transition-all duration-500 ${
            isOpen 
              ? 'rotate-0 opacity-100 scale-100' 
              : 'rotate-90 opacity-0 scale-50'
          }`} 
        />
        <Menu 
          size={24} 
          className={`absolute inset-0 transform transition-all duration-500 ${
            isOpen 
              ? '-rotate-90 opacity-0 scale-50' 
              : 'rotate-0 opacity-100 scale-100'
          }`} 
        />
      </div>
    </button>
  );

  // Меню и overlay с анимацией и поддержкой темы
  const menuContent = shouldRender && (
    <>
      {/* Overlay с анимацией появления/исчезновения */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-[999] md:hidden ${
          isDark 
            ? 'bg-black/60 backdrop-blur-md' 
            : 'bg-black/40 backdrop-blur-sm'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Меню с комплексной анимацией */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 200,
          duration: 0.5
        }}
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] z-[1000] md:hidden`}
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
      >
        {/* Контейнер меню с адаптивными цветами */}
        <div className={`relative h-full shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-zinc-900 to-zinc-950'
            : 'bg-gradient-to-b from-white to-gray-50'
        }`}>
          
          {/* Анимированная линия сверху */}
          <motion.div 
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 origin-left"
          />
          
          {/* Анимированный градиентный фон */}
          <motion.div 
            variants={gradientVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${
              isDark
                ? 'from-red-600/20 via-transparent to-transparent'
                : 'from-red-500/10 via-transparent to-transparent'
            }`}
          />
          
          {/* Главный контейнер с анимацией появления */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full flex flex-col"
          >
            {/* Шапка с логотипом */}
            <motion.div 
              variants={itemVariants}
              className={`relative bg-gradient-to-b p-6 pb-8 ${
                isDark
                  ? 'from-zinc-800/50 to-transparent'
                  : 'from-gray-100/50 to-transparent'
              }`}
            >
              <div className="flex flex-col items-start">
                <motion.div 
                  variants={logoVariants}
                  className="relative"
                >
                  <div className={`absolute inset-0 rounded-lg blur-sm opacity-50 animate-pulse`} />
                  <div className="">
                    <img 
                      src={log} 
                      alt="Learn IT Logo" 
                      className="w-[100px]"
                    />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  {/* <span className={`text-lg font-bold block ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Learn IT
                  </span> */}
                  <span className={`text-xs ${
                    isDark ? 'text-zinc-400' : 'text-gray-500'
                  }`}>
                    Академия программирования
                  </span>
                </motion.div>
              </div>
              
              {/* Декоративная линия */}
              <motion.div 
                variants={lineVariants}
                className="absolute bottom-4 left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent origin-left"
              />
            </motion.div>

            {/* Навигация */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <motion.ul 
                variants={containerVariants}
                className="space-y-1"
              >
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  
                  return (
                    <motion.li 
                      key={link.path}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ x: 5 }}
                      className="transform-gpu"
                    >
                      <Link
                        to={link.path}
                        onClick={closeMenu}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          active
                            ? isDark
                              ? 'bg-gradient-to-r from-red-600/20 to-red-600/5 text-red-500'
                              : 'bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-600'
                            : isDark
                              ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {/* Индикатор активного пункта */}
                        <AnimatePresence>
                          {active && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 32, opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute left-0 w-1 bg-gradient-to-b from-red-500 to-red-700 rounded-r-full"
                            />
                          )}
                        </AnimatePresence>
                        
                        {/* Иконка */}
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`relative p-2 rounded-lg transition-all duration-300 ${
                            active
                              ? isDark
                                ? 'bg-red-600/20 text-red-500'
                                : 'bg-red-500/10 text-red-600'
                              : isDark
                                ? 'bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-white'
                                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                          }`}
                        >
                          <Icon size={18} />
                        </motion.div>
                        
                        {/* Текст */}
                        <div className="flex-1">
                          <motion.span 
                            className={`text-sm font-medium block ${
                              active
                                ? isDark ? 'text-red-500' : 'text-red-600'
                                : isDark ? 'text-zinc-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'
                            }`}
                          >
                            {link.name}
                          </motion.span>
                          <motion.span 
                            className={`text-xs transition-colors ${
                              isDark 
                                ? 'text-zinc-500 group-hover:text-zinc-400' 
                                : 'text-gray-500 group-hover:text-gray-600'
                            }`}
                          >
                            {link.description}
                          </motion.span>
                        </div>
                        
                        {/* Анимированная стрелка */}
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight 
                            size={16} 
                            className={active 
                              ? isDark ? 'text-red-500' : 'text-red-600'
                              : isDark ? 'text-zinc-500' : 'text-gray-400'
                            } 
                          />
                        </motion.div>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            {/* Контакты и кнопка входа */}
            <motion.div 
              variants={itemVariants}
              className={`bg-gradient-to-t pt-8 pb-6 px-4 ${
                isDark
                  ? 'from-zinc-900 via-zinc-900 to-transparent'
                  : 'from-white via-white to-transparent border-t border-gray-200'
              }`}
            >
              <motion.div 
                variants={containerVariants}
                className="space-y-3"
              >
                {/* Телефон */}
                <motion.a
                  variants={itemVariants}
                  href="tel:+992920091313"
                  whileHover={{ x: 5 }}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                    isDark
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isDark
                        ? 'bg-zinc-800 group-hover:bg-red-600/10'
                        : 'bg-gray-100 group-hover:bg-red-500/10'
                    }`}
                  >
                    <Phone size={16} className="text-red-500" />
                  </motion.div>
                  <div className="relative">
                    <span className={`text-sm font-medium block ${
                      isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                      +992 (92) 009-13-13
                    </span>
                    <span className={`text-xs ${
                      isDark ? 'text-zinc-500' : 'text-gray-500'
                    }`}>
                      Есть вопросы? Звоните!
                    </span>
                  </div>
                </motion.a>

                {/* Индикатор темы с креативной анимацией текста - ВАРИАНТ 1: Печатная машинка */}
                {/* <motion.div 
                  variants={itemVariants}
                  onClick={handleThemeToggle}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer overflow-hidden flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 ${
                    isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
                  }`}
                >
                  // Анимированный фоновый градиент при переключении
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20"
                    initial={{ x: '-100%' }}
                    animate={{ 
                      x: isDark ? '-100%' : '100%',
                      transition: { duration: 0.5, ease: "easeInOut" }
                    }}
                  />
                  
                  // Эффект пульсации при переключении
                  <motion.div 
                    className="absolute inset-0 bg-red-500/10"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isDark ? 'dark' : 'light'}
                      initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                      animate={{ 
                        rotate: 0, 
                        scale: 1, 
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }
                      }}
                      exit={{ 
                        rotate: 180, 
                        scale: 0.5, 
                        opacity: 0,
                        transition: {
                          duration: 0.2
                        }
                      }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      // Контейнер для иконки с анимацией
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.2,
                          ease: "easeInOut"
                        }}
                      >
                        {isDark ? (
                          <Moon size={14} className="text-red-500" />
                        ) : (
                          <Sun size={14} className="text-red-500" />
                        )}
                      </motion.div>
                      
                      // ВАРИАНТ 1: Анимация "печатная машинка"
                      <div className="relative overflow-hidden">
                        // Основной текст (невидимый, для сохранения места)
                        <div className="opacity-0">
                          {isDark ? 'Тёмная тема' : 'Светлая тема'}
                        </div>
                        
                        // Анимированный текст с эффектом печатной машинки
                        <motion.div
                          className="absolute inset-0 flex items-center"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          exit={{ width: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            borderRight: '2px solid rgba(239, 68, 68, 0.5)'
                          }}
                        >
                          <span className={`text-xs ${
                            isDark ? 'text-zinc-400' : 'text-gray-600'
                          }`}>
                            {isDark ? 'Тёмная тема' : 'Светлая тема'}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  // </div> Эффект "волны" при клике
                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileTap={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
                      originX: 0.5,
                      originY: 0.5
                    }}
                  />
                </motion.div> */}

                {/* ВАРИАНТ 2: Анимация "распадающиеся буквы" - раскомментируйте для использования */}
                <motion.div 
                  variants={itemVariants}
                  onClick={handleThemeToggle}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer overflow-hidden flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 ${
                    isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
                  }`}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20"
                    initial={{ x: '-100%' }}
                    animate={{ 
                      x: isDark ? '-100%' : '100%',
                      transition: { duration: 0.5, ease: "easeInOut" }
                    }}
                  />
                  
                  <motion.div 
                    className="absolute inset-0 bg-red-500/10"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isDark ? 'dark' : 'light'}
                      initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                      animate={{ 
                        rotate: 0, 
                        scale: 1, 
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }
                      }}
                      exit={{ 
                        rotate: 180, 
                        scale: 0.5, 
                        opacity: 0,
                        transition: {
                          duration: 0.2
                        }
                      }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.2,
                          ease: "easeInOut"
                        }}
                      >
                        {isDark ? (
                          <Moon size={14} className="text-red-500" />
                        ) : (
                          <Sun size={14} className="text-red-500" />
                        )}
                      </motion.div>
                      
                      <div className="relative">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isDark ? 'dark-text' : 'light-text'}
                            className="flex"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={{
                              hidden: { opacity: 0 },
                              visible: {
                                opacity: 1,
                                transition: {
                                  staggerChildren: 0.03,
                                  delayChildren: 0.1
                                }
                              },
                              exit: {
                                opacity: 0,
                                transition: {
                                  staggerChildren: 0.02,
                                  staggerDirection: -1
                                }
                              }
                            }}
                          >
                            {(isDark ? 'Тёмная тема' : 'Светлая тема').split('').map((char, index) => (
                              <motion.span
                                key={index}
                                variants={{
                                  hidden: { 
                                    y: 20, 
                                    opacity: 0,
                                    rotate: 10 
                                  },
                                  visible: { 
                                    y: 0, 
                                    opacity: 1,
                                    rotate: 0,
                                    transition: {
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 15
                                    }
                                  },
                                  exit: { 
                                    y: -20, 
                                    opacity: 0,
                                    rotate: -10,
                                    transition: {
                                      duration: 0.2
                                    }
                                  }
                                }}
                                className={`inline-block text-xs ${
                                  isDark ? 'text-zinc-400' : 'text-gray-600'
                                }`}
                              >
                                {char === ' ' ? '\u00A0' : char}
                              </motion.span>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileTap={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
                      originX: 0.5,
                      originY: 0.5
                    }}
                  />
                </motion.div>

                {/* ВАРИАНТ 3: Анимация "скролл" - раскомментируйте для использования */}
                {/* <motion.div 
                  variants={itemVariants}
                  onClick={handleThemeToggle}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer overflow-hidden flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 ${
                    isDark ? 'bg-zinc-800/50' : 'bg-gray-100'
                  }`}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-700/20"
                    initial={{ x: '-100%' }}
                    animate={{ 
                      x: isDark ? '-100%' : '100%',
                      transition: { duration: 0.5, ease: "easeInOut" }
                    }}
                  />
                  
                  <motion.div 
                    className="absolute inset-0 bg-red-500/10"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isDark ? 'dark' : 'light'}
                      initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                      animate={{ 
                        rotate: 0, 
                        scale: 1, 
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }
                      }}
                      exit={{ 
                        rotate: 180, 
                        scale: 0.5, 
                        opacity: 0,
                        transition: {
                          duration: 0.2
                        }
                      }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.2,
                          ease: "easeInOut"
                        }}
                      >
                        {isDark ? (
                          <Moon size={14} className="text-red-500" />
                        ) : (
                          <Sun size={14} className="text-red-500" />
                        )}
                      </motion.div>
                      
                      <div className="relative h-5 overflow-hidden">
                        <motion.div
                          animate={{ 
                            y: isDark ? 0 : -20
                          }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col"
                        >
                          <span className={`text-xs h-5 flex items-center ${
                            isDark ? 'text-zinc-400' : 'text-gray-600'
                          }`}>
                            Тёмная тема
                          </span>
                          <span className={`text-xs h-5 flex items-center ${
                            isDark ? 'text-zinc-400' : 'text-gray-600'
                          }`}>
                            Светлая тема
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <motion.div 
                    className="absolute inset-0 pointer-events-none"
                    initial={{ scale: 0, opacity: 0.5 }}
                    whileTap={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
                      originX: 0.5,
                      originY: 0.5
                    }}
                  />
                </motion.div> */}
              </motion.div>

              {/* Нижний декоративный элемент */}
              <motion.div 
                variants={itemVariants}
                className="mt-4 text-center"
              >
                <span className={`text-[10px] ${
                  isDark ? 'text-zinc-600' : 'text-gray-400'
                }`}>
                  © 2026 Learn IT. Все права защищены
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      {burgerButton}
      {mounted && createPortal(
        <AnimatePresence mode="wait">
          {menuContent}
        </AnimatePresence>, 
        document.body
      )}
    </>
  );
};

export default BurgerMenu;