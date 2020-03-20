<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header">
        {{ page.title }}
      </h1>
    </header>
    <div v-if="isLoading" class="flex justify-center items-center w-full h-screen">
      <scale-loader :loading="isLoading" color="#2B3F4E" class="mx-auto" />
    </div>
    <div class="flex flex-wrap">
      <article id="container" class="h-50 bg-white-800 w-full mx-auto lg:w-5/6 xxl:w-4/6">
        <svg :id="id" class="map " />
      </article>
    </div>
    <div class="rtf mx-auto mt-8">
      <p>Data Source: <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a> (<a href="https://github.com/CSSEGISandData/COVID-19">gitHub files</a>)</p>
    </div>
  </article>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/PulseLoader.vue';
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
import head from '~/mixins/head.js';
import Covid19Map from '@/viz/Covid19Map';

export default {
  layout: 'light',
  components: {
    ScaleLoader
  },
  mixins: [head],
  data() {
    return {
      id: `cowid19map`,
      isLoading: true,
      page: {
        title: 'Corona - Daily COVID-19 registrations',
        slug: 'features/corona/timeline-map',
        description:
          'Map showing the distribution and timeline of the COVID-19 outbreak',
        url: `https://kartoteket.as/features/corona/timeline-map`
      }
    };
  },
  computed: {
    structuredData() {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          webSite,
          organisation,
          webPage({
            url: this.page.url,
            name: this.page.title,
            description: this.page.description,
            main: this.page.url
          }),
          breadCrumbs([['Homepage', ''], [this.page.title, this.page.slug]])
        ]
      };
    }
  },
  async mounted() {
    const parent = document.getElementById('container');
    const covidMap = new Covid19Map(this.id, parent.clientWidth);
    await covidMap.init();
    this.isLoading = false;
    covidMap.draw();
    window.addEventListener('resize', () => {
      const parent = document.getElementById('container');
      covidMap.update(parent.clientWidth);
    });
  }
};
</script>
