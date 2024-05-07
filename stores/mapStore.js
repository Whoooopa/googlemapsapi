import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from "@vueuse/core"
import axios from 'axios'


export const useMapStore = defineStore(
"mapStore",{
  state: () => {
    return { 
      map_base_url: useRuntimeConfig().public.MAPS_URL,
      latLng: {
        coord: useLocalStorage("latLng"),
        count: useLocalStorage("latLngCount", 1)
      },
      panorama: useLocalStorage("panorama", null),
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
      totalPoints: useLocalStorage("totalPoints", 0),
      progress: useLocalStorage("progress", 1),
      maxQuestion: 5,
      mapKitSize: 0,
      summary: useLocalStorage("summary", []),

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
  getters: {
      parsedLatLng(state){
        return JSON.parse(state.latLng.coord);
      },
      // getProgress(state){
      //   return state.progress ? state.progress: 1;
      // }
    }
    ,
  actions: {
    async HandleCallback(data, status){
      console.log(status);
          // console.log(`${data} data outside`);
        if (status == 'OK') {
          // console.log(data);
          // Call your code to display the panorama here.
          console.log(data.location);
          console.log(data.location.latLng.lat());
          const lat = data.location.latLng.lat();
          const lng = data.location.latLng.lng();
          const latLngObject = { lat: lat, lng: lng };
          this.latLng.coord = JSON.stringify(latLngObject);
          this.latLng.count = this.progress;
          console.log("progress vs count");
          console.log(this.latLng.count);
          console.log(this.progress)
          this.currentDistance = null;
          this.currentPoints = null;
          this.isPlaying = true;
          this.panorama = true;

    
        } else {
          // Nothing here! Let's try another location.
          await this.TryRandomLocation(this.HandleCallback);
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

        if (this.latLng.count == 1 || this.latLng.count != this.progress){
          await this.TryRandomLocation(this.HandleCallback);
        }
      } catch (error) {
        console.error(error);
      }
    },

    async UPDATE_PROGRESS() {

      this.progress = this.progress <= this.maxQuestion ? this.progress + 1 : 1 ;

      console.log(this.progress);
    },

    async UPDATE_SUMMARY() {

      this.summary.push({
        lat: this.parsedLatLng.lat,
        lng: this.parsedLatLng.lng,
        guessedLat: this.currentGuessedLatLng.lat,
        guessedLng: this.currentGuessedLatLng.lng,
      })

      console.log(this.summary)

      console.log(this.totalPoints);
      this.totalPoints = this.totalPoints + this.currentPoints;
      console.log(this.totalPoints);

    }

  },

  hydrate(state, initialState) {
    // in this case we can completely ignore the initial state since we
    // want to read the value from the browser
    
    state.totalPoints = useLocalStorage("totalPoints", 0);
    state.latLng.coord = useLocalStorage("latLng", {lat: null, lng: null}).value;
    state.progress = useLocalStorage("progress", 1);
    state.latLng.count = useLocalStorage("latLngCount", 1);
    state.panorama = useLocalStorage("panorama", null);
    state.summary = useLocalStorage("summary", []);
  
  },
},
);

