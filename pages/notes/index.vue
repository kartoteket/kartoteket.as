<template>
  <section class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header">
        Notes
      </h1>
      <div id="lead" class="rtf md:text-lg leading-relaxed">
        <p>Notes, writings, scribbles. Storytelling</p>
      </div>
    </header>
    <article v-for="(entry, index) in notes.main" :key="index" class="main-col mb-16 border-t border-white-500">
      <h1 class="text-2xl mb-2">
        {{ entry.title }}
      </h1>
      <block-content v-if="entry.lead" class-name="rtf" :render-container-on-single-child="true" :blocks="entry.lead" />
      <a v-if="entry.slug && entry.body" :href="`notes/${entry.slug.current}`">Read more...</a>
      <a v-if="entry.url" :href="entry.url">Besøk</a>
    </article>
    <aside class="side-col">
      <aside-item v-for="note in notes.side" :key="note.id" :entry="note" />
    </aside>
  </section>
</template>
<script>
import asideItem from '@/components/asideItem';
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
export default {
  components: {
    asideItem
  },
  data() {
    return {
      page: {
        title: 'Notes',
        slug: 'notes',
        description:
          'Notes by Kartoteket. Notes, writings, scribbles. Storytelling.'
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
    const mainFilters = [
      '[_type == "note"]',
      '[isListed == true]',
      '[isSticky != true]'
    ];
    const sideFilters = [
      '[_type == "note"]',
      '[isListed == true]',
      '[isSticky == true]'
    ];
    const sorts = ['order(_createdAt asc)'];
    const projection = ['{title, slug, lead, body, url}'];
    const query = `{
      "main": ${['*']
        .concat(mainFilters)
        .concat(sorts)
        .concat([projection])
        .join('|')},
      "side": ${['*']
        .concat(sideFilters)
        .concat(sorts)
        .concat([projection])
        .join('|')}
    }`;
    const result = await $sanity.fetch(query);
    return { notes: result };
  },
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description
        }
      ],
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(this.structuredData),
          type: 'application/ld+json'
        }
      ]
    };
  }
};
</script>
