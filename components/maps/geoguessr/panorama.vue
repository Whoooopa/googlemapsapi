<template>
<div>
    <div id="map" class="map z-10 absolute w-screen h-screen bg-black"></div>
    <div id="pano" class="pano z-10 absolute w-screen h-screen bg-black"></div>
</div>
</template>
<script setup>
const mapStore = useMapStore();

const latLngObject = computed(() => mapStore.$state.latLng);

onMounted(() => {
    console.log(latLngObject.value.coord.lat);
    console.log(latLngObject.value.coord);
    initMap(mapStore.parsedLatLng);
    console.log("pano mounted");
})

watch(latLngObject, ()=>{
    initMap(mapStore.parsedLatLng);
})

function initMap(latLng){

    console.log(latLng.lat);
    const position = latLng;
    const map = new google.maps.Map(document.getElementById('map'), {
        // You configuration goes here
        center: position,
        zoom: 8,
        mapTypeId: 'roadmap',
        streetViewControl: false,
        mapTypeControl: false,
    });

    const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
        position: position,
        pov: {
        heading: 34,
        pitch: 10,
        },
        addressControl: false,
        imageDateControl: false,
        showRoadLabels: false,
    },
    );

    map.setStreetView(panorama);
}

</script>

      
