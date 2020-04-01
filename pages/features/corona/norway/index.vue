<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header mb-4">
        {{ page.title }}
      </h1>
      <p>{{ page.description }}</p>
    </header>
    <div>
      <article id="container" class="h-50 bg-white-800 w-full lg:w-5/6 xxl:w-4/6 mt-4">
        <h1 class="text-lg md:text-2xl">
          Current totals: Cumulative registered total cases and daily new cases
        </h1>
        <div class="w-full h-0 relative iframe-container">
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://charts.corona.kartoteket.as/embeds/chart/norway/total,new"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            frameborder="0"
          />
        </div>
      </article>
      <article id="container" class="h-50 bg-white-800 w-full lg:w-5/6 xxl:w-4/6 mt-4">
        <h1 class="text-lg md:text-2xl">
          Current key figures: Hospitalized, ICU-patients, dead
        </h1>
        <div class="w-full h-0 relative iframe-container">
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://charts.corona.kartoteket.as/embeds/chart/norway/hospital,icu,deaths"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            frameborder="0"
          />
        </div>
      </article>
      <article id="container" class="h-50 bg-white-800 w-full lg:w-5/6 xxl:w-4/6 mt-4">
        <h1 class="text-lg md:text-2xl">
          Current number of patients in hospital
        </h1>
        <h2 class="text-sm md:text-lg">
          With FHI prognosed scenario targets
        </h2>
        <div class="w-full h-0 relative iframe-container">
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://charts.corona.kartoteket.as/embeds/chart/norway/hospital?feature=scenarios&amp;zoom=3"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            frameborder="0"
          />
        </div>
      </article>
      <article id="container" class="h-50 bg-white-800 w-full lg:w-5/6 xxl:w-4/6 mt-4">
        <h1 class="text-lg md:text-2xl">
          Current number of patients in intensive care units
        </h1>
        <h2 class="text-sm md:text-lg">
          With FHI prognosed scenario targets
        </h2>
        <div class="w-full h-0 relative iframe-container">
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://charts.corona.kartoteket.as/embeds/chart/norway/icu?feature=scenarios&amp;zoom=1"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            frameborder="0"
          />
        </div>
      </article>
      <!--
      <article id="container" class="h-50 bg-white-800 w-full lg:w-5/6 xxl:w-4/6 mt-4">
        <h1 class="text-lg md:text-2xl">
          Number of persons tested
        </h1>
        <div class="w-full h-0 relative">
          <iframe
            class="absolute top-0 left-0 w-full h-full"
            src="https://charts.corona.kartoteket.as/embeds/chart/norway/tested"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            frameborder="0"
          />
        </div>
      </article> -->
    </div>
  </article>
</template>

<script>
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
import head from '~/mixins/head.js';

export default {
  layout: 'light',
  mixins: [head],
  data() {
    return {
      id: `cowid19map`,
      isLoading: true,
      page: {
        title: 'Corona status in Norway',
        slug: 'features/corona/norway',
        description:
          'Charts visualising Corona statistics in Norway, including total registered cases, hospitalized, icu-patients and deaths. Data from the Norwegian Institute of Public Health (FHI).',
        url: `https://kartoteket.as/features/corona/norway`
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
  }
};
</script>
<style>
.iframe-container {
  padding-bottom: 75%;
}
@screen sm {
  .iframe-container {
    padding-bottom: 65%;
  }
}
@screen md {
  .iframe-container {
    padding-bottom: 60%;
  }
}
</style>
