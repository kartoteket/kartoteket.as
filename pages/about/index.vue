<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header">
        {{ entry.title }}
      </h1>
      <block-content v-if="entry.lead" class-name="rtf md:text-lg leading-relaxed " :render-container-on-single-child="true" :blocks="entry.lead" />
    </header>
    <block-content v-if="entry.body" class-name="main-col rtf mb-16" :render-container-on-single-child="true" :blocks="entry.body" />
    <aside class="side-col">
      <aside-item v-for="note in entry.notes" :key="note.id" :entry="note" />
      <aside-item :entry="clients" />
    </aside>
  </article>
</template>
<script>
import head from '~/mixins/head.js';
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
import asideItem from '@/components/asideItem';

export default {
  components: {
    asideItem
  },
  mixins: [head],
  data() {
    return {
      page: {
        title: 'About Kartoteket',
        slug: 'about',
        description:
          'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO'
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
    },
    clients() {
      return {
        title: 'Select Clients',
        list: this.selectedClients
      };
    }
  },
  async asyncData({ $sanity }) {
    const query = `{
        "entry": *[_type == "page" && slug.current == "about"][0] | {title, slug, lead, body, "notes": note[]->, url},
        "selectedClients": *[_type == "client" && selected == true] | {name, url}
      }`;
    const result = await $sanity.fetch(query);
    return result;
  }
};
</script>
