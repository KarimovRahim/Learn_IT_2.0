import React, { useState, useEffect } from 'react';
import { Download, X, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [testMode, setTestMode] = useState(false); // Для тестирования на Android

  useEffect(() => {
    // Проверяем, iPhone ли это
    const isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsIOS(isIphone);

    // Проверяем, установлено ли уже приложение
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isAppInstalled);

    // Для тестирования на Android: можно включить режим iPhone
    // Раскомментируйте строку ниже, чтобы увидеть инструкцию на Android
    // setTestMode(true);

    if (!isIphone && !testMode) {
      // Для Android: слушаем событие beforeinstallprompt
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowButton(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      window.addEventListener('appinstalled', () => {
        setDeferredPrompt(null);
        setShowButton(false);
        setIsInstalled(true);
      });

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    } else {
      // Для iPhone или тестового режима: показываем кнопку с инструкцией
      if (!isAppInstalled) {
        setShowButton(true);
      }
    }
  }, [testMode]);

  const handleInstall = async () => {
    if (!isIOS && !testMode && deferredPrompt) {
      // Android: стандартная установка
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowButton(false);
      }
      setDeferredPrompt(null);
    } else {
      // iPhone или тестовый режим: показываем инструкцию
      setShowInstructions(true);
    }
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  const hideButton = () => {
    setIsVisible(false);
  };

  // Не показываем кнопку если приложение уже установлено или пользователь закрыл
  if (isInstalled || !showButton || !isVisible) return null;

  return (
    <>
      {/* Кнопка установки */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.3 }}
          onClick={handleInstall}
          className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {(isIOS || testMode) ? (
              <Share2 className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
          </motion.div>

          <span className="hidden sm:inline">
            {(isIOS || testMode) ? 'Установить' : 'Установить'}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              hideButton();
            }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-500 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <X className="w-2.5 h-2.5" />
          </button>

          <motion.div
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.button>
      </AnimatePresence>

      {/* Модальное окно с инструкцией для iPhone */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeInstructions}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 bg-gradient-to-r from-red-500 to-red-600" />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Установить приложение
                  </h3>
                  <button
                    onClick={closeInstructions}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Чтобы установить приложение на iPhone, выполните 2 простых шага:
                </p>
                
                <div className="space-y-6 mb-6">
                  {/* Шаг 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Нажмите кнопку «Поделиться»
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Поделиться</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">внизу экрана</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Шаг 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Прокрутите вниз и нажмите
                      </p>
                      <div className="inline-block bg-gray-100 dark:bg-zinc-800 rounded-xl px-5 py-2.5">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          «На экран домой»
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <span>↓</span>
                        <span>прокрутите вниз</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={closeInstructions}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                >
                  Понятно, установлю
                </button>
                
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                  Приложение появится на рабочем столе
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPWAButton;