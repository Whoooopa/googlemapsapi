<template>
    <div class="w-32 absolute h-8 top-2 left-2 bg-red-500 flex justify-center items-center shadow-lg cursor-pointer text-white z-50"
        @click="exit">Exit</div>
    <div class="w-64 absolute h-12 top-2 right-0 bg-purple-600 text-white font-extrabold px-4 z-50">
        <div class="flex justify-between items-center pt-1">
            <div class="text-md">
                {{ progress + " / " + maxQuestions }}
            </div>
            <div class="flex flex-col flex-end">
                <div class="text-sm">Total Points</div>
                <div class="text-sm flex justify-center">{{ parseFloat(totalPoints).toFixed(2) }}</div>
            </div>

        </div>
    </div>
    <div class="w-[16.25rem] absolute h-12 top-3 right-0 bg-purple-950 z-40">

    </div>
</template>

<script setup>
const mapStore = useMapStore();
const progress = computed(()=>mapStore.$state.progress);
const maxQuestions = computed(()=>mapStore.$state.maxQuestion);
const totalPoints = computed(()=>mapStore.$state.totalPoints);
const router = useRouter();

onMounted(() => {
    console.log(progress);
    console.log("Progress is above");
})

function exit(){
    mapStore.$patch({
        pause: true,
    })
    router.push('/');
}
</script>