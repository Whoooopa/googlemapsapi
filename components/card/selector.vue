<template>
    <div class="w-64 h-60 flex flex-col shadow-xl">
        <div class="h-48 bg-amber-500 rounded-t-md"></div>
        <div class="h-12 bg-purple-800 flex justify-center items-center rounded-b-md">
            <button 
                class="w-max px-4 bg-blue-400 rounded-full align-middle"
                @click="
                props.name === 'Map' ?
                router.push({ name: 'map' }) :
                props.name === 'Geoguessr' ?
                handleConfirmation():
                router.push('/')"
                >{{ props.name }}</button>
        </div>
    </div>
</template>

<script setup>
// route
const route = useRoute();
const router = useRouter();
const confirmation = computed(()=>mapStore.$state.confirmation);
const totalPoints =  computed(()=>mapStore.$state.totalPoints);
const mapStore = useMapStore();
const props = defineProps({
    name: {
        type: String,
    }
})
watch(confirmation,() => {
    console.log(confirmation.value);
})

function handleConfirmation(){

    if(totalPoints.value!=0){
        mapStore.$patch({
            confirmation: true,
        })
    }
    else{
    router.push({ name: 'play' });
    }
}
</script>

<style>

</style>