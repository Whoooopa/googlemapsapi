import { defineStore } from 'pinia'
import axios from 'axios'


export const useMapStore = defineStore(
"mapStore",{
  state: () => {
    return { 
      map_base_url: useRuntimeConfig().public.MAPS_URL,
      latLng: null,
      panorama: null,
      currentPoints: null,
      currentDistance: null,
      isPlaying: false,
      isSummary: false,
      pause: false,
      confirmation: false,
      currentGuessedLatLng: {
        lat: null,
        lng: null
      },
      currentUserLocation: {
        lat: null,
        lng: null
      },
      totalPoints: 0,
      progress: 1,
      maxQuestion: 5,
      mapKitSize: 0,
      summary: [],

      jawa: {
        latTop: -6.2,
        latBottom: -7.5,
        latSum: -1.3,
        ltdLeft: 105,
        ltdRight: 112,
        ltdDiff: 7,
      },

      defaultView: {
        lat: -6.2,
        ltd: 106.816666,
      }
      

    };},
  actions: {
    HandleCallback(data, status){
      console.log(status);
          // console.log(`${data} data outside`);
        if (status == 'OK') {
          // console.log(data);
          // Call your code to display the panorama here.
          // console.log(data.location.latLng);
          this.latLng = data.location.latLng;
          console.log(this.latLng);
    
        } else {
          // Nothing here! Let's try another location.
          this.TryRandomLocation(this.HandleCallback);
        }
    },

    async TryRandomLocation(callback){
      var lat = Math.random() * this.jawa.latSum + this.jawa.latTop;
      var lng = Math.random() * this.jawa.ltdDiff + this.jawa.ltdLeft;
      var sv = new google.maps.StreetViewService();
    
      // Try to find a panorama within 50 metres 
      sv.getPanorama({
          location: new google.maps.LatLng(lat, lng),
          radius: 50
      }, callback);
    },

    async GET_RANDOM_PANORAMA() {
      try{
      
        this.TryRandomLocation(this.HandleCallback);
      } catch (error) {
        console.error(error);
      }
    }
  },
});
