<template>
  <section class="flex flex-col">
    <header class="mb-8">
      <h1 class="main-header">
        Citations
      </h1>
    </header>
    <div class="md:flex flex-1">
      <ul class="md:w-2/3 xl:w-1/2 md:pr-8 md:mr-8">
        <li v-for="(entry, index) in citations" :key="index" class="mb-16 border-t border-white-500">
          <a v-if="entry.slug && entry.body" :href="`/citations/${entry.slug.current}`">{{ entry.title }}</a>
        </li>
      </ul>
    </div>
  </section>
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
  mixins: [head],
  async asyncData({ $sanity }) {
    const filters = ['[_type == "citation"]'];
    const sorts = ['order(_createdAt asc)'];
    const projection = ['{title, slug, body}'];
    const query = `{
      "citations": ${['*']
        .concat(filters)
        .concat(sorts)
        .concat([projection])
        .join('|')}
    }`;
    const result = await $sanity.fetch(query);
    return result;
  },
  data() {
    return {
      page: {
        title: 'Citations',
        slug: 'citations',
        description: 'Data Sources and Citations.',
        url: 'https://kartoteket.as/citations'
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
