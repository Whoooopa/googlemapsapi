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
import { useLocalStorage } from "@vueuse/core"
const mapStore = useMapStore();
const progress = computed(() => mapStore.$state.progress);
const maxQuestions = computed(() => mapStore.$state.maxQuestion);

onMounted(() => {
    mapStore.$patch({
    isPlaying: false,
    panorama: null,
  });
  mapStore.UPDATE_PROGRESS();
  console.log(mapStore.$state.isPlaying);
})

onBeforeUnmount(() => {
    console.log("object")
    mapStore.UPDATE_SUMMARY();
    localStorage.removeItem("latLng");
    
})


const points = computed(() => mapStore.$state.currentPoints);
const distance = computed(() => mapStore.$state.currentDistance);
</script>