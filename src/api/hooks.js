import { useQuery } from '@tanstack/react-query';
import { api } from './client';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => api.getCourses(),
    select: (data) => data.items.map(rec => ({
      id: rec.id,
      title: rec.nameCourse,
      description: rec.description,
      benefits: rec.tags ? rec.tags.split(',') : ["Практика", "Проекты"],
      price: rec.price,
      image: rec.image,
      months: rec.months,
      rate: rec.rate,
    })),
  });
};

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => api.getNews(),
    select: (data) => {
      const sorted = data.items.sort((a, b) => 
        new Date(b.published) - new Date(a.published)
      );
      return sorted;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const usePartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: () => api.getPartners(),
    select: (data) => data.items || [],
    staleTime: 30 * 60 * 1000,
  });
};

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: () => api.getReviews(),
    select: (data) => data.items || [],
    staleTime: 10 * 60 * 1000,
  });
};

export const useDetailItem = (type, id) => {
  return useQuery({
    queryKey: [type, id],
    queryFn: () => api.getDetailItem(type, id),
    enabled: !!id && !!type,
  });
};