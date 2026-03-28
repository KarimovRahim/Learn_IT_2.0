import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import { IconBrandTelegram, IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import log from '../../assets/logotype.png';


const Footer = () => {
  return (
    <footer
      className="bg-white border-t border-black/10 pt-16 pb-8 dark:bg-zinc-950 dark:border-zinc-900"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-offset="100"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Первая колонка */}
          <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="100">
            <div className="">
              <img
                src={log}
                alt="Learn IT Logo"
                className="w-[100px]"
              />
            </div>
            <p className="text-black/50 text-sm leading-relaxed mb-6 dark:text-zinc-500">
              Современная академия программирования. Мы помогаем людям освоить новые профессии и изменить свою жизнь к лучшему.
            </p>

            <div className="flex gap-4">
              <a
                href="https://t.me/Learn_IT_academy_tj"
                className="group relative"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-[#0088cc] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                <div className="relative p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg group-hover:shadow-[#0088cc]/50 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <IconBrandTelegram className="w-5 h-5 text-[#0088cc]" stroke={1.5} />
                </div>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61560358667207&mibextid=ZbWKwL"
                className="group relative"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-[#1877f2] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                <div className="relative p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg group-hover:shadow-[#1877f2]/50 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <IconBrandFacebook className="w-5 h-5 text-[#1877f2]" stroke={1.5} />
                </div>
              </a>

              <a
                href="https://www.instagram.com/learn_it_academy.tj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="group relative"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                <div className="relative p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg group-hover:shadow-[#ee2a7b]/50 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <IconBrandInstagram className="w-5 h-5 text-[#ee2a7b]" stroke={1.5} />
                </div>
              </a>
            </div>
          </div>

          {/* Вторая колонка */}
          <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="150">
            <h4 className="text-black font-bold mb-6 dark:text-white">Обучение</h4>
            <ul className="space-y-3 text-sm text-black/50 dark:text-zinc-400">
              <li><Link to="/courses" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Frontend Разработка</Link></li>
              <li><Link to="/courses" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Backend Разработка</Link></li>
              <li><Link to="/courses" className="hover:text-red-600 transition-colors dark:hover:text-red-500">UI/UX Дизайн</Link></li>
              <li><Link to="/courses" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Мобильная разработка</Link></li>
              <li><Link to="/courses" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Графический Дизайн</Link></li>
            </ul>
          </div>

          {/* Третья колонка */}
          <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="200">
            <h4 className="text-black font-bold mb-6 dark:text-white">Компания</h4>
            <ul className="space-y-3 text-sm text-black/50 dark:text-zinc-400">
              <li><Link to="/" className="hover:text-red-600 transition-colors dark:hover:text-red-500">О нас</Link></li>
              <li><Link to="/" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Наша команда</Link></li>
              <li><Link to="/services" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Услуги</Link></li>
              <li><Link to="/news" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Новости</Link></li>
              <li><HashLink smooth to="/#contacts" className="hover:text-red-600 transition-colors dark:hover:text-red-500">Контакты</HashLink></li>
            </ul>
          </div>

          {/* Четвертая колонка */}
          <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="250">
            <h4 className="text-black font-bold mb-6 dark:text-white">Контакты</h4>
            <ul className="space-y-3 text-sm text-black/50 dark:text-zinc-400">
              <li>г. Худжанд, Хиёбони И.Сомони 93А <br /> (ориентир Дилбархон 3-этаж)</li>
              <li>+992 (92) 009-13-13</li>
              <li>learnit_academy@mail.ru</li>
              <li>Пн-Сб: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div
          className="border-t border-black/10 pt-8 flex flex-col items-center justify-center md:flex-row justify-center items-center gap-4 text-xs text-black/40 dark:border-zinc-800 dark:text-zinc-600"
        // data-aos="fade-up"
        // data-aos-duration="500"
        // data-aos-delay="300"
        >
          <p>© 2026 Learn IT Academy. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer