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
        <link-wrapper :to="link(entry)">
          {{ entry.title }}
        </link-wrapper>
      </h1>
      <block-content v-if="entry.lead" class-name="rtf mb-2" :render-container-on-single-child="true" :blocks="entry.lead" />
      <link-wrapper v-if="link(entry)" class="link" :to="link(entry)">
        Read more...
      </link-wrapper>
    </article>
    <aside class="side-col">
      <aside-item v-for="note in notes.side" :key="note.id" :entry="note" />
    </aside>
  </section>
</template>
<script>
import asideItem from '@/components/asideItem';
import linkWrapper from '@/components/linkWrapper';
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
import head from '~/mixins/head.js';

export default {
  components: {
    asideItem,
    linkWrapper
  },
  mixins: [head],
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
    const sorts = ['order(_createdAt desc)'];
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
  data() {
    return {
      page: {
        title: 'Notes',
        slug: 'notes',
        description:
          'Notes by Kartoteket. Notes, writings, scribbles. Storytelling.',
        url: 'https://kartoteket.as/notes'
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
  methods: {
    link(e) {
      if (e.slug && e.body) { return `/notes/${e.slug.current}`; }
      if (e.url) { return e.url; }
      return null;
    }
  }
};
</script>
