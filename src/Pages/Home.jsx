import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import HeroSection from '../Components/HeroSection';
import CoursesCarousel from '../Components/CoursesCarousel';
import AboutSection from '../Components/AboutSection';
import StatsSection from '../Components/StatsSection';
import TeamSection from '../Components/TeamSection';
import PartnerCard from '../Components/PartnerCard';
import ReviewsSection from '../Components/ReviewsSection';
import TelegramContactForm from '../Components/TelegramContactForm';
import Section from '../Components/UI/Section';
import { TrendingUp, MapPin, Phone as PhoneIcon, Mail } from 'lucide-react';

const Home = () => {
  // Используем React Query для курсов
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.getCourses(),
    select: (data) => data.items.map(rec => ({
      id: rec.id,
      title: rec.nameCourse,
      description: rec.description,
      benefits: rec.tags ? rec.tags.split(',') : ["Практика", "Проекты"],
      price: rec.price,
    })),
  });

  // Используем React Query для партнёров
  const { data: partnersData, isLoading: partnersLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: () => api.getPartners(),
    select: (data) => data.items || [],
    staleTime: 30 * 60 * 1000,
  });

  const courses = coursesData || [];
  const partners = partnersData || [];

  return (
    <>
      <HeroSection />

      <CoursesCarousel 
        courses={courses}
        title="Наши курсы"
        subtitle="Выберите направление и начните свой путь в IT. Все курсы включают практические задания и поддержку менторов."
      />

      <AboutSection />
      <StatsSection />
      <TeamSection />

      {/* Partners Section */}
      <Section className="bg-white dark:bg-transparent" data-aos="fade-up" data-aos-duration="1000" data-aos-offset="200">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-4 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400" data-aos="fade-up" data-aos-duration="600">
            <TrendingUp className="w-4 h-4" />
            Наши партнёры
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 dark:text-white" data-aos="fade-up" data-aos-duration="700">
            Компании, которые нам <span className="text-red-600 dark:text-red-500">доверяют</span>
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto dark:text-zinc-400" data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
            Ведущие IT-компании, где работают наши выпускники и с которыми мы активно сотрудничаем
          </p>
        </div>

        {partnersLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.length > 0 ? (
              partners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} delay={100 + index * 50} />
              ))
            ) : (
              // Запасные партнёры
              [{ name: 'TechCorp' }, { name: 'InnoSoft' }, { name: 'DevStudio' }, { name: 'CloudSystems' }].map((partner, index) => (
                <PartnerCard key={`fallback-${index}`} partner={{ id: `fallback-${index}`, name: partner.name, website: '#', logo: null }} index={index} delay={100 + index * 50} />
              ))
            )}
          </div>
        )}
      </Section>

      <ReviewsSection />

      {/* Contact Section */}
      <Section id="contact" className="bg-white dark:bg-transparent" data-aos="fade-up" data-aos-duration="1000" data-aos-offset="200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 dark:text-white" data-aos="fade-right" data-aos-duration="700">
              Связаться с нами
            </h2>
            <p className="text-black/70 mb-8 leading-relaxed dark:text-zinc-400" data-aos="fade-right" data-aos-duration="700" data-aos-delay="100">
              Оставьте заявку, и наш менеджер свяжется с вами в течение 15 минут, чтобы ответить на все вопросы и помочь с выбором курса.
            </p>

            <div className="space-y-6">
              {[
                { icon: <MapPin className="w-5 h-5 text-red-600 dark:text-red-500" />, title: 'Адрес', text: 'г. Худжанд, Хиёбони И.Сомони 93А (ориентир Дилбархон 3-этаж)' },
                { icon: <PhoneIcon className="w-5 h-5 text-red-600 dark:text-red-500" />, title: 'Телефон', text: '+992 (92) 009-13-13' },
                { icon: <Mail className="w-5 h-5 text-red-600 dark:text-red-500" />, title: 'Email', text: 'learnit_academy@mail.ru' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4" data-aos="fade-right" data-aos-duration="600" data-aos-delay={150 + idx * 50}>
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0 border border-red-100 dark:bg-zinc-900 dark:border-zinc-800">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-black font-medium mb-1 dark:text-white">{item.title}</h4>
                    <p className="text-black/70 text-sm dark:text-zinc-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <TelegramContactForm />
        </div>
      </Section>

      {/* Карта */}
      <div id="contacts" className="w-full flex justify-center bg-[#DA4533] dark:bg-transparent pt-[70px] pb-[50px]">
        <div className="w-[90%] max-w-[1000px] h-[400px] rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1522.0419508867233!2d69.6379656!3d40.2738864!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b1b363df3d22ab%3A0xcf204e8dd836ec19!2sLearn%20IT%20Academy!5e0!3m2!1sen!2s!4v1747903235766!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Home;