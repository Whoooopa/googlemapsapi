export default function getImage(url: any) {
  const newURL = new URL(`../assets/${url}`, import.meta.url).href;
  return newURL;
}
