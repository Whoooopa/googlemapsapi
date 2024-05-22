import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from "@vueuse/core"
import { mapInstance, placeInstance } from '~/composables/maps';
import axios from 'axios'


export const useMapStore = defineStore(
"mapStore",{
  state: () => {
    return { 
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
      },

      // Map menu
      textSearchResponse: null,
      photoURI: null,
      responseLoading: false,
      nearbySearchResult: [],
      routeEncoder: null,
      routes: [],
      routeCoordinates: [],

    };},
  getters: {

      parsedTextSearchResponse(state){
        return toRaw(state.textSearchResponse);
      },
      parsedLatLng(state){
        return JSON.parse(state.latLng.coord);
      },
      parsedNearbySearchResponse(state){
        return toRaw(state.nearbySearchResult);
      },
      parsedRoute(state){
        const routes = toRaw(state.routes);
        // getters cant receive params -_- but can return function that is able to receive param
        function checkMode(mode){
          if(mode == "all") return routes;
          else{
            return routes.filter((route)=>{
              return route.mode == mode;
            });
          }
        }
        return checkMode;
      },
      rawEncoder(state){
        return toRaw(state.routeEncoder);
      },
      parsedRouteCoordinates(state){
        return toRaw(state.routeCoordinates);
      },
      linkToMap(state){
        return `https://www.google.com/maps/search/?api=1&query=${this.parsedTextSearchResponse.location.latitude}%2C${this.parsedTextSearchResponse.location.longitude}&query_place_id=${this.parsedTextSearchResponse.id}`; // no api key required for this one
      }
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

    },

    async TEXT_SEARCH_PLACE(query) {

      try {
        this.responseLoading = true;
        const response = await placeInstance.post(':searchText',
          {
            textQuery: query,
            pageSize: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.photos,places.rating,places.reviews,places.location'
            }
          }
        );

        this.textSearchResponse = response.data.places[0];
        console.log(toRaw(this.textSearchResponse));
        this.GET_IMAGE_FROM_PLACE();
      }
      catch (error) {
        console.log(error);
      }
    },

    async NEARBY_SEARCH_PLACE(type) {
      try{
        const response = await placeInstance.post(':searchNearby',{
          locationRestriction: {
            circle: {
              center: {
                latitude: this.currentUserLocation.lat,
                longitude: this.currentUserLocation.lng,
              },
              radius: 1000
            } 
          },
          includedPrimaryTypes: [type],
          maxResultCount: 5,
          languageCode: "en-US",
          rankPreference: 'DISTANCE'
        }, {
          headers: {
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.businessStatus'
          }
        })
        console.log(response);
        this.nearbySearchResult = response.data.places;
        console.log(this.nearbySearchResult);
      }
      catch(e){
        console.log(e);
      }
    },

    async GET_IMAGE_FROM_PLACE() {

      try{
        //photos.name format is places/place_id/photos/photo_id
        // append '/media' to access the photo
        const photoName = this.parsedTextSearchResponse.photos[0].name;
        const trimmedName = photoName.replace("places", "") + "/media";
        console.log(trimmedName);
        // base url ends with places, photos name starts with places/

        const response = await placeInstanceWithoutXGoog.get(trimmedName, {
          params: {
            skipHttpRedirect: true, //return json instead of image
            maxHeightPx: 400,
            maxWidthPx: 400,
          }
        })
        this.photoURI = response.data.photoUri;
        console.log(this.photoURI);
      }
      catch(error){
        this.photoURI = null;
        console.log(error);
      }
      finally{
        this.responseLoading = false;
      }
    
    },

    async GET_PLACE_DETAILS(placeId) {
      try{
        this.responseLoading = true;
        const response = await placeInstance.get("/"+placeId,{
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': 'id,displayName,formattedAddress,photos,rating,reviews,location'
          }
        });
        console.log(response.data);
        this.textSearchResponse = response.data;
        this.GET_IMAGE_FROM_PLACE();
      }
      catch (e){
        console.log(e);
      }
    },

    // latitude , longitude -> place id
    async REVERSE_GEOCODE(latLng) {
      try{
        console.log(`${latLng.lat().toFixed(5) }, ${latLng.lng().toFixed(5)}`);
        console.log(`${this.parsedTextSearchResponse.location.latitude.toFixed(5)}, ${this.parsedTextSearchResponse.location.longitude.toFixed(5)}`);
        const lat = latLng.lat();
        const lng = latLng.lng();

        console.log(`${lng}`)
        const response = await mapInstance.get("geocode/json",{
          params: {
            latlng: `${lat},${lng}`
          }
        })
        console.log(response.data);
        console.log(response.data.results);
        const result = response.data.results[0];
        console.log(result);
        return result;
        
      }
      catch(e){
        console.log(e);
      }
    },

    async COMPUTE_ROUTE(mode){

      
      console.log(this.parsedTextSearchResponse); 
      const { photos, rating, reviews, ...placeInfos } = this.parsedTextSearchResponse;
      // placeInfos have id, displayName: {text, languageCode}, formattedAddress, location: {latitude,longitude}
      try{
        console.log(mode);
        // if no encoder import encoder
        if(!this.routeEncoder) {
          try{
            const {encoding} = await google.maps.importLibrary("geometry");
            console.log(encoding);
            this.routeEncoder = encoding;

          }
          catch(e){
            console.log(e);
          }
        }
        console.log(this.rawEncoder);

        console.log(this.parsedRoute(mode));
        console.log(this.parsedRoute(mode)[0]);

        // if previously saved routes destination differ from current textSearchResponse (if user changes destination)
        if(this.parsedRoute(mode).length != 0 && this.parsedRoute(mode)[0].destination.id != this.parsedTextSearchResponse.id){
          this.routes = [];
        }

        // if state.routes array doesn't have object with object.mode == mode request route
        if(this.parsedRoute(mode).length == 0) {
          const response = await routeInstance.post("directions/v2:computeRoutes",
            {
              origin: {
                location: {
                  latLng: {
                    latitude: this.$state.currentUserLocation.lat,
                    longitude: this.$state.currentUserLocation.lng
                  }
                }
              },
              destination: {
                location: {
                  latLng: {
                    latitude: this.parsedTextSearchResponse.location.latitude,
                    longitude: this.parsedTextSearchResponse.location.longitude
                  }
                }
              },
              travelMode: `${mode}`,
              routingPreference: "TRAFFIC_AWARE",
              computeAlternativeRoutes: false,
              routeModifiers: {
                avoidTolls: false,
                avoidHighways: false,
                avoidFerries: false
              }
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline' //https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes#response-body
              }
            }
          );
          console.log(response);

          const route = response.data.routes[0];
          const coordinates = this.rawEncoder.decodePath(route.polyline.encodedPolyline);

          console.log(coordinates);
          console.log(route);
          


          

          this.routes.push({
            mode: mode,
            route: {
              ...route,  // route object in routes array have distanceMeters, duration , polyline.encodedPolyline if request was successful
              coordinates: coordinates, // array of latLng object , has lat(), lng() function
            },
            availability: true,
            destination: {
              ...placeInfos
            }
          });
          console.log("New request T_T");

         
          
          // const coordinates = this.rawEncoder.decodePath(this.parsedRoute.polyline.encodedPolyline);
          // console.log(this.parsedRoute);
          // console.log(coordinates);
          // this.routeCoordinates = coordinates;
          // console.log(this.routeCoordinates);
        } else {
          console.log("No API call *_*");
        }
        // console.log(this.parsedTextSearchResponse.location.latitude);
        // console.log(this.parsedTextSearchResponse.location.longitude);
        // console.log(this.$state.currentUserLocation.lat);
        // console.log(this.$state.currentUserLocation.lng);
        console.log(this.parsedRoute("all"));
        
        
      }
      catch(e){
        // console.log(e);
        // console.log(e.response.data.error.message);
        // if no error message is no route available, push object with false availability
        const msg = e.response.data.error.message;
        if(msg.startsWith("Routing preference cannot be set for")){
          
          if(this.parsedRoute(mode).length == 0){
            this.routes.push({
              mode: mode,
              route: null,
              availability: false,
              destination: {
                ...placeInfos
              }
            });
          }
        }
        console.log(this.parsedRoute("all"));
      }
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


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMapStore, import.meta.hot));
}