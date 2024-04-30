<template>
  <div>
    <NuxtLayout>
      <NuxtPage />  
    </NuxtLayout>
  </div>
</template>

<script setup>
import {loadedGoogleMapsAPI} from '@/main'
const mapStore = useMapStore();


onMounted(() => {
  loadedGoogleMapsAPI.then(()=>{

    mapStore.$patch({
    isPlaying: false,
    panorama: false,
    latLng: null,
    currentPoints: null,
    currentDistance: null,
    currentGuessedLatLng: {
      lat: null,
      lng: null
    },
  })
  })
  console.log(mapStore.$state.isPlaying);
})
</script>
