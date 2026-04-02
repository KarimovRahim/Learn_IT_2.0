import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import parse from 'html-react-parser';
import { HashLink } from 'react-router-hash-link';
import Section from '../Components/UI/Section'
import Button from '../Components/UI/Button'
import ReadMoreButton from '../Components/ReadMoreButton.jsx';

// MUI Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";

const Courses = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Все");
  const [sortBy, setSortBy] = useState("default");

  const levels = ["Все", "Для начинающих", "Для продвинутых", "С трудоустройством"];

  async function getCourses() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL || 'https://ehjoi-manaviyat.pockethost.io'}/api/collections/learn_it_courses/records?page=1&perPage=50`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const json = await res.json();
      const records = json.items;

      const formattedData = records.map((rec) => ({
        id: rec.id,
        imageCourse: `${import.meta.env.VITE_POCKETBASE_URL || 'https://ehjoi-manaviyat.pockethost.io'}/api/files/${rec.collectionId}/${rec.id}/${rec.image}`,
        months: rec.months,
        nameCourse: rec.nameCourse,
        tags: rec.tags,
        description: rec.description,
        price: rec.price,
        rate: rec.rate,
      }));

      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    let filtered = [...data];

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.nameCourse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLevel !== "Все") {
      filtered = filtered.filter(course => course.tags && course.tags.includes(selectedLevel));
    }

    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rate - a.rate);
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedLevel, sortBy, data]);

  return (
    <div className="pt-20">
      <Section
        className="bg-gradient-to-b from-white to-gray-100 dark:from-zinc-950 dark:to-zinc-900"
        data-aos="fade"
        data-aos-duration="1000"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-black mb-6 dark:text-white"
          >
            Все <span className="text-red-600 dark:text-red-500">курсы</span> программирования
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-black/70 mb-8 dark:text-zinc-400"
          >
            Выберите направление, которое подходит именно вам. Старт новых групп каждые 2 недели.
          </motion.p>
        </div>

        <div className="bg-gray-50/50 dark:bg-transparent transition-colors duration-300 rounded-3xl p-2 md:p-8">
          <div className="max-w-[1440px] mx-auto pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map((element, index) => (
                <motion.div
                  key={element.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-black/10 rounded-3xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 group dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-red-500/30 shadow-sm hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={element.imageCourse}
                      alt={element.nameCourse}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <StarIcon sx={{ fontSize: 16 }} className="text-yellow-500" />
                      <span className="text-sm font-bold text-gray-900">
                        {element.rate}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500 text-white shadow-lg">
                        Курс
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-3 group-hover:text-red-600 transition-colors dark:text-white dark:group-hover:text-red-500">
                      {element.nameCourse}
                    </h3>

                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {parse(element.description)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CalendarMonthIcon sx={{ fontSize: 18 }} className="text-red-500" />
                        <span>Длительность: {element.months}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <PaymentsIcon sx={{ fontSize: 18 }} className="text-red-500" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {element.price} сомони
                        </span>
                      </div>
                    </div>

                    {element.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {element.tags.split(',').slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            <CheckCircleOutlineIcon sx={{ fontSize: 12 }} className="text-red-500" />
                            {tag.trim()}
                          </span>
                        ))}
                        {element.tags.split(',').length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-md">
                            +{element.tags.split(',').length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-4">
                      <ReadMoreButton
                        to={`/detail/course/${element.id}`}
                        type="default"
                        size="md"
                        className="flex-1"
                      >
                        Подробнее
                      </ReadMoreButton>
                      
                      <HashLink
                        smooth
                        to="/#contacts"
                        className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <ArrowForwardIcon sx={{ fontSize: 20 }} />
                      </HashLink>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
                  <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    Курсы не найдены
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Попробуйте изменить параметры поиска
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 pb-10"
        >
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-3xl p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-3 dark:text-white">
              Не нашли подходящий курс?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Напишите нам, и мы поможем подобрать индивидуальную программу обучения под ваши цели.
            </p>
            <HashLink smooth to="/#contacts">
              <Button size="lg" className="rounded-full px-10 shadow-lg hover:shadow-xl">
                Связаться с менеджером
              </Button>
            </HashLink>
          </div>
        </motion.div>
      </Section>
    </div>
  )
}

export default Courses;