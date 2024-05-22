<template>
<div class="flex flex-col justify-center">
    <div class="pt-3 flex justify-center items-center flex-col z-20 gap-3 h-24">
      <div class="flex flex-row z-20 gap-3">
          <UInput class="w-80 h-8 bg-white rounded-md z-20 shadow-lg" v-model="query" type="text" placeholder="Enter a location" name="queryInput"></UInput>
          <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="findPlaces"
          v-on:keyup.13="findPlaces">Search</div>
          <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="clear">Clear</div>
          <div class="w-32 bg-slate-400 flex justify-center items-center shadow-lg cursor-pointer" @click="getCurrentLocation">Find Me</div>
          <div class="w-32 bg-red-500 flex justify-center items-center shadow-lg cursor-pointer text-white"
          @click="router.push('/')">Exit</div>
      </div>
      <div class="flex flex-row gap-3 h-8">
        <div
        v-if="userPosition.lat"
        v-for="tag in tags" :key="tag.displayName" @click="toggleTag(tag)">
          <span class="px-4 py-1 w-32 rounded-md cursor-pointer"
            :class=" tag.selected.value ? 
            'text-slate-900 bg-slate-200':
            'text-slate-200 bg-slate-500'"
          >{{ tag.displayName }}</span>
        </div>
      </div>
    </div>


    <div id="map2" class="map2 z-20 bg-slate-600 w-screen h-[calc(100vh-6rem)]"></div>
    <CardSearchResult 
      v-if="responseBar"
      :photo-uri="photoUri"
      @compute-route="handleComputeRoute"
    />
</div>
</template>
<script setup>


const mapStore = useMapStore();
const responseBar = ref(false);
const responseText = ref();
const router = useRouter();
const response = ref();
const photoUri = computed(()=> mapStore.$state.photoURI);
const nearbySearchResult = computed(()=> mapStore.$state.nearbySearchResult);
const textSearchResponse = computed(()=> mapStore.$state.textSearchResponse);
let map2;
let path;
let service;
let marker, infoWindow;
let markers = [];

const tags = [
  {
    displayName: "restaurant",
    queryName: "restaurant",
    selected: ref(false),
  },
  {
    displayName: "hospital",
    queryName: "hospital",
    selected: ref(false),
  },
  {
    displayName: "bank",
    queryName: "bank",
    selected: ref(false),
  },
  {
    displayName: "gas station",
    queryName: "gas_station",
    selected: ref(false),
  },
  {
    displayName: "hotel",
    queryName: "hotel",
    selected: ref(false),
  },
  {
    displayName: "store",
    queryName: "store",
    selected: ref(false),
  },
  {
    displayName: "gym",
    queryName: "gym",
    selected: ref(false),
  },
]

const toggleTag = (tag) =>{
  tags.forEach((tag)=>{
    tag.selected.value = false;
  })
  tag.selected.value = true;
  clear();
  nearbySearch(tag.queryName);
};

const latLngObject = computed(() => mapStore.$state.latLng);
const userPosition = computed(() => mapStore.$state.currentUserLocation);
const query = defineModel();

onMounted(() => {
    console.log("Mounted");
    console.log(userPosition.value);
    initMap();
})

defineShortcuts({
  enter: {
    usingInput: 'queryInput',
    handler: () => {
      findPlaces();
    }
  }
})

