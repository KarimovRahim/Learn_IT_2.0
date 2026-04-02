import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);
  const [minSwipeDistance] = useState(50);

  // Определяем порядок страниц
  const pages = [
    { path: '/', name: 'home' },
    { path: '/courses', name: 'courses' },
    { path: '/services', name: 'services' },
    { path: '/news', name: 'news' },
  ];

  const currentIndex = pages.findIndex(page => page.path === location.pathname);
  
  const goToNext = () => {
    if (currentIndex < pages.length - 1) {
      navigate(pages[currentIndex + 1].path);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      navigate(pages[currentIndex - 1].path);
    }
  };

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      isSwiping.current = true;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping.current) return;
      touchEndX.current = e.touches[0].clientX;
      
      // Показываем визуальный индикатор свайпа
      const diff = touchEndX.current - touchStartX.current;
      if (Math.abs(diff) > 30) {
        document.body.style.cursor = diff > 0 ? 'w-resize' : 'e-resize';
      }
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping.current) return;
      
      const distance = touchEndX.current - touchStartX.current;
      const isLeftSwipe = distance < -minSwipeDistance;
      const isRightSwipe = distance > minSwipeDistance;
      
      // Сброс курсора
      document.body.style.cursor = '';
      
      if (isLeftSwipe) {
        goToNext();
      }
      
      if (isRightSwipe) {
        goToPrev();
      }
      
      touchStartX.current = 0;
      touchEndX.current = 0;
      isSwiping.current = false;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
    };
  }, [currentIndex, goToNext, goToPrev, minSwipeDistance]);

  return { goToNext, goToPrev, currentIndex, pages };
};

export default useSwipeNavigation;