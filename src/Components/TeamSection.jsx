import React from 'react';
import Section from './UI/Section';
import Mehrdod from '../assets/mehrdod.jpg';
import Amir from '../assets/amir.jpg';
import Ismoil from '../assets/ismoil.jpg';
import Narzullo from '../assets/narzullo.jpg';

const team = [
  { name: 'Тохири Мехрдод', role: 'СЕО LearnITacademy, Ментор и FrontEnd разработчик', img: Mehrdod },
  { name: 'Амир Олимов', role: 'Ментор, FullStack-разработчик', img: Amir },
  { name: 'Нарзуллоев Нарзулло', role: 'Ментор, Frontend-разработчик', img: Narzullo },
  { name: 'Исмоил Олимов', role: 'Ментор, Frontend-разработчик', img: Ismoil },
];

const TeamSection = () => {
  return (
    <Section id="team" className="bg-white dark:bg-transparent" data-aos="fade-up" data-aos-duration="1000" data-aos-offset="200">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 dark:text-white" data-aos="fade-up" data-aos-duration="700">
          Наша команда
        </h2>
        <p className="text-black/70 max-w-2xl mx-auto dark:text-zinc-400" data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
          Опытные менторы, которые будут сопровождать вас на каждом этапе обучения.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <div key={index} className="group relative" data-aos="fade-up" data-aos-duration="600" data-aos-delay={100 + index * 50}>
            <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-gray-200 dark:border-zinc-700 shadow-lg group-hover:shadow-xl transition-all duration-500">
              <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="text-center relative">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300">
                {member.role}
              </p>
              <div className="w-0 h-0.5 bg-red-500 mx-auto mt-3 group-hover:w-16 transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default TeamSection;