import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users, ThumbsUp, X, Award, ExternalLink, MessageSquare } from 'lucide-react';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const reviewsPerPage = 6;

  const reviewsApi = "https://ehjoi-manaviyat.pockethost.io/api/collections/learn_it_reviews/records";

  const getReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${reviewsApi}?sort=-created&perPage=100`);
      const data = await res.json();
      setReviews(data.items || []);
    } catch (error) {
      console.error("Ошибка при получении отзывов:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: document.getElementById('reviews-section').offsetTop - 100, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: document.getElementById('reviews-section').offsetTop - 100, behavior: 'smooth' });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderStarsLarge = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const getGradient = (name) => {
    const gradients = [
      'from-red-500 to-red-600',
      'from-orange-500 to-red-500',
      'from-red-600 to-orange-500',
      'from-rose-500 to-red-500',
    ];
    const index = name ? name.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  // Ссылка на Google Maps для отзывов (замените на вашу)
  const googleReviewsUrl = "https://www.google.com/maps/place/Learn+IT+Academy/@40.2738864,69.6379656,17z/data=!4m8!3m7!1s0x38b1b363df3d22ab:0xcf204e8dd836ec19!8m2!3d40.2738864!4d69.6379656!9m1!1b1!16s%2Fg%2F11shv1s6sf?entry=ttu";

  const fallbackReviews = Array(12).fill(null).map((_, i) => ({
    id: i,
    name: ["Алишер Рахимов", "Мадина Каримова", "Бехруз Назаров", "Зарина Азимова", "Рустам Каримов", "Гулнора Саидова"][i % 6],
    rating: [5, 5, 4, 5, 5, 4][i % 6],
    text: "Отличная академия! За 6 месяцев обучения с нуля освоил React и получил оффер в IT-компанию. Отдельное спасибо менторам за индивидуальный подход и помощь с трудоустройством. Рекомендую всем, кто хочет начать карьеру в IT! Преподаватели очень доступно объясняют сложные темы, всегда готовы помочь. Атмосфера на занятиях дружеская, много практических заданий. После окончания курса я сразу нашел работу своей мечты. Спасибо Learn IT Academy!"
  }));

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;
  const totalDisplayPages = Math.ceil(displayReviews.length / reviewsPerPage);
  const displayCurrentReviews = reviews.length > 0 ? currentReviews : fallbackReviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  const openModal = (review) => {
    setSelectedReview(review);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedReview(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedReview) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedReview]);

  const Modal = () => {
    if (!selectedReview) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70"
        onClick={closeModal}
      >
        <div 
          className="relative max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden animate-fadeInUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`h-1 bg-gradient-to-r ${getGradient(selectedReview.name)}`}></div>
          
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradient(selectedReview.name)} flex items-center justify-center text-white font-bold text-lg`}>
                {getInitial(selectedReview.name)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {selectedReview.name}
                </h3>
                <div className="mt-1">
                  {renderStarsLarge(selectedReview.rating || 5)}
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <Quote className="w-8 h-8 text-red-200 dark:text-red-800/30" />
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {selectedReview.text}
              </p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <section id="reviews-section" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Заголовок */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium mb-4 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
              <Star className="w-4 h-4 fill-red-500" />
              Отзывы студентов
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 dark:text-white">
              Что говорят наши{' '}
              <span className="text-red-600 dark:text-red-500">выпускники</span>
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {displayReviews.length}+ студентов уже изменили свою жизнь с помощью наших курсов
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Загрузка отзывов...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {displayCurrentReviews.map((review, index) => {
                  const gradient = getGradient(review.name);
                  const initial = getInitial(review.name);
                  
                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group cursor-pointer"
                      onClick={() => openModal(review)}
                    >
                      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                        
                        <div className={`h-1 rounded-t-xl bg-gradient-to-r ${gradient}`}></div>
                        
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-bold text-base`}>
                              {initial}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {review.name}
                              </h3>
                              <div className="mt-1">
                                {renderStars(review.rating || 5)}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm line-clamp-4">
                            {review.text}
                          </p>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Award className="w-3 h-3 text-red-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">Выпускник</span>
                              </div>
                              <div className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Читать →
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Пагинация */}
              {totalDisplayPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-10">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${
                      currentPage === 0
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed dark:border-zinc-800'
                        : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:bg-red-500/10'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalDisplayPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalDisplayPages <= 5) {
                        pageNum = i;
                      } else if (currentPage < 3) {
                        pageNum = i;
                      } else if (currentPage > totalDisplayPages - 3) {
                        pageNum = totalDisplayPages - 5 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      if (pageNum >= 0 && pageNum < totalDisplayPages) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: document.getElementById('reviews-section').offsetTop - 100, behavior: 'smooth' });
                            }}
                            className={`w-7 h-7 rounded text-xs font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalDisplayPages - 1}
                    className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${
                      currentPage === totalDisplayPages - 1
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed dark:border-zinc-800'
                        : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-gray-400 dark:hover:bg-red-500/10'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Статистика */}
              {displayReviews.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex flex-wrap justify-center gap-6 mb-8">
                    {[
                      {
                        value: (displayReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / displayReviews.length).toFixed(1),
                        label: "Средняя оценка",
                        icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      },
                      {
                        value: displayReviews.length,
                        label: "Довольных студентов",
                        icon: <Users className="w-4 h-4 text-red-500" />
                      },
                      {
                        value: "100%",
                        label: "Рекомендуют",
                        icon: <ThumbsUp className="w-4 h-4 text-green-500" />
                      }
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="flex justify-center mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Кнопка для написания отзыва в Google */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center pt-4"
              >
                <a
                  href={googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 group"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Оставить отзыв в Google</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Ваше мнение поможет нам стать лучше ❤️
                </p>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <Modal />

      <style>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default ReviewsSection;