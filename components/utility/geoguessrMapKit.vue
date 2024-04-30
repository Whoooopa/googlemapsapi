<template>
<div class="absolute flex flex-col bottom-0 right-1 z-30 pb-2 gap-1"
    :class="size()">
    <div class="flex flex-row gap-2 pt-1 pl-1">
        <button class="bg-[rgba(0,0,0,0.8)]"
        @click="enlarge">
            <img src="/assets/arrow-top-left-svgrepo-com.svg">
        </button>
        <button class="bg-[rgba(0,0,0,0.8)]"
        @click="shrink">
            <img src="/assets/arrow-bottom-right-svgrepo-com.svg">
        </button>
    </div>
    <MapsGeoguessrMap
      :isPlaying="true"
      @guess="handleGuess"
    />
    <div class="z-30 w-full h-12 flex justify-center absolute bottom-0 items-center shadow-inner">
        <button class="rounded-md w-full bg-purple-500 px-4 py-1 shadow-md text-white text-bold"
          @click="router.push({ name: 'result' })"
        >Guess !</button>
      </div>
</div>

</template>
<script setup>
const router = useRouter();
const mapStore = useMapStore();
const mapKitSize = computed(()=>mapStore.$state.mapKitSize);
const latLng = computed(() => mapStore.$state.latLng);
const panorama = computed(() => mapStore.$state.panorama);
let distance;

function enlarge(){
    if(mapKitSize.value < 3)
    mapStore.$patch({
        mapKitSize: mapStore.$state.mapKitSize + 1,
    });
}

function shrink(){
    if(mapKitSize.value > 0)
    mapStore.$patch({
        mapKitSize: mapStore.$state.mapKitSize - 1,
    });
}

function size(){
    switch (mapKitSize.value) {
        case 0:
            return "w-64 h-[21rem]";
            break;
        case 1:
            return "w-80 h-[22rem]";
            break;
        case 2:
            return "w-[24rem] h-[24rem]";
            break;
        case 3:
            return "w-[28rem] h-[26rem]";
            break;
        default:
            return "w-64 h-[21rem]";
            break;
    }
}


function handleGuess(guessedLatLng){
    // console.log(`You guessed${guessedLatLng.lat()} and ${guessedLatLng.lng()}`);
    // console.log(`The true coordinate is ${mapStore.$state.defaultView.lat} and ${mapStore.$state.defaultView.ltd}`);

    //pure distance
    // distance = Math.hypot(Math.abs(guessedLatLng.lat()-mapStore.$state.defaultView.lat), 
    //             Math.abs(guessedLatLng.lng()-mapStore.$state.defaultView.ltd));

    //distance in km
    const latDiff = Math.abs(guessedLatLng.lat()-mapStore.$state.latLng.lat()) * 111;
    const lngDiff = Math.abs(guessedLatLng.lng()-mapStore.$state.latLng.lng()) * 111;

    distance = Math.hypot(latDiff, lngDiff);
    
    console.log(`${distance} km away`);


    //tolerance of 1km, penalty of 10 pts for every 1km after
    const truePoints = 5000 - (1*(distance>= 1 ? distance-1: 0) * 10);
    const points = truePoints <= 0 ? 0 : truePoints;

    mapStore.$patch({
      currentDistance: distance,
      currentPoints: points,
    })

    console.log(`You obtained ${points}`);
}

</script>