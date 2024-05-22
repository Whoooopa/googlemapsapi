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

        <UDivider label="Travel" 
        :ui="{ label: 'text-primary-500 dark:text-primary-400' }"/>
        <!-- tab header -->
        <v-tabs :center-active="true" :align-tabs="'center'" :grow="true" v-model="tab">
          <v-tab v-for="mode in transportMode" :value="`${mode.title}`" :size="'small'" :slim="true" @click="$emit('computeRoute', mode)"> 
            <div class="text-sm">
              {{ mode.title }}
            </div>
          </v-tab>
  
        </v-tabs>
        <!-- tab item -->
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item v-for="mode in transportMode" :value="`${mode.title}`">
              <div
              v-if="mapStore.parsedRoute(mode.queryName).length">
                <div class="flex flex-col gap-4 px-3"
                v-if="mapStore.parsedRoute(mode.queryName)[0].availability">
                  <div class="flex justify-between">

                    <span class="text-sm font-medium">
                      Distance :
                    </span>

                    <span class="text-sm font-medium">
                      {{ mapStore.parsedRoute(mode.queryName)[0].route.distanceMeters > 1000 ? 
                      mapStore.parsedRoute(mode.queryName)[0].route.distanceMeters / 1000 + " km" : 
                      mapStore.parsedRoute(mode.queryName)[0].route.distanceMeters + " m" }}
                    </span>
                  </div>

                  
                  <div class="flex justify-between">

                    <span class="text-sm font-medium">
                      Duration :
                    </span>

                    <span class="text-sm font-medium">{{ secondsToHHmmss(mapStore.parsedRoute(mode.queryName)[0].route.duration.slice(0, -1)) }}</span>
                  </div>
                </div>
                <div
                v-else>
                  tidak ditemukan rute dengan transportasi ini
                </div>
              </div>
              <div
              v-else> 
                <USkeleton class="h-4 w-full"/>
                <USkeleton class="h-4 w-full"/>
              </div>
              <!-- <div class="flex flex-col justify-start gap-4 px-4"
              v-if=" mapStore.parsedRoute(mode.queryName)[0].availability ">
                <span>{{ mapStore.parsedRoute(mode.queryName).route.distanceMeters }}</span>
                <span>{{ mapStore.parsedRoute(mode.queryName)[0].route.duration}}</span>
              </div>
              <div class="flex flex-col justify-start gap-4 px-4"
              v-else>
                <span>No route found for this type of transportation</span>
              </div> -->
              <!-- <div class="flex flex-col justify-start gap-4 px-4"
              v-if="available(mode.queryName)">
                <span>{{ mapStore.parsedRoute(mode.queryName)[0].availability}}</span>
              </div> -->
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>

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
const route = computed(()=> mapStore.$state.routes);

const tab = defineModel();

const emits = defineEmits(['computeRoute']);


const props = defineProps({
  photoUri: String,
})

// in string
const secondsToHHmmss = (seconds) => {
  return (new Date(parseInt(seconds) * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

const transportMode = [
  {
    title: "Car",
    queryName: "DRIVE",
  },
  {
    title: "Bycicle",
    queryName: "BICYCLE",
  },
  {
    title: "Walk",
    queryName: "WALK",
  },
  {
    title: "Motorcycle",
    queryName: "TWO_WHEELER",
  },
  {
    title: "Public",
    queryName: "TRANSIT",
  }
]

</script>

<style>

</style>