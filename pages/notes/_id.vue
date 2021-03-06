<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header">
        {{ entry.title }}
      </h1>
      <block-content v-if="entry.lead" class-name="rtf md:text-lg leading-relaxed " :render-container-on-single-child="true" :blocks="entry.lead" />
    </header>
    <block-content v-if="entry.body" class-name="main-col rtf mb-16" :render-container-on-single-child="true" :blocks="entry.body" />
    <aside v-if="entry.notes" class="side-col">
      <aside-item v-for="note in entry.notes" :key="note.id" :entry="note" />
    </aside>
  </article>
</template>
<script>
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
import blockToText from '@/utils/text.js';
import asideItem from '@/components/asideItem';
import head from '~/mixins/head.js';
export default {
  components: {
    asideItem
  },
  mixins: [head],
  computed: {
    page() {
      const text =
        blockToText(this.entry.lead) + ' ' + blockToText(this.entry.body);
      return {
        title: this.entry.title,
        description: text.substr(0, 158),
        url: `https://kartoteket.as/notes/${this.entry.slug.current}`
      };
    },
    structuredData() {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          webSite,
          organisation,
          webPage({
            url: this.page.url,
            name: this.entry.title,
            description: this.metaDescription,
            main: this.page.url
          }),
          breadCrumbs([
            ['Homepage', ''],
            ['Notes', 'notes'],
            [(this.entry.title, `notes/${this.entry.slug.current}`)]
          ])
        ]
      };
    }
  },
  async asyncData({ $sanity, params }) {
    const filters = [
      '[_type == "note"]',
      `[slug.current == "${params.id}"]`,
      '[0]'
    ];
    const projection = ['{title, slug, lead, body, url, "notes": note[]->}'];
    const query = `{
      "entry": ${['*']
        .concat(filters)
        .concat([projection])
        .join('|')}
      }`;
    const result = await $sanity.fetch(query);
    return result;
  }
};
</script>
