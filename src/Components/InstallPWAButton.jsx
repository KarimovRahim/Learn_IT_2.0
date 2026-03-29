import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isAppInstalled);

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Слушаем успешную установку
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowButton(false);
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Пользователь установил приложение');
      setShowButton(false);
    } else {
      console.log('Пользователь отказался от установки');
    }
    
    setDeferredPrompt(null);
  };

  // Не показываем кнопку если:
  // - приложение уже установлено
  // - браузер не поддерживает PWA
  // - пользователь закрыл кнопку
  if (isInstalled || !showButton || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.3 }}
        onClick={handleInstall}
        className="relative group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        {/* Анимированная иконка скачивания */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Download className="w-3.5 h-3.5" />
        </motion.div>
        
        <span className="hidden sm:inline">Установить</span>
        
        
        {/* Пульсирующая точка для привлечения внимания */}
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.button>
        {/* Кнопка закрытия */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-500 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
        >
          <X className="w-2.5 h-2.5" />
        </button>
    </AnimatePresence>
  );
};

export default InstallPWAButton;