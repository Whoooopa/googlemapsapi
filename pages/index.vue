<template>
  <Transition name="fade">
    <div 
      class="h-screen w-screen absolute z-0"
      :key="currentIdx"
      :style="{ backgroundImage: 'url(' +getImage(image) + ') ',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%'}"
    ></div>
  </Transition>
    
    <UtilityNewGamePopup 
    v-if="confirmation"
    @confirmation="handleGeoguessr"/>
    <div 
      class="h-screen w-screen flex justify-center items-center">
      <CarouselSelector 
      @change-background="handleBackground"/>
    </div>
</template>

<script setup>
const image = ref("earth-from-space-2.jpg");
const currentIdx = ref("Map");
const router = useRouter();
const mapStore = useMapStore();
const confirmation = computed(()=>mapStore.$state.confirmation);
function handleBackground(data, name){
  console.log(data, name);
  image.value = data;
  currentIdx.value = name;
}


function handleGeoguessr(action){
    
    if(action=="New Game"){
        console.log("aaa");
        mapStore.$patch({
            totalPoints: 0,
            progress: 1,
            summary: [],
            isSummary: false,
            pause: false,
            panorama: false,
            latLng: {
              coord: null,
              count: null
            }
        });
    }
    
    mapStore.$patch({
        confirmation: false,
    })
    router.push({ name: 'play' });

}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>