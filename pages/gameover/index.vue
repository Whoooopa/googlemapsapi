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
        progress: 0,
        summary: [],
        isSummary: false,
    });
})
</script>

<style>

</style>