<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <router-link to="/citations" class="uppercase text-sm">
        Citations:
      </router-link>
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
import asideItem from '@/components/asideItem';
export default {
  components: {
    asideItem
  },
  async asyncData({ $sanity, params }) {
    const filters = [
      '[_type == "citation"]',
      `[slug.current == "${params.id}"]`,
      '[0]'
    ];
    const projection = ['{title, slug, body,"notes": note[]->}'];
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
