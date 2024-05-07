<template>
    <div>
      <PageGameover />
    </div>
</template>
  
<script setup>
const mapStore = useMapStore();
onMounted(() => {
    mapStore.$patch({
        isSummary: true,
    })
})

onUnmounted(() => {
    mapStore.$patch({
        totalPoints: 0,
        progress: 1,
        summary: [],
        isSummary: false,
        latLng: {
            count: 1,
        }
    });
})
</script>

<style>

</style>