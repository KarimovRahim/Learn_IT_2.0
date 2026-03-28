import React from 'react';
import Section from './UI/Section';

const stats = [
  { value: '150+', label: 'Выпускников' },
  { value: '100%', label: 'Завершение курсов' },
  { value: '90%', label: 'Трудоустройство' },
  { value: '5 ★', label: 'Средняя оценка' },
];

const StatsSection = () => {
  return (
    <Section className="bg-red-50 border-y border-red-100 dark:bg-zinc-900 dark:border-zinc-800" data-aos="fade-up" data-aos-duration="800" data-aos-offset="150">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 text-center md:text-left">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-2 dark:text-white" data-aos="fade-right" data-aos-duration="600">
            Наш прогресс
          </h2>
          <p className="text-black/70 text-sm max-w-xs mx-auto md:mx-0 dark:text-zinc-400" data-aos="fade-right" data-aos-duration="600" data-aos-delay="100">
            Цифры говорят громче слов. Наши результаты — это успех наших студентов.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full md:w-auto">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center md:items-start" data-aos="fade-up" data-aos-duration="500" data-aos-delay={100 + index * 50}>
              <span className="text-3xl md:text-4xl font-bold text-black mb-1 dark:text-white">{stat.value}</span>
              <span className="text-sm font-medium text-red-600 uppercase tracking-wider dark:text-red-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default StatsSection;