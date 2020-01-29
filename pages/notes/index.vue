<template>
  <section class="flex flex-col">
    <header>
      <h1 class="main-header">
        Notes
      </h1>
      <div id="lead" class="rtf md:text-lg leading-relaxed">
        <p>Notes, writings, scribbles. Storytelling</p>
      </div>
    </header>
    <div class="md:flex flex-1">
      <main class="md:w-2/3 xl:w-1/2 md:pr-8 md:mr-8">
        <article v-for="(entry, index) in notes.main" :key="index" class="mb-16 border-t border-white-500">
          <h1 class="text-2xl mb-2">
            {{ entry.title }}
          </h1>
          <block-content v-if="entry.lead" class-name="rtf" :render-container-on-single-child="true" :blocks="entry.lead" />
          <a v-if="entry.slug && entry.body" :href="`notes/${entry.slug.current}`">Read more...</a>
          <a v-if="entry.url" :href="entry.url">Besøk</a>
        </article>
      </main>
      <aside class="md:w-1/3 xl:w-1/2 self-end mb-16">
        <article v-for="(entry, index) in notes.side" :key="index">
          <h2 class="aside-header">
            {{ entry.title }}
          </h2>
          <block-content v-if="entry.lead" class-name="rtf" :render-container-on-single-child="true" :blocks="entry.lead" />
          <a v-if="entry.slug && entry.body" :href="`notes/${entry.slug.current}`">Read more...</a>
          <a v-if="entry.url" :href="entry.url">Besøk</a>
        </article>
      </aside>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      tempdata: [
        {
          title: '#31dagermeddata / #31daysofdata',
          slug: '/notes/31dagermeddata',
          lead:
            '#31dagermeddata is a simple inhouse experiment. Could we publish one dataviz every day through january 2020? The following is in NORWEAGIN'
        },
        {
          title: '#31dagermeddata / #31daysofdata',
          slug: '/notes/31dagermeddata',
          lead:
            '#31dagermeddata is a simple inhouse experiment. Could we publish one dataviz every day through january 2020? The following is in NORWEAGIN'
        },
        {
          title: '#31dagermeddata / #31daysofdata',
          slug: '/notes/31dagermeddata',
          lead:
            '#31dagermeddata is a simple inhouse experiment. Could we publish one dataviz every day through january 2020? The following is in NORWEAGIN'
        }
      ]
    };
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
