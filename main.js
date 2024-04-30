export const loadedGoogleMapsAPI = new Promise((resolve,reject) => {

    window['GoogleMapsInit'] = resolve;

    let GMap = document.createElement('script');

    GMap.setAttribute('src',
   `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places,marker,drawing,geometry&loading=async&callback=GoogleMapsInit`);

    document.body.appendChild(GMap); 
});