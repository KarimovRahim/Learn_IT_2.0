const BASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://ehjoi-manaviyat.pockethost.io';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  getImageUrl(collection, id, filename) {
    if (!filename) return null;
    return `${this.baseUrl}/api/files/${collection}/${id}/${filename}`;
  }

  getCourses() {
    return this.request('/api/collections/learn_it_courses/records?perPage=100');
  }

  getNews() {
    return this.request('/api/collections/learn_it_news/records?sort=-published');
  }

  getServices() {
    return this.request('/api/collections/Services/records');
  }

  getPartners() {
    return this.request('/api/collections/learn_it_parthners/records');
  }

  getReviews() {
    return this.request('/api/collections/learn_it_reviews/records?sort=-created');
  }

  getDetailItem(type, id) {
    const collection = type === 'news' ? 'learn_it_news' : 'learn_it_courses';
    return this.request(`/api/collections/${collection}/records/${id}`);
  }
}

export const api = new ApiClient();