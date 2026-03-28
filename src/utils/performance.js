// Измерение времени загрузки страницы
export const measurePageLoad = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
    
    // Отправка в аналитику (опционально)
    if (window.gtag) {
      window.gtag('event', 'performance', {
        page_load_time: pageLoadTime,
      });
    }
  }
};

// Измерение времени рендеринга компонента
export const measureRender = (componentName, startTime) => {
  const renderTime = performance.now() - startTime;
  if (renderTime > 100) {
    console.warn(`${componentName} rendered in ${renderTime}ms`);
  }
  return renderTime;
};

// Debounce для событий scroll/resize
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle для событий scroll
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};