<template>
<div>
    <div id="map1" class="map1 z-20 bg-slate-600"
    :class="size(isPlaying)"></div>
</div>
</template>
<script setup>
const mapStore = useMapStore();
const emit = defineEmits(['guess']);
const mapKitSize = computed(()=>mapStore.$state.mapKitSize);
const summary = computed(() => mapStore.$state.summary);
let map1;

const props = defineProps({
    isPlaying: {
        type: Boolean,
    },
    isSummary: {
        type: Boolean,
    },
})

function size(){
    if (props.isPlaying){
        switch (mapKitSize.value) {
        case 0:
            return "w-64 h-64 absolute bottom-[calc(3rem)] right-0";
            break;
        case 1:
            return "w-[20rem] h-[17rem] absolute bottom-[calc(3rem)] right-0";
            break;
        case 2:
            return "w-[24rem] h-[19rem] absolute bottom-[calc(3rem)] right-0";
            break;
        case 3:
            return "w-[28rem] h-[21rem] absolute bottom-[calc(3rem)] right-0";
            break;
        default:
            return "w-64 h-64 absolute bottom-[calc(3rem)] right-0";
            break;
    }
    } else {
        return "w-screen h-[calc(100vh-8rem)] top-0"
    }
}

const latLngObject = computed(() => mapStore.$state.latLng);

onMounted(() => {
    // console.log("Mounted");
    // console.log(currentlyPlaying.value);
    initMap();
})


// watch(isPlaying, ()=>{
//     if(!isPlaying){
//         console.log("is playing changed");
//         trueMarker = new google.maps.marker.AdvancedMarkerElement({
//         map: map1,
//         position: { lat : mapStore.parsedLatLng.lat, lng : mapStore.parsedLatLng.lng }
//     })
//     }
// });

function initMap(){
    map1 = new google.maps.Map(document.getElementById('map1'), {
        // You configuration goes here
        center: { lat : mapStore.$state.defaultView.lat, lng : mapStore.$state.defaultView.ltd },
        zoom: 8,
        mapId: "DEMO_MAP_ID", //(prerequisite for placing marker) in production mapId should be configured https://developers.google.com/maps/documentation/javascript/advanced-markers/start
        mapTypeId: 'roadmap',
        streetViewControl: false,
        mapTypeControl: false,
        clickableIcons: false,
    });

    // for dashed line
    const lineSymbol = {
            path: "M 0,-1 0,1",
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            scale: 4,
        };


    if(props.isSummary){
        console.log("yes");

        const markers = [];

        // mapStore.$state.summary.push({
        //     lat: latLng.value.lat(),
        //     lng: latLng.value.lng(),
        //     guessedLat: guessedLatLng.value.lat,
        //     guessedLng: guessedLatLng.value.lng,
        // })
        console.log(summary.value.length);

        for (i=0; i < summary.value.length; i++)
        {
            const pathBetweenMarkersCoordinates = [
            { lat: summary.value[i].lat, lng: summary.value[i].lng },
            { lat: summary.value[i].guessedLat, lng: summary.value[i].guessedLng }
            ];

            console.log(`${summary.value[i].lat} ${summary.value[i].lng} ${summary.value[i].guessedLat} ${summary.value[i].guessedLng} ${i}`)

            const truePinStyle = new google.maps.marker.PinElement({
                background: "#22D3EE",
                borderColor: "#0E7490",
                glyphColor: "#0E7490"
            });


            markers.push(new google.maps.marker.AdvancedMarkerElement({
                map: map1,
                position: { lat : summary.value[i].lat, lng : summary.value[i].lng },
                content: truePinStyle.element,
            }));

            markers.push(new google.maps.marker.AdvancedMarkerElement({
                map: map1,
                position: { lat : summary.value[i].guessedLat, lng : summary.value[i].guessedLng }
            }));

            const pathBetweenMarkers = new google.maps.Polyline({
                map: map1,
                path: pathBetweenMarkersCoordinates,
                strokeOpacity: 0,
                icons: [
                    {
                        icon: lineSymbol,
                        offset: "0",
                        repeat: "20px",
                    },
                ],
            })
        }

        // zoom out to show all markers
        const bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].position);
        }

        map1.fitBounds(bounds);
       
    }

    else if(props.isPlaying==false){

        console.log(mapStore.parsedLatLng);

        const pathBetweenMarkersCoordinates = [
            { lat: mapStore.parsedLatLng.lat, lng: mapStore.parsedLatLng.lng },
            { lat: mapStore.$state.currentGuessedLatLng.lat, lng: mapStore.$state.currentGuessedLatLng.lng }
        ];


        const markers = [];
        

        const truePinStyle = new google.maps.marker.PinElement({
            background: "#22D3EE",
            borderColor: "#0E7490",
            glyphColor: "#0E7490"
        });


        markers.push(new google.maps.marker.AdvancedMarkerElement({
            map: map1,
            position: { lat : mapStore.parsedLatLng.lat, lng : mapStore.parsedLatLng.lng },
            content: truePinStyle.element,
        }));

        markers.push(new google.maps.marker.AdvancedMarkerElement({
            map: map1,
            position: { lat : mapStore.$state.currentGuessedLatLng.lat, lng : mapStore.$state.currentGuessedLatLng.lng }
        }));

        
        const pathBetweenMarkers = new google.maps.Polyline({
            map: map1,
            path: pathBetweenMarkersCoordinates,
            strokeOpacity: 0,
            icons: [
                {
                    icon: lineSymbol,
                    offset: "0",
                    repeat: "20px",
                },
            ],
        })

        // const trueMarker = new google.maps.marker.AdvancedMarkerElement({
        //     map: map1,
        //     position: { lat : mapStore.parsedLatLng.lat, lng : mapStore.parsedLatLng.lng },
        //     content: truePinStyle.element,
        // });

        // const guessedMarker = new google.maps.marker.AdvancedMarkerElement({
        //     map: map1,
        //     position: { lat : mapStore.$state.currentGuessedLatLng.lat, lng : mapStore.$state.currentGuessedLatLng.lng }
        // });

        // zoom out to show all markers
        const bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].position);
        }

        map1.fitBounds(bounds);

    } else {
    
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map1,
        })
    
        map1.addListener("click", (event)=>{
            console.log(event);
            console.log(event.latLng);
            marker.position = event.latLng;
            mapStore.$state.currentGuessedLatLng.lat = event.latLng.lat();
            mapStore.$state.currentGuessedLatLng.lng = event.latLng.lng();
            // console.log(event.latLng.lat());
            // guessedCoord = event.latLng;
            emit('guess', event.latLng);
        });
    }
}

// const guess = ()=>{
//     this.$emit('guesss', guessedCoord);
// }

</script>

  