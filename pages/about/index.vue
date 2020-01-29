<template>
  <article class="md:flex">
    <main class="md:w-2/3 xl:w-1/2 md:pr-8 md:mr-8 mb-16">
      <h1 class="main-header">
        {{ entry.title }}
      </h1>
      <block-content v-if="entry.lead" class-name="rtf md:text-lg leading-relaxed" :render-container-on-single-child="true" :blocks="entry.lead" />
      <block-content v-if="entry.body" class-name="rtf" :render-container-on-single-child="true" :blocks="entry.body" />
    </main>
    <aside class="md:w-1/3 xl:w-1/2 self-end">
      <aside-item v-for="note in entry.notes" :key="note.id" :entry="note" />
      <aside-item :entry="clients" />
    </aside>
  </article>
</template>
<script>
import asideItem from '@/components/asideItem';
export default {
  components: {
    asideItem
  },
  computed: {
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
  },
  mounted() {
    console.log(this.clients);
  }
};
</script>
