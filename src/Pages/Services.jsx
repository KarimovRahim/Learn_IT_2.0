import React, { useEffect, useState } from 'react'
import { HashLink } from 'react-router-hash-link';
import PocketBase from 'pocketbase';
import Section from '../Components/UI/Section'
import Button from '../Components/UI/Button'
import { 
  Code, Zap, Globe, Target, Headphones, Palette, 
  MessageSquare, PenTool, Layout 
} from 'lucide-react'

// Инициализация PocketBase
const pb = new PocketBase('https://ehjoi-manaviyat.pockethost.io');

// Функция для подбора иконки
const getIcon = (title) => {
  const iconClass = "w-10 h-10 text-red-600 dark:text-red-500";
  if (!title) return <Code className={iconClass} />;
  const t = title.toLowerCase();
  
  if (t.includes('дизайн') || t.includes('ui')) return <Palette className={iconClass} />;
  if (t.includes('сайт') || t.includes('web')) return <Globe className={iconClass} />;
  if (t.includes('бот') || t.includes('telegram')) return <MessageSquare className={iconClass} />;
  if (t.includes('логотип')) return <PenTool className={iconClass} />;
  if (t.includes('автоматизация')) return <Zap className={iconClass} />;
  if (t.includes('сопровождение')) return <Layout className={iconClass} />;
  
  return <Code className={iconClass} />; 
};

const Services = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const records = await pb.collection('Services').getFullList({
          sort: '-created',
          requestKey: null,
        });
        setData(records);
      } catch (error) {
        console.error("Ошибка при загрузке услуг:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="pt-20">
      <Section
        className="bg-gradient-to-b from-white to-gray-100 dark:from-zinc-950 dark:to-zinc-900"
        data-aos="fade"
        data-aos-duration="1000"
      >
        {/* Заголовок секции */}
        <div
          className="text-center max-w-3xl mx-auto mb-16"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-6 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="100"
          >
            <Target className="w-4 h-4" />
            Комплексные IT-решения для бизнеса
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-black mb-6 dark:text-white"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="150"
          >
            Наши <span className="text-red-600 dark:text-red-500">услуги</span>
          </h1>
          <p
            className="text-xl text-black/70 dark:text-zinc-400"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="200"
          >
            Помогаем компаниям внедрять современные технологии и развивать IT-компетенции
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {isLoading ? (
            <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
              Загрузка услуг...
            </div>
          ) : (
            data.map((service, index) => {
              // Собираем пункты списка из полей базы
              const featuresList = [service.list1, service.list2, service.list3, service.list4].filter(Boolean);
              
              return (
                <div
                  key={service.id}
                  className="bg-white border border-black/10 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 group dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-red-500/30"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={150 + index * 100}
                >
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden">
                    {service.logo ? (
                      <img 
                        src={pb.files.getUrl(service, service.logo)} 
                        alt={service.name_of_servace} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getIcon(service.name_of_servace)
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-red-600 transition-colors dark:text-white dark:group-hover:text-red-500">
                    {service.name_of_servace}
                  </h3>

                  <p className="text-black/70 mb-6 dark:text-zinc-400">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {featuresList.map((feature, idx) => (
                      <li key={idx} className="text-sm text-black/80 flex items-center gap-2 dark:text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <HashLink smooth to="/#contacts">
                    <Button variant="outline" className="w-full">
                      Узнать подробнее
                    </Button>
                  </HashLink>
                </div>
              );
            })
          )}
        </div>

        {/* Футер секции */}
        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-6 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="250"
          >
            <Headphones className="w-4 h-4" />
            Поддержка 24/7
          </div>

          <h2
            className="text-3xl font-bold text-black mb-6 dark:text-white"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="300"
          >
            Готовы начать сотрудничество?
          </h2>
          <p
            className="text-black/70 mb-8 max-w-2xl mx-auto dark:text-zinc-400"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="350"
          >
            Напишите нам, и мы поможем подобрать индивидуальную программу обучения под ваши цели
          </p>

          <div
            className="max-w-lg mx-auto"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="400"
          >
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <HashLink smooth to="/#contacts">
                <Button size="lg">Связаться с менеджером</Button>
              </HashLink>
            </form>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Services;