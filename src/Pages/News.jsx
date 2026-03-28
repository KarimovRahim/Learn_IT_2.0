import React, { useEffect, useState } from 'react'
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../Components/UI/Section'
import Button from '../Components/UI/Button'
import ReadMoreButton from '../Components/ReadMoreButton.jsx';
import { 
  Calendar, User, Clock, Tag, ArrowRight, TrendingUp, 
  BookOpen, MessageSquare, Newspaper, Share2, Heart, 
  Eye, Bookmark, Search, Filter, X 
} from 'lucide-react'

const newsApi = "https://ehjoi-manaviyat.pockethost.io/api/collections/learn_it_news/records";

const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState({});
  const [savedItems, setSavedItems] = useState({});

  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];

  // Получаем все уникальные категории из новостей
  const categories = ['Все', ...new Set(news.map(item => item.newsTopic || 'Новость'))];

  const getNews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(newsApi);
      const data = await res.json();

      // Сортировка по дате публикации (новые сверху)
      const sorted = data.items.sort((a, b) =>
        new Date(b.published) - new Date(a.published)
      );

      setNews(sorted);
      setFilteredNews(sorted);
    } catch (error) {
      console.error("Ошибка при получении новостей:", error);
      setNews([]);
      setFilteredNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "некорректная дата";
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatReadTime = (content) => {
    const textLength = content?.length || 0;
    const minutes = Math.max(1, Math.ceil(textLength / 200));
    return `${minutes} мин`;
  };

  useEffect(() => {
    getNews();
  }, []);

  // Фильтрация новостей
  useEffect(() => {
    let filtered = [...news];
    
    // Фильтр по категории
    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(item => item.newsTopic === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.newsTopic?.toLowerCase().includes(query)) ||
        (item.info?.toLowerCase().includes(query))
      );
    }
    
    setFilteredNews(filtered);
  }, [selectedCategory, searchQuery, news]);

  const handleLike = (id) => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = (id) => {
    setSavedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearFilters = () => {
    setSelectedCategory('Все');
    setSearchQuery('');
  };

  return (
    <div className="pt-20">
      <Section
        className="bg-gradient-to-b from-white to-gray-100 dark:from-zinc-950 dark:to-zinc-900"
        data-aos="fade"
        data-aos-duration="1000"
      >
        {/* Заголовок */}
        <div
          className="text-center max-w-3xl mx-auto mb-12"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-6 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
          >
            <Newspaper className="w-4 h-4" />
            Самые свежие материалы из мира IT
          </motion.div>
          <h1
            className="text-4xl md:text-5xl font-bold text-black mb-6 dark:text-white"
          >
            <span className="text-red-600 dark:text-red-500">Новости</span> и статьи
          </h1>
          <p
            className="text-xl text-black/70 dark:text-zinc-400"
          >
            Самые свежие материалы о технологиях, карьере и обучении в IT
          </p>
        </div>

        {/* Фильтры и поиск */}
        <div className="max-w-6xl mx-auto mb-12 space-y-4">
          {/* Поиск */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>

          {/* Категории */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.slice(0, 6).map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-zinc-800'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Информация о количестве и кнопка сброса */}
          {(selectedCategory !== 'Все' || searchQuery) && (
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Найдено: {filteredNews.length} новостей</span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>

        {/* Сетка новостей */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <p className="text-black/70 dark:text-zinc-400">Загрузка новостей...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredNews.length > 0 ? (
              filteredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 group dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-red-500/30 shadow-sm hover:shadow-xl"
                >
                  {/* Изображение */}
                  {item.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`https://ehjoi-manaviyat.pockethost.io/api/files/learn_it_news/${item.id}/${item.image}`}
                        alt={item.newsTopic || "news"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Индикатор свежести */}
                      {index < 3 && (
                        <motion.div
                          initial={{ x: 100 }}
                          animate={{ x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
                        >
                          NEW
                        </motion.div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Категория и статистика */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                        {item.newsTopic || "Новость"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          {Math.floor(Math.random() * 500) + 50}
                        </span>
                      </div>
                    </div>

                    {/* Заголовок */}
                    <h3 className="text-xl font-bold text-black mb-3 group-hover:text-red-600 transition-colors line-clamp-2 dark:text-white dark:group-hover:text-red-500">
                      {item.newsTopic || "Новость"}
                    </h3>

                    {/* Описание */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
                      {item.info ? (
                        typeof item.info === 'string' ?
                          item.info.replace(/<[^>]*>/g, '').substring(0, 120) + '...' :
                          'Описание отсутствует'
                      ) : (
                        'Описание отсутствует'
                      )}
                    </p>

                    {/* Мета-информация */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                          LI
                        </div>
                        <span className="text-xs text-gray-500">Learn IT</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.published)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatReadTime(item.info)}
                        </span>
                      </div>
                    </div>

                    {/* Интерактивные кнопки */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(item.id)}
                          className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Heart 
                            className={`w-4 h-4 transition-colors ${
                              likedItems[item.id] 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400 hover:text-red-500'
                            }`} 
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSave(item.id)}
                          className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Bookmark 
                            className={`w-4 h-4 transition-colors ${
                              savedItems[item.id] 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400 hover:text-red-500'
                            }`} 
                          />
                        </motion.button>
                      </div>

                      <ReadMoreButton 
                        to={`/detail/news/${item.id}`}
                        type="outline"
                        size="sm"
                      >
                        Читать
                      </ReadMoreButton>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="inline-block p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
                  <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    Новостей не найдено
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                    Попробуйте изменить параметры поиска
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Сбросить фильтры
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Подписка
        <div className="text-center max-w-2xl mx-auto py-16 px-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-3xl">
          <MessageSquare className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-3 dark:text-white">
            Будьте в курсе последних новостей
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Подпишитесь на нашу рассылку и получайте самые интересные статьи первыми
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-red-500"
            />
            <Button className="whitespace-nowrap">
              Подписаться
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Отправляя email, вы соглашаетесь с политикой конфиденциальности
          </p>
        </div> */}
      </Section>
    </div>
  )
}

export default News;