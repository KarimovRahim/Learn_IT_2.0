import React, { useState, memo } from 'react';

const PartnerCard = memo(({ partner, index, delay }) => {
  const [imageError, setImageError] = useState(false);
  
  // Формируем URL для изображения из PocketBase
  const imageUrl = partner.image 
    ? `https://ehjoi-manaviyat.pockethost.io/api/files/learn_it_parthners/${partner.id}/${partner.image}`
    : null;

  return (
    <a
      href={partner.website || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay={delay}
    >
      <div className="relative overflow-hidden rounded-xl aspect-square mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-gray-200 dark:border-zinc-700 shadow-lg group-hover:shadow-xl transition-all duration-500">
        
        {/* Логотип из PocketBase */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={partner.name}
            className="w-full h-full object-contain p-8 transition-all duration-700 ease-out group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-4xl font-bold text-red-600 dark:text-red-500 transition-all duration-700 ease-out group-hover:scale-110">
            {partner.name ? partner.name.charAt(0).toUpperCase() : '?'}
          </div>
        )}

        {/* Остальной код без изменений */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-red-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white text-sm font-medium text-center line-clamp-2">
            {partner.name}
          </p>
        </div>
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100">
          <span className="text-red-600 text-lg font-bold">↗</span>
        </div>
      </div>

      <div className="text-center relative">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
          {partner.name}
        </h3>
        <div className="w-0 h-0.5 bg-red-500 mx-auto mt-3 group-hover:w-16 transition-all duration-500"></div>
      </div>
    </a>
  );
});

PartnerCard.displayName = 'PartnerCard';

export default PartnerCard;