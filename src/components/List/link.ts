export default ({ id, url }: { id: number; url?: string }) =>
  url || `https://news.ycombinator.com/item?id=${id}`;
