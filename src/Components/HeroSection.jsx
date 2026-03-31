import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './UI/Button';
import Aurora from './Aurora';
import log from '../assets/log.png';

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden bg-transparent"
      data-aos="fade"
      data-aos-duration="1000"
    >
      {/* Фоновый градиент */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900"></div>
      </div>

      {/* Фон с Aurora эффектом */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <Aurora
          key="aurora-light"
          colorStops={['#ffb3b3', '#ff9999', '#ff8080']}
          amplitude={1.3}
          blend={0.4}
          speed={3.0}
          className="opacity-60 md:opacity-80 dark:opacity-0 transition-all duration-700"
        />
        <Aurora
          key="aurora-dark"
          colorStops={['#8B0000', '#B22222', '#DC143C', '#FF4444']}
          amplitude={1.5}
          blend={0.35}
          speed={2.8}
          className="opacity-0 dark:opacity-60 md:dark:opacity-80 transition-all duration-700"
        />
        <Aurora
          key="aurora-glow"
          colorStops={['#FF0000', '#CC0000', '#990000']}
          amplitude={1.0}
          blend={0.5}
          speed={2.0}
          className="opacity-0 dark:opacity-30 transition-all duration-700"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Левая колонка */}
          <div className="order-2 lg:order-1" data-aos="fade-right" data-aos-duration="800" data-aos-delay="200">
            {/* Бейдж */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-600 text-sm font-medium mb-6 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 dark:bg-red-500"></span>
              </span>
              Набор на новый поток открыт
            </div>

            {/* Заголовок */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white dark:text-white leading-[1.1] tracking-tight mb-4" data-aos="fade-up" data-aos-duration="900" data-aos-delay="400">
              Добро пожаловать в <br />
              <span className="text-red-500 dark:text-red-400">академию программирования</span> <br />
              <span className="text-red-500 dark:text-red-400">Learn IT</span>
            </h1>

            {/* Слоганы */}
            <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start items-center gap-2 sm:gap-3 mb-6" data-aos="fade-up" data-aos-duration="800" data-aos-delay="450">
              {['LEARN IT', 'TRY IT', 'MAKE IT WORK'].map((text, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-md blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-sm border border-red-200 rounded-md shadow-md dark:bg-zinc-900/90 dark:border-red-500/30">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 dark:from-red-400 dark:to-red-500 whitespace-nowrap">
                      {text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Описание */}
            <p className="text-lg md:text-xl text-amber-800 dark:text-zinc-400 mb-8 max-w-2xl leading-relaxed" data-aos="fade-up" data-aos-duration="800" data-aos-delay="500">
              Мы обучаем современным IT-профессиям с нуля. Получите востребованные навыки,
              создайте портфолио и начните карьеру в технологиях под руководством опытных менторов.
            </p>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
              <HashLink smooth to="#contacts">
                <Button size="lg" className="group bg-red-500 hover:bg-red-600 text-white dark:bg-red-500 dark:hover:bg-red-600 shadow-lg hover:shadow-xl transition-all">
                  Получить консультацию
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </HashLink>
              <Link to="/courses">
                <Button variant="outline" size="lg" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10">
                  Посмотреть программу
                </Button>
              </Link>
            </div>
          </div>

          {/* Правая колонка - логотип */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-offset="100">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="absolute inset-0 flex items-center justify-center dark:hidden">
                <div className="w-[80%] h-[80%] bg-gradient-to-r from-red-400/30 to-red-500/30 rounded-full blur-2xl" />
              </div>
              <img
                src={log}
                alt="Learn IT Academy"
                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] dark:drop-shadow-[0_20px_30px_rgba(255,255,255,0.1)] dark:brightness-100 dark:invert-0"
              />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-red-300/40 to-red-400/40 rounded-full blur-3xl dark:bg-red-500/20" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="500" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-amber-300/40 to-amber-400/40 rounded-full blur-3xl dark:bg-orange-500/20" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="600" />
            </div>
          </div>
        </div>
      </div>

      {/* Скролл индикатор */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" data-aos="fade" data-aos-duration="1000" data-aos-delay="1000">
        <div className="w-6 h-10 border-2 border-red-300 dark:border-red-500/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-red-500 dark:bg-red-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;