async function handleComputeRoute(mode){

  console.log(mode);

  await mapStore.COMPUTE_ROUTE(mode.queryName);


  if(mapStore.parsedRoute(mode.queryName).length && mapStore.parsedRoute(mode.queryName)[0].availability){

    // is done now draw the markers
    console.log(mapStore.parsedRoute(mode.queryName)[0].route.coordinates);
  
    const coordinates = mapStore.parsedRoute(mode.queryName)[0].route.coordinates;
    console.log(coordinates);
  
    if(path) {
      path.setMap(null);
    }
    path = new google.maps.Polyline({
      path: coordinates,
      strokeColor: "#00FF00",
      strokeOpacity: 2.0,
      strokeWeight: 2,
    });
  
    path.setMap(map2);
  
    const bounds = new google.maps.LatLngBounds();
  
  
    coordinates.forEach((coor)=>{
      bounds.extend(coor);
    })
    const lat = mapStore.parsedTextSearchResponse.location.latitude;
    const lng = mapStore.parsedTextSearchResponse.location.longitude;
    bounds.extend({lat:lat, lng:lng});
    // extend current user location
    infoWindow.open(map2);
    bounds.extend({ lat: mapStore.$state.currentUserLocation.lat, lng: mapStore.$state.currentUserLocation.lng });
  
    map2.fitBounds(bounds);
  } else {
    alert("gak ada rutenya bang");
    
    if(path){
      path.setMap(null);
    }
  }
}

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

function clear() {

    if(path){
      path.setMap(null);
    }

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

async function nearbySearch(queryName) {

  await mapStore.NEARBY_SEARCH_PLACE(queryName);
  
  if (nearbySearchResult.value.length){
    console.log(mapStore.parsedNearbySearchResponse);

    const bounds = new google.maps.LatLngBounds();

    // Loop through and get all the results.
    mapStore.parsedNearbySearchResponse.forEach((place) => {
      console.log(place)
      markers.push(new google.maps.marker.AdvancedMarkerElement({
        map: map2,
        position: {lat: place.location.latitude, lng: place.location.longitude},
        title: place.displayName.text,
      }));

      bounds.extend({lat: place.location.latitude, lng: place.location.longitude});
    });

    // extend current user location
    infoWindow.open(map2);
    bounds.extend({ lat: mapStore.$state.currentUserLocation.lat, lng: mapStore.$state.currentUserLocation.lng });

    map2.fitBounds(bounds);

  } else {
    console.log("No results");
  }

}

// places query  example: tacos in texas
async function findPlaces() {

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  //@ts-ignore

  await mapStore.TEXT_SEARCH_PLACE(query.value);
  if (textSearchResponse.value) {

    const bounds = new google.maps.LatLngBounds();
    const lat = mapStore.parsedTextSearchResponse.location.latitude;
    const lng = mapStore.parsedTextSearchResponse.location.longitude;

    markers.push(new AdvancedMarkerElement({
        map: map2,
        position: {lat: lat, lng: lng},
        title: mapStore.parsedTextSearchResponse.displayName.text,
      }));
      
    responseBar.value = true;
    responseText.value = mapStore.parsedTextSearchResponse.displayName.text;
    response.value = mapStore.parsedTextSearchResponse;

    bounds.extend({lat:lat, lng:lng});
    map2.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}

// geocode can only take exact place name
async function geocode(request) {

  const requestedLat = request.location.lat();
  const requestedLng = request.location.lng();
  const previousLat = mapStore.parsedTextSearchResponse.location.latitude;
  const previousLng = mapStore.parsedTextSearchResponse.location.longitude;

  // Define a small threshold for comparison
  const threshold = 0.00005; // Roughly 5.5 meters in latitude/longitude
  // if user click within the area of 5.5 meters of the previous coordinate dont send request
  // this assumes user click the same place
  // * efficiency *
  if(Math.abs(previousLat - requestedLat) > threshold || Math.abs(previousLng - requestedLng) > threshold){
    clear();
    const result = await mapStore.REVERSE_GEOCODE(request.location);
    
    map2.setCenter(result.geometry.location);
    marker.position = result.geometry.location;
    marker.setMap(map2);

    mapStore.GET_PLACE_DETAILS(result.place_id);
    responseBar.value = true;
    responseText.value = mapStore.parsedTextSearchResponse.displayName.text;
    response.value = mapStore.parsedTextSearchResponse;
    // pan to marker
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(result.geometry.location);
    map2.fitBounds(bounds);
  }
}

</script>

  