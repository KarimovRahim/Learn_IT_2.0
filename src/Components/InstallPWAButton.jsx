import React, { useState, useEffect } from 'react';
import { Share2, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWAButton = () => {
  const [showButton, setShowButton] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isAppInstalled);
    
    if (isAppInstalled) {
      setShowButton(false);
    }
  }, []);

  const handleClick = () => {
    setShowInstructions(true);
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  const hideButton = () => {
    setIsVisible(false);
  };

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
          onClick={handleClick}
          className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Share2 className="w-3.5 h-3.5" />
          </motion.div>
          <span className="hidden sm:inline">Установить</span>
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

      {/* iOS стиль модального окна */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm"
            onClick={closeInstructions}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[340px] sm:max-w-sm bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-2xl overflow-hidden shadow-xl mx-4 sm:mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* iOS стиль handle bar */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
              </div>

              {/* Иконка приложения */}
              <div className="flex justify-center pt-4 sm:pt-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex items-center justify-center">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Заголовок */}
              <div className="text-center px-5 pt-4 pb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Установить приложение
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Добавьте Learn IT на главный экран
                </p>
              </div>

              {/* Инструкция */}
              <div className="px-5 py-4 space-y-4">
                {/* Шаг 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Нажмите кнопку «Поделиться»
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                        <Share2 className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Поделиться</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Шаг 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Прокрутите вниз и нажмите
                    </p>
                    <div className="mt-2">
                      <div className="inline-block bg-gray-100 dark:bg-zinc-800 rounded-xl px-4 py-1.5">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          «На экран домой»
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Анимация скролла */}
                <div className="flex justify-center py-1">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center animate-bounce">
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">прокрутите вниз</span>
                  </div>
                </div>
              </div>

              {/* Кнопка действия */}
              <div className="px-5 pb-5 pt-2">
                <button
                  onClick={closeInstructions}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium text-base active:scale-95 transition-all duration-200 shadow-md"
                >
                  Понятно
                </button>
              </div>

              {/* Текст-примечание */}
              <div className="pb-5 text-center">
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  Приложение появится на рабочем столе
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Стили для анимации */}
      <style>{`
        @media (max-width: 640px) {
          .modal-enter {
            transform: translateY(100%);
          }
          .modal-enter-active {
            transform: translateY(0);
            transition: transform 300ms ease-out;
          }
          .modal-exit {
            transform: translateY(0);
          }
          .modal-exit-active {
            transform: translateY(100%);
            transition: transform 300ms ease-in;
          }
        }
      `}</style>
    </>
  );
};

export default InstallPWAButton;