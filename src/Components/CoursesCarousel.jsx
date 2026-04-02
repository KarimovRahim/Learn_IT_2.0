import React from 'react';
import { motion } from 'framer-motion';
import parse from 'html-react-parser';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import TerminalIcon from '@mui/icons-material/Terminal';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReadMoreButton from './ReadMoreButton';
import Section from './UI/Section';

import 'swiper/swiper-bundle.css';

const CoursesCarousel = ({ 
  courses = [], 
  title = "Наши курсы", 
  subtitle = "Выберите направление и начните свой путь в IT. Все курсы включают практические задания и поддержку менторов.",
  id = "courses",
  className = ""
}) => {
  
  if (!courses || courses.length === 0) {
    return (
      <Section id={id} className={`bg-white dark:bg-transparent ${className}`}>
        <div className="w-full py-20 text-center">
          <p className="text-gray-500 dark:text-zinc-400">Курсы временно недоступны</p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      id={id}
      className={`bg-white dark:bg-transparent ${className}`}
      data-aos="fade-up"
      data-aos-duration="1000"
      data-aos-offset="200"
    >
      <div className="w-full py-20 bg-[#fdfdfd] dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="text-left">
              <h1 className="text-4xl font-bold mb-4 dark:text-white tracking-tight">{title}</h1>
              <p className="text-gray-500 max-w-xl dark:text-zinc-400">{subtitle}</p>
            </div>

            <div className="flex gap-3">
              <button className="courses-swiper-prev-btn w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 dark:border-zinc-800 dark:text-white">
                <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
              </button>
              <button className="courses-swiper-next-btn w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 dark:border-zinc-800 dark:text-white">
                <ArrowForwardIosIcon sx={{ fontSize: 18, marginLeft: '3px' }} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={25}
            slidesPerView={1}
            navigation={{
              prevEl: '.courses-swiper-prev-btn',
              nextEl: '.courses-swiper-next-btn',
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="!pb-14"
          >
            {courses.slice(0, 6).map((course) => (
              <SwiperSlide key={course.id} className="h-auto">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group bg-white h-full border border-gray-100 hover:border-transparent rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:bg-zinc-900 dark:border-zinc-800 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-0 dark:bg-red-900/10" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="bg-zinc-50 w-14 h-14 rounded-xl flex items-center justify-center mb-8 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 dark:bg-zinc-800">
                      <TerminalIcon />
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 mb-4 group-hover:text-red-600 transition-colors dark:text-white">
                      {course.title}
                    </h3>

                    <div className="text-zinc-500 text-sm mb-6 line-clamp-4 flex-grow dark:text-zinc-400 leading-relaxed">
                      {typeof course.description === 'string' ? parse(course.description) : course.description}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {course.benefits?.slice(0, 3).map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-150 transition-transform" />
                          {benefit.trim()}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">Цена</span>
                        <span className="text-lg font-bold text-zinc-900 dark:text-white block">
                          {course.price} <span className="text-xs font-medium text-zinc-400 uppercase ml-1">смн</span>
                        </span>
                      </div>

                      <ReadMoreButton to={`/detail/course/${course.id}`}>
                        Подробнее
                      </ReadMoreButton>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <style>{`
          .courses-swiper-prev-btn,
          .courses-swiper-next-btn {
            cursor: pointer;
          }
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: #d1d1d1 !important;
            opacity: 1 !important;
          }
          .swiper-pagination-bullet-active {
            background: #dc3545 !important;
            width: 24px !important;
            border-radius: 4px !important;
            transition: all 0.3s ease;
          }
          .swiper-button-next, 
          .swiper-button-prev {
            display: none !important;
          }
        `}</style>
      </div>
    </Section>
  );
};

export default CoursesCarousel;