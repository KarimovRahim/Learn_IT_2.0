import React from 'react';
import { Award, BookOpen, Users, Clock, Lightbulb } from 'lucide-react';
import Section from './UI/Section';

const features = [
  { icon: <Award className="w-6 h-6" />, title: 'Сертифицированные учителя', description: 'Наши преподаватели — действующие специалисты ведущих IT-компаний.' },
  { icon: <BookOpen className="w-6 h-6" />, title: '80% практики и 20% теории', description: 'Максимум реальных задач и проектов для вашего портфолио.' },
  { icon: <Users className="w-6 h-6" />, title: 'Индивидуальный подход', description: 'Небольшие группы позволяют уделять время каждому студенту.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Регулярные занятия', description: 'Удобный график обучения, который легко совмещать с работой или учебой.' },
  { icon: <Lightbulb className="w-6 h-6" />, title: 'Творческие уроки', description: 'Нескучная подача материала и интересные домашние задания.' },
];

const AboutSection = () => {
  return (
    <Section id="about" className="relative overflow-hidden bg-white dark:bg-transparent" data-aos="fade-up" data-aos-duration="1000" data-aos-offset="200">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none dark:bg-red-500/5" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-tight dark:text-white" data-aos="fade-right" data-aos-duration="800">
            Многолетний опыт <br />
            <span className="text-black/50 dark:text-zinc-500">обучения профессионалов</span>
          </h2>
          <p className="text-lg text-black/70 mb-6 leading-relaxed dark:text-zinc-400" data-aos="fade-right" data-aos-duration="800" data-aos-delay="100">
            Академия Learn IT была основана с целью предоставить качественное и доступное IT-образование.
            За годы работы мы выпустили сотни специалистов, которые успешно строят карьеру в крупнейших технологических компаниях.
          </p>
          <p className="text-lg text-black/70 mb-8 leading-relaxed dark:text-zinc-400" data-aos="fade-right" data-aos-duration="800" data-aos-delay="150">
            Мы верим, что программирование — это не просто написание кода, а способ мышления.
            Наша методика направлена на развитие аналитических способностей и творческого подхода к решению задач.
          </p>
        </div>

        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-red-50/50 transition-colors border border-transparent hover:border-red-200 dark:hover:bg-zinc-900/50 dark:hover:border-zinc-800" data-aos="fade-left" data-aos-duration="600" data-aos-delay={100 + index * 50}>
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0 text-red-600 dark:bg-red-500/10 dark:text-red-500">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1 dark:text-white">{feature.title}</h3>
                <p className="text-black/70 text-sm dark:text-zinc-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;