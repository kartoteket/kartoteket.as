<template>
  <section>
    <h1 class="main-header">
      Selected Work
    </h1>

    <div class="hidden md:flex xxl:w-2/3 uppercase text-sm tracking-wide text-white-700">
      <div class="w-3/12 mr-6 border-b-2 border-white-500 ">
        Project
      </div>
      <div class="w-4/12 mr-6 border-b-2 border-white-500 ">
        About
      </div>
      <div class="w-2/12 mr-6 border-b-2 border-white-500 ">
        Client
      </div>
      <div class="w-2/12 mr-6 border-b-2 border-white-500 ">
        Type
      </div>
      <div class="w-1/12 mr-6 border-b-2 border-white-500 ">
        Year
      </div>
    </div>

    <article v-for="(entry, index) in work" :key="index" class="md:flex relative border-b border-white-200 xxl:w-2/3 mt-6 pb-8 pr-8 md:pr-0 opacity-90">
      <h1 class="text-2xl md:text-xl md:w-3/12 mr-6 mb-4 flex items-start">
        <a v-if="entry.url" :href="entry.url" class="flex-1">{{ entry.title }}</a>
        <span v-else> {{ entry.title }}</span>
        <a v-if="entry.url" :href="entry.url" class="text-4xl -mt-2 absolute right-0 md:relative">&nearr;</a>
      </h1>
      <block-content class-name="rtf rtf--tight md:w-4/12 md:mr-6" :render-container-on-single-child="true" :blocks="entry.description" />
      <p class="md:w-2/12 md:mr-6 text-sm md:text-base">
        <span class="uppercase text-xs tracking-wide text-white-700 md:hidden">Client: </span> {{ entry.client }}
      </p>
      <div class="md:w-2/12 md:mr-6 text-sm md:text-base">
        <span class="uppercase text-xs tracking-wide text-white-700 md:hidden">Type: </span>
        <ul class="inline-flex">
          <li v-for="(category, count) in entry.categories" :key="count">
            <span v-if="count !== 0">, </span>{{ category }}
          </li>
        </ul>
      </div>
      <p class="md:w-1/12 md:mr-6 text-sm md:text-base">
        <span class="uppercase text-xs tracking-wide text-white-700 md:hidden">Year: </span> {{ entry.year | yearFormat }}
      </p>
    </article>
  </section>
</template>

<script>
import head from '~/mixins/head.js';
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';

export default {
  filters: {
    yearFormat: function(string) {
      if (!string) return '';
      return string.substr(0, 4);
    }
  },
  mixins: [head],
  data() {
    return {
      page: {
        title: 'Selected Work',
        slug: 'work',
        description:
          'Selected works by Kartoteket. The project portfolia consists mainly of websites, data visualisations and maps'
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
            url: `https://kartoteket.as/${this.page.slug}`,
            name: this.page.title,
            description: this.page.description,
            main: `https://kartoteket.as/${this.page.slug}`
          }),
          breadCrumbs([['Homepage', ''], [this.page.title, this.page.slug]])
        ]
      };
    }
  },
  async asyncData({ $sanity }) {
    const query =
      '{ "work": *[_type == "work"] | order(year desc) {"categories": category[]->title, title, description, "client": client->name, year, url}}';
    const { work } = await $sanity.fetch(query);
    return { work };
  }
};
</script>
