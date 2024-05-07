<template>
  <div>
    <div v-if="panorama && latLng.coord">
      <UtilityCustomHeader />
      <MapsGeoguessrPanorama/>
      <UtilityGeoguessrMapKit />
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>
<script setup>
import {loadedGoogleMapsAPI} from '@/main'
const route = useRoute();
const router = useRouter();
const mapStore = useMapStore();
const latLng = computed(() => mapStore.$state.latLng);
const panorama = computed(() => mapStore.$state.panorama);
let distance;

watch(latLng, ()=>{})

onMounted(() => {
  console.log(`${panorama.value} before get rand pano`);

  if(mapStore.$state.pause){
    
    mapStore.$patch({
      pause: false,
    })
  }else{

    mapStore.GET_RANDOM_PANORAMA();

  }
  
});

//A degree of latitude, one degree north or south, is about the same distance anywhere, about 69 miles (111 kilometers). But a degree of longitude, one degree east or west, is a different distance at different points on the globe. At the equator, a degree of longitude is the same as a degree of latitude, about 69 miles (111 km). But it decreases as you move closer to the north or south pole.
// window.onload = function() {
//   TryRandomPanorama(HandleCallback);
// }
</script>