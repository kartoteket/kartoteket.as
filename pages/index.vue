<template>
  <section>
    <main class="p-page flex">
      <p class="text-4xl sm:text-2xl lg:text-4xl opacity-90 sm:w-3/4 lg:w-1/2 pt-16 lg:pt-32 xl:pt-64">
        Kartoteket is a studio building websites, visualisations and data driven maps.
      </p>
    </main>
    <aside class="p-page mt-20 lg:w-1/2 xl:w-1/3 ">
      <article class="mb-6 relative">
        <h2 class="aside-header">
          Feature
        </h2>
        <div class="flex items-center">
          <p>
            <a href="/features/corona">
              Tracking the Corona-virus.<br>
              Maps and trendlines.</a>
          </p>
          <a href="/features/corona" class="text-5xl block leading-none">&nearr;</a>
        </div>
      </article>
    </aside>
  </section>
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
