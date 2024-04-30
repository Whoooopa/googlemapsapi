<template>
<div class="flex justify-center">
    <div id="map2" class="map2 z-20 bg-slate-600 w-screen h-screen"></div>
    <div class="absolute top-3 flex justify-center flex-row z-20 gap-3">
        <UInput class="w-80 h-8 bg-white rounded-md z-20 shadow-lg" v-model="query" type="text" placeholder="Enter a location" name="queryInput"></UInput>
        <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="findAddress"
        v-on:keyup.13="findAddress">Geocode</div>
        <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="findPlaces">Search(Place)</div>
        <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="nearbySearch"
        v-if="userPosition">Nearby Search</div>
        <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="clear">Clear</div>
        <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="getCurrentLocation">Find Me</div>
        <div class="w-32 bg-red-500 flex justify-center items-center shadow-lg cursor-pointer text-white"
        @click="router.push('/')">Exit</div>
    </div>
    <div
    v-if="responseBar"
    class="absolute right-0 top-20 bg-white w-64 h-[calc(100vh-5rem)] overflow-y-auto z-20 text-black">
    {{ responseText }}
    </div>
    <div
    v-if="responseBar"
    class="absolute left-0 top-20 bg-white w-64 h-[calc(100vh-5rem)] overflow-y-auto z-20 text-black">
    {{ response.formatted_address }}
    </div>
</div>
</template>
<script setup>
const mapStore = useMapStore();
const responseBar = ref(false);
const responseText = ref();
const router = useRouter();
const response = ref();
let map2;
let geocoder, service;
let marker, infoWindow;
let markers = [];


const latLngObject = computed(() => mapStore.$state.latLng);
const userPosition = computed(() => mapStore.$state.currentUserLocation);
const query = defineModel();

onMounted(() => {
    console.log("Mounted");
    initMap();
})

defineShortcuts({
  enter: {
    usingInput: 'queryInput',
    handler: () => {
      findAddress();
    }
  }
})

function getCurrentLocation(){
    clear();
    infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(pos.lat);
          mapStore.$state.currentUserLocation = pos;

          marker = new google.maps.marker.AdvancedMarkerElement({
            map: map2,
            position: { lat: pos.lat, lng: pos.lng },
          });
          infoWindow.setPosition(pos);
          infoWindow.setContent("You are here");
          infoWindow.open(map2);


          const bounds = new google.maps.LatLngBounds();
          bounds.extend(marker.position);
          map2.fitBounds(bounds);
          map2.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map2.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map2.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map2);
}

function initMap(){
    map2 = new google.maps.Map(document.getElementById('map2'), {
        // You configuration goes here
        center: { lat : mapStore.$state.defaultView.lat, lng : mapStore.$state.defaultView.ltd },
        zoom: 8,
        mapId: "DEMO_MAP_ID", //(prerequisite for placing marker) in production mapId should be configured https://developers.google.com/maps/documentation/javascript/advanced-markers/start
        mapTypeId: 'roadmap',
    });

    geocoder = new google.maps.Geocoder();
    service = new google.maps.places.PlacesService(map2);
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: map2,
        position: { lat : mapStore.$state.defaultView.lat, lng : mapStore.$state.defaultView.ltd }
    });
    // console.log(marker.map);
    map2.addListener("click", (e) => {
        geocode({ location: e.latLng });
    });
    clear();
}

function findAddress(){
    geocode({ address: query.value });
}

function clear() {

    try{
      try{
        marker.setMap(null);
      }
      catch(e){
        console.log(e)
      }
      try{
        markers.forEach((marker) => marker.map = null);
      }
      catch(e){
        console.log(e)
      }
      try{
        marker.map = null;
      }
      catch(e){
        console.log(e)
      }
      try{
        infoWindow.close();
      }
      catch(e){
        console.log(e)
      }
      responseBar.value = false;
    }
    catch(e){
      console.log(e)
    }
}

async function nearbySearch() {

  const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary(
    "places",
  );
  const center = userPosition.value;
  const request = {
    // required parameters
    fields: ["displayName", "location", "businessStatus"],
    locationRestriction: {
      center: center,
      radius: 1000,
    },
    // optional parameters
    includedPrimaryTypes: ["restaurant"],
    maxResultCount: 5,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
    language: "en-US",
  };
  //@ts-ignore
  const { places } = await Place.searchNearby(request);

  if (places.length) {
    console.log(places);

    const bounds = new google.maps.LatLngBounds();

    // Loop through and get all the results.
    places.forEach((place) => {
      markers.push(new google.maps.marker.AdvancedMarkerElement({
        map: map2,
        position: place.location,
        title: place.displayName,
      }));

      bounds.extend(place.location);
      console.log(place);
    });
    map2.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}

// places query  example: tacos in texas
async function findPlaces() {
  const { Place } = await google.maps.importLibrary("places");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const request = {
    textQuery: query.value,
    fields: ["displayName", "location", "businessStatus"],
    language: "en-US",
    maxResultCount: 8,
    useStrictTypeFiltering: false,
  };
  //@ts-ignore
  const { places } = await Place.searchByText(request);

  if (places.length) {
    console.log(places);

    const bounds = new google.maps.LatLngBounds();

    // Loop through and get all the results.
    places.forEach((place) => {
      markers.push(new AdvancedMarkerElement({
        map: map2,
        position: place.location,
        title: place.displayName,
      }));

      bounds.extend(place.location);
      console.log(place);
    });
    map2.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}

async function getPlaceDetails(Place) {
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // Use place ID to create a new Place instance.
//   const place = new Place({
//     id: "ChIJN5Nz71W3j4ARhx5bwpTQEGg",
//     requestedLanguage: "en", // optional
//   });

  // Call fetchFields, passing the desired data fields.
  await Place.fetchFields({
    fields: ["displayName", "formattedAddress", "location"],
  });
  // Log the result
  console.log(Place.displayName);
  console.log(Place.formattedAddress);

  // Add an Advanced Marker
  marker = new google.maps.marker.AdvancedMarkerElement({
    map: map2,
    position: Place.location,
    title: Place.displayName,
  });
}

// geocode can only take exact place name
function geocode(request) {
    clear();
    geocoder
        .geocode(request)
        .then((result) => {
        const { results } = result;

        map2.setCenter(results[0].geometry.location);
        marker.position = results[0].geometry.location;
        marker.setMap(map2);
        responseBar.value = true;
        responseText.value = JSON.stringify(result, null, 2);
        response.value = results[0];
        // console.log(results);
        console.log(results[0]);
        console.log(results[0].place_id);
        const place = new google.maps.places.Place({
            id: results[0].place_id,
            requestedLanguage: "en", // optional
        });
        // getPlaceDetails(place);
        console.log(results[0].geometry.location);
        console.log(results[0].formatted_address);

        // pan to marker
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(results[0].geometry.location);
        map2.fitBounds(bounds);
        return results;
        })
        .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
        });

}

</script>

  