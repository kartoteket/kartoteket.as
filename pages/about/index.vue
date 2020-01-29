<template>
  <article class="md:flex">
    <main class="md:w-2/3 xl:w-1/2 md:pr-8 md:mr-8">
      <h1 class="main-header">
        {{ entry.title }}
      </h1>
      <block-content v-if="entry.lead" class-name="rtf md:text-lg leading-relaxed" :render-container-on-single-child="true" :blocks="entry.lead" />
      <block-content v-if="entry.body" class-name="rtf" :render-container-on-single-child="true" :blocks="entry.body" />
    </main>
    <aside class="md:w-1/3 xl:w-1/2 self-end mb-16">
      <article v-for="note in entry.notes" :key="note.id">
        <h2 class="aside-header">
          {{ note.title }}
        </h2>
        <block-content v-if="note.lead" class-name="rtf" :render-container-on-single-child="true" :blocks="note.lead" />
        <a v-if="note.body" :href="`notes/${note.slug.current}`">More</a>
      </article>
      <h2 class="aside-header">
        Clients
      </h2>
      <div class="rtf">
        <p>
          Norwegian Ministry of Foreign Affairs, lundhagem architects, IOM Mixed Migration Hub, Rainforest Foundation Norway, The Tax Justice Network Norway
        </p>
      </div>
    </aside>
  </article>
</template>
<script>
export default {
  async asyncData({ $sanity }) {
    const query =
      '{ "entry": *[_type == "page" && slug.current == "about"][0] | {title, slug, lead, body, "notes": note[]->, url}}';
    const { entry } = await $sanity.fetch(query);
    console.log(entry);
    return { entry };
  }
};
</script>
