<template>
    <div>
        <MapsGeoguessrMap 
        :isPlaying="false"
        />
        <div class="z-30 absolute bottom-0 w-screen bg-purple-600 h-32 flex justify-center items-center shadow-inner text-white font-extrabold flex-col">
            <div class="text-lg">
                You got {{ parseFloat(points).toFixed(2) }} pts         
            </div>
            <div class="text-sm">
                {{ parseFloat(distance).toFixed(2) }} km away
            </div>
            <button class="rounded-md bg-purple-300 px-4 py-1 shadow-md mt-3"
            @click="
                progress > maxQuestions
            ? $router.push({ name: 'gameover' })
            : $router.push({ name: 'play' })
        
            "
            >{{
                progress > maxQuestions ? "Finish" : "Next"
            }}</button>
        </div>
    </div>
</template>
<script setup>
const mapStore = useMapStore();
const router = useRouter();
const progress = computed(() => mapStore.$state.progress);
const maxQuestions = computed(() => mapStore.$state.maxQuestion);
const latLng = computed(() => mapStore.$state.latLng);
const guessedLatLng = computed(() => mapStore.$state.currentGuessedLatLng);

onMounted(() => {
    mapStore.$patch({
    isPlaying: false,
    panorama: false,
    progress: mapStore.$state.progress + 1,
  })
  console.log(mapStore.$state.isPlaying);
})

onUnmounted(() => {
    console.log("object")
    // console.log(latLng.value.lat())
    // console.log(latLng.value.lng())
    console.log(latLng.value.lat())
    console.log(latLng.value.lng())
    const lat = latLng.value.lat();
    const lng = latLng.value.lng();
    mapStore.$state.summary.push({
        lat: lat,
        lng: lng,
        guessedLat: guessedLatLng.value.lat,
        guessedLng: guessedLatLng.value.lng,
    })
    mapStore.$patch({
        latLng: null,
        totalPoints: mapStore.$state.totalPoints + mapStore.$state.currentPoints,
    })
    
})


const points = computed(() => mapStore.$state.currentPoints);
const distance = computed(() => mapStore.$state.currentDistance);
</script>