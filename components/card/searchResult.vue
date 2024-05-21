<template>
  <div
    class="absolute left-0 top-24 bg-white w-64 h-[calc(100vh-8rem)] overflow-y-auto z-20 text-black flex flex-col"
    v-if="loading">
      <USkeleton class="w-full h-32" />
      <div class="w-full flex flex-col px-4 py-2 gap-3">
        <div class="flex flex-row">
          <USkeleton class="w-5/6 text-lg font-bold ">
            {{ responseText }}
          </USkeleton>
          <USkeleton class="flex justify-end px-2 py-1">
            {{ rating }}
          </USkeleton>
        </div>
        <USkeleton class="text-sm font-medium">
          {{ formattedAddress }}
        </USkeleton>
      </div>
  </div>


  <div
    class="absolute left-0 top-24 bg-white w-64 h-[calc(100vh-8rem)] overflow-y-auto z-20 text-black flex flex-col" 
    v-else>
      <div class="w-full h-32" 
        :style="{ backgroundImage: `url('${photoUri}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'}" 
        v-if="photoUri" />
      <div class="w-full flex flex-col px-4 py-2 gap-3">
        <div class="flex flex-row">
          <div class="w-5/6 text-lg font-bold ">
            {{ responseText }}
          </div>
          <div class="flex justify-end px-2 py-1">
            {{ rating }}
          </div>
        </div>
        <div class="text-sm font-medium">
          {{ formattedAddress }}
        </div>
        <a class="rounded-md bg-green-500 text-white font-medium py-1 flex justify-center cursor-pointer"
        :href="mapStore.linkToMap"
        target="_blank"
        >
          Open in google maps
        </a>
        <button class="rounded-md bg-green-500 text-white font-medium py-1 flex justify-center cursor-pointer"
        @click="$emit('computeRoute')"
        v-if="userLocation.lat">
          See route
        </button>
      </div>
  </div>
</template>

<script setup>
const mapStore = useMapStore();
const responseText = computed(()=> mapStore.$state.textSearchResponse.displayName.text);
const rating = computed(()=> mapStore.$state.textSearchResponse.rating);
const formattedAddress = computed(()=> mapStore.$state.textSearchResponse.formattedAddress);
const loading = computed(()=> mapStore.$state.responseLoading);
const userLocation = computed(()=> mapStore.$state.currentUserLocation);

const props = defineProps({
  photoUri: String,
})

</script>

<style>

</style>