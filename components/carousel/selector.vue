<template>
    <v3c-carousel class="w-[40rem] h-96 bg-[rgba(0,0,0,0.6)] pt-12" :items-to-show="2.35" :wrap-around="true"
    :transition="500"
    @slide-end="handleSlideEnd">
    <template #slides>

      <v3c-slide 
      v-for="menu in menus" :key="menu.name">
        <CardSelector
        :name="menu.name"
        :img="menu.img"
        />
      </v3c-slide>
    </template>
  
      <template #addons>
        <v3c-navigation />
      </template>
    </v3c-carousel>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css'
const emit = defineEmits(['change-background']);
const active = ref("Map");


// function handleSlideEnd(data) {
// https://ismail9k.github.io/vue3-carousel/api/events.html
//   console.log('slide-start', data.slidingToIndex);
//   emit('change-background', menus[data.slidingToIndex-1].bgimg);
//   emit('change-background', data.currentSlideIndex);
//   console.log(data.currentSlideIndex);
//   active.value = menus[data.currentSlideIndex].name;
//   emit('change-background', menus[data.currentSlideIndex].bgimg, active.value);
// }

function handleSlideEnd(data) {
  // https://ismail9k.github.io/vue3-carousel/api/events.html
  // console.log('slide-start', data.slidingToIndex); rusak indexnya kacau kalau back terus
  active.value = menus[data.currentSlideIndex].name;
  emit('change-background', menus[data.currentSlideIndex].bgimg, active.value);
}


const menus = [
  {
  "idx": 1,
  "name": "Map",
  "bgimg": "earth-from-space-2.jpg",
  "img": "map.jpeg",
  },
  {
  "idx": 2,
  "name": "Geoguessr",
  "bgimg": "earth-from-space.jpg",
  "img": "earth.jpeg",
  },
  {
  "idx": 3,
  "name": "???",
  "bgimg": "earth-with-aurora.jpg",
  "img": "map.jpeg",
  },
  
  
]
</script>

<style scoped>
.carousel__slide {
  
  padding: 5px;
}

.carousel__viewport {
  perspective: 2000px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.9);
}

.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.9);
}

.carousel__slide--prev {
  opacity: 0.7;
  transform: rotateY(0deg) scale(0.85);
  pointer-events: none;
}

.carousel__slide--next {
  opacity: 0.7;
  transform: rotateY(-180deg) scale(0.85);
  pointer-events: none;
}

.carousel__slide--active {
  opacity: 1;
  transform: rotateY(-180deg) scale(-1,1);
}

.carousel__pagination-button {

  color: white;
}

</style>