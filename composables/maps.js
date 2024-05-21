import axios from "axios"

// console.log(import.meta.env.VITE_PLACE_BASE_URL);
const placeInstance = axios.create({
  baseURL: import.meta.env.VITE_PLACE_BASE_URL,
  allowAbsoluteUrls: false, // base url is http....places ,to use textsearch,nearby search etc ':textSearch is appended', axios run a regex check if given url starts with ':' , url is not combined with baseURL because it is considered an absolute URL
  headers: {
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAP_API_KEY
  }
});


// unlike textSearch, nearbySearch place.photos request shows CORS error because header is not allowed to have X-Goog-Api-key 
const placeInstanceWithoutXGoog = axios.create({
  baseURL: import.meta.env.VITE_PLACE_BASE_URL,
  allowAbsoluteUrls: false, 
  params: {
    key: import.meta.env.VITE_GOOGLE_MAP_API_KEY
  }
});

const mapInstance = axios.create({
  baseURL: import.meta.env.VITE_GOOGLE_MAP_BASE_URL,
  allowAbsoluteUrls: false, 
  params: {
    key: import.meta.env.VITE_GOOGLE_MAP_API_KEY
  }
});

const routeInstance = axios.create({
  baseURL: import.meta.env.VITE_ROUTE_BASE_URL,
  allowAbsoluteUrls: false,
  headers: {
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAP_API_KEY
  }
})


export { placeInstance, placeInstanceWithoutXGoog, mapInstance, routeInstance };