import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import parse from 'html-react-parser';
import { HashLink } from 'react-router-hash-link';
import { 
  ArrowLeft, Calendar, User, Clock, Tag, 
  Share2, Bookmark, Eye, MessageSquare, ChevronRight,
  AlertCircle, Star, Award, Users, BookOpen
} from 'lucide-react';
import Section from '../Components/UI/Section';
import Button from '../Components/UI/Button';
import Aurora from '../Components/Aurora';
import ReadMoreButton from '../Components/ReadMoreButton';

const DetailPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [relatedItems, setRelatedItems] = useState([]);

  const baseUrl = import.meta.env.VITE_POCKETBASE_URL || 'https://ehjoi-manaviyat.pockethost.io';

  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];

  useEffect(() => {
    fetchItem();
  }, [id, type]);

  const fetchItem = async () => {
    try {
      setIsLoading(true);
      const collection = type === 'news' ? 'learn_it_news' : 'learn_it_courses';
      const res = await fetch(`${baseUrl}/api/collections/${collection}/records/${id}`);
      const data = await res.json();
      setItem(data);
      
      // Загружаем похожие элементы
      if (type === 'news') {
        fetchRelatedNews(data.newsTopic);
      } else {
        fetchRelatedCourses(data.tags);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedNews = async (category) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/collections/learn_it_news/records?filter=(newsTopic='${category}')&perPage=3`
      );
      const data = await res.json();
      setRelatedItems(data.items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  };

  const fetchRelatedCourses = async (tags) => {
    try {
      const tag = tags?.split(',')[0];
      const res = await fetch(
        `${baseUrl}/api/collections/learn_it_courses/records?perPage=3`
      );
      const data = await res.json();
      setRelatedItems(data.items.filter(item => item.id !== id).slice(0, 3));
    } catch (error) {
      console.error('Error fetching related courses:', error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "некорректная дата";
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} в ${hours}:${minutes}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.nameCourse || item?.newsTopic,
        text: item?.description || item?.info,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center">
          <div className="relative">
            {/* Кастомный спиннер */}
            <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-zinc-400 text-lg">Загрузка...</p>
          <p className="text-gray-400 dark:text-zinc-600 text-sm mt-2">
            Получаем информацию о {type === 'news' ? 'новости' : 'курсе'}
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="relative mb-6">
            <AlertCircle className="w-24 h-24 text-red-500 mx-auto" />
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Страница не найдена
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-8">
            Запрашиваемая страница не существует или была удалена
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button onClick={() => navigate('/')}>
              На главную
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCourse = type === 'course';
  const title = isCourse ? item.nameCourse : item.newsTopic;
  const content = isCourse ? item.description : item.info;
  const image = item.image ? `${baseUrl}/api/files/${isCourse ? 'learn_it_courses' : 'learn_it_news'}/${item.id}/${item.image}` : null;
  const benefits = isCourse && item.tags ? item.tags.split(',') : [];

  return (
    <div className="pt-20 pb-16 bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900 min-h-screen">
      {/* Фоновый эффект Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-10">
        <Aurora
          colorStops={['#ffb3b3', '#ff8080', '#ff4d4d']}
          amplitude={1.0}
          blend={0.5}
          speed={2.0}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl relative z-10">
        {/* Навигация */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 text-red-500 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Назад</span>
            </button>

            {/* Хлебные крошки */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-500">
              <Link to="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                Главная
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link 
                to={`/${isCourse ? 'courses' : 'news'}`} 
                className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {isCourse ? 'Курсы' : 'Новости'}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
                {title}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Основная карточка */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 mb-12"
        >
          {/* Изображение */}
          {image && (
            <div className="relative h-[500px] overflow-hidden group">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Категория/цена */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-6 left-6"
              >
                <span className="px-6 py-3 bg-white/95 backdrop-blur-sm text-red-600 rounded-full text-lg font-bold shadow-xl">
                  {isCourse ? `${item.price} сомони` : (item.newsTopic || 'Новость')}
                </span>
              </motion.div>

              {/* Кнопки действий */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-6 right-6 flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isSaved ? 'text-red-600' : 'hover:text-red-600'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </motion.button>
              </motion.div>

              {/* Заголовок на изображении */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                  {title}
                </h1>
                {!isCourse && (
                  <div className="flex items-center gap-6 text-white/90 text-base">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {formatDate(item.published)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      {Math.floor(Math.random() * 1000) + 1} просмотров
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Контент */}
          <div className="p-8 md:p-12">
            {/* Мета-информация для курса */}
            {isCourse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Tag className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">Цена курса</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {item.price} <span className="text-base font-normal text-gray-500">сомони</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Star className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">Рейтинг</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {item.rate || 4.8} <span className="text-base font-normal text-gray-500">/ 5</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-zinc-500">Длительность</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {item.months || '3'} <span className="text-base font-normal text-gray-500">мес</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Преимущества для курса */}
            {isCourse && benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-red-500" />
                  Что вы получите:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-gray-700 dark:text-gray-300">{benefit.trim()}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Основной текст */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg max-w-none dark:prose-invert mb-10"
            >
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {typeof content === 'string' ? parse(content) : content}
              </div>
            </motion.div>

            {/* Блок с действиями */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-gray-200 dark:border-zinc-800"
            >
              {isCourse ? (
                <HashLink smooth to="/#contacts">
                  <Button size="lg" className="group px-8 py-3 text-base">
                    Записаться на курс
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </HashLink>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleShare}
                  className="group px-8 py-3 text-base"
                >
                  Поделиться
                  <Share2 className="ml-2 w-5 h-5" />
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Похожие материалы */}
        {relatedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Похожие {isCourse ? 'курсы' : 'материалы'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 hover:border-red-500 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl"
                >
                  {related.image && (
                    <img
                      src={`${baseUrl}/api/files/${isCourse ? 'learn_it_courses' : 'learn_it_news'}/${related.id}/${related.image}`}
                      alt={related.nameCourse || related.newsTopic}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {related.nameCourse || related.newsTopic}
                    </h3>
                    <Link 
                      to={`/detail/${type}/${related.id}`}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      Подробнее
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;