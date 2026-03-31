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
    document.body.style.overflow = 'hidden';
  };

  const closeInstructions = () => {
    setShowInstructions(false);
    document.body.style.overflow = '';
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

      {/* Модальное окно */}
      {showInstructions && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={closeInstructions}
        >
          <div 
            className="relative w-full max-w-[340px] bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'modalFadeIn 0.3s ease-out'
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
            </div>

            {/* Иконка приложения */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex items-center justify-center">
                <Share2 className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Заголовок */}
            <div className="text-center px-5 pt-2 pb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Установить приложение
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Добавьте Learn IT на главный экран
              </p>
            </div>

            {/* Инструкция */}
            <div className="px-5 py-3 space-y-3">
              {/* Шаг 1 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
                    Нажмите кнопку «Поделиться»
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[11px] text-gray-600 dark:text-gray-300">Поделиться</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Шаг 2 */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
                    Прокрутите вниз и нажмите
                  </p>
                  <div className="mt-1.5">
                    <div className="inline-block bg-gray-100 dark:bg-zinc-800 rounded-lg px-3 py-1">
                      <span className="text-[12px] font-medium text-blue-600 dark:text-blue-400">
                        «На экран домой»
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Анимация скролла */}
              <div className="flex justify-center py-0.5">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center"
                  >
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </motion.div>
                  <span className="text-[9px] text-gray-400 mt-0.5">прокрутите вниз</span>
                </div>
              </div>
            </div>

            {/* Кнопка действия */}
            <div className="px-5 pb-4 pt-1">
              <button
                onClick={closeInstructions}
                className="w-full py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium text-sm active:scale-95 transition-all duration-200 shadow-md"
              >
                Понятно
              </button>
            </div>

            {/* Текст-примечание */}
            <div className="pb-4 text-center">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                Приложение появится на рабочем столе!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Добавляем анимацию через style */}
      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default InstallPWAButton;