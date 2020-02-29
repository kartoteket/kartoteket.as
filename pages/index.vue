<template>
  <main class="p-page flex">
    <p class="text-4xl sm:text-2xl lg:text-4xl opacity-90 sm:w-3/4 lg:w-1/2 Xdebug pt-16 lg:pt-32 xl:pt-64">
      Kartoteket is a studio building websites, visualisations and data driven maps.
    </p>
  </main>
</template>
<script>
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
export default {
  data() {
    return {
      page: {
        title: '',
        description:
          'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO',
        url: 'https://kartoteket.as/'
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
            name: 'Kartoteket',
            description: this.page.description,
            main: this.page.url
          }),
          breadCrumbs([['Homepage', '']])
        ]
      };
    }
  },
  head() {
    return {
      script: [
        {
          type: 'application/ld+json',
          json: this.structuredData
        }
      ]
    };
  }
};
</script>
