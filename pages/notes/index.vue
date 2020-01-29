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
export default {
  components: {
    asideItem
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
  }
};
</script>
