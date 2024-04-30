<template>
    <div>
        <MapsGeoguessrMap 
        :isSummary="true"
        />
        <div class="z-30 absolute bottom-0 w-screen bg-purple-600 h-32 flex justify-center items-center shadow-inner text-white font-extrabold flex-col">
            <div class="mt-2 text-2xl font-extrabold">
                Total Points
            </div>
            <div class="text-md font-bold">
                {{  parseFloat(totalPoints).toFixed(2) }}
            </div>
            <button class="mt-2 rounded-md bg-purple-300 px-4 py-1 shadow-md"
            @click="$router.push('/')">
            Finish
            </button>
        </div>
    </div>
</template>

<script setup>
const mapStore = useMapStore();
const totalPoints = mapStore.$state.totalPoints;
const router = useRouter();

</script>