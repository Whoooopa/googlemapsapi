import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("v3c-carousel", Carousel);
    nuxtApp.vueApp.component("v3c-slide", Slide);
    nuxtApp.vueApp.component("v3c-pagination", Pagination);
    nuxtApp.vueApp.component("v3c-navigation", Navigation);

})
