import ky from "ky";

const api = ky.create({ prefixUrl: "https://hacker-news.firebaseio.com/v0/" });

export const get = (url) => api.get(url).json();

export default api;
