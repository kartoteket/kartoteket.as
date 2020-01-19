<template>
  <section>
    <h1 class="main-header">
      Selected Work
    </h1>

    <div class="hidden md:flex xxl:w-2/3 uppercase text-sm tracking-wide text-white-700">
      <div class="w-3/12 mr-4 border-b-2 border-white-500 ">
        Project
      </div>
      <div class="w-4/12 mr-4 border-b-2 border-white-500 ">
        About
      </div>
      <div class="w-2/12 mr-4 border-b-2 border-white-500 ">
        Client
      </div>
      <div class="w-2/12 mr-4 border-b-2 border-white-500 ">
        Type
      </div>
      <div class="w-1/12 mr-4 border-b-2 border-white-500 ">
        Year
      </div>
    </div>

    <article v-for="(entry, index) in tempwork" :key="index" class="md:flex relative border-b border-white-200 xxl:w-2/3 mt-6 pb-8 pr-8 md:pr-0 opacity-90">
      <h1 class="text-2xl md:text-xl md:w-3/12 mr-4 mb-4 flex items-start">
        <a :href="entry.url" class="flex-1">{{ entry.title }}</a>
        <a :href="entry.url" class="text-4xl -mt-2 absolute right-0 md:relative">&nearr;</a>
      </h1>
      <p class="md:w-4/12 md:mr-4 mb-4 md:mb-0">
        {{ entry.desc }}
      </p>
      <p class="md:w-2/12 md:mr-4 text-sm md:text-base">
        <span class="uppercase text-xs tracking-wide text-white-700 md:hidden">Client: </span> {{ entry.client }}
      </p>
      <p class="md:w-2/12 md:mr-4 text-sm md:text-base">
        <span class="uppercase text-xs tracking-wide text-white-700 md:hidden">Type: </span> {{ entry.category }}
      </p>
      <p class="md:w-1/12 md:mr-4 text-sm md:text-base">
        <span class="uppercase text-xs tracking-wide text-white-700 md:hidden">Year: </span> {{ entry.year }}
      </p>
    </article>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tempwork: [
        {
          title: '31 days of data',
          desc: ' One new dataviz each day',
          client: 'Inhouse',
          slug: '31dager',
          category: 'Visualization',
          year: '2020',
          url: 'https://lundhagem.no'
        },
        {
          title: 'Website for architects lundhagem',
          desc:
            ' Website for the amazing lundhagem architects. A Nuxt/Vue frontend with an headless implementation of Craft CMS as backend.',
          client: 'lundhagem',
          category: 'Visualization',
          year: '2019',
          url: 'https://lundhagem.no'
        },
        {
          title: 'Forest Data Maps',
          desc:
            ' Dynamic map system for Rainforest foundation Norway. Mapping Deforestation and state of the rain forest. ',
          client: 'Rainforest foundation Norway',
          category: 'Map, Visualization',
          year: '2018',
          url: 'https://www.regnskog.no/kart'
        },
        {
          title: 'Website for architects lundhagem',
          desc:
            ' Website for the amazing lundhagem architects. A Nuxt/Vue frontend with an headless implementation of Craft CMS as backend.',
          client: 'lundhagem',
          category: 'Visualization',
          year: '2019',
          url: 'https://lundhagem.no'
        }
      ]
    };
  },
  async asyncData({ $sanity }) {
    const query = '{ "work": *[_type == "work"] }';
    const { work } = await $sanity.fetch(query);
    return { work };
  }
};
</script>

<style>
.parent {
  display: grid;
  grid-template-columns: 2fr 4fr repeat(2, 1fr);
  grid-template-rows: auto;
  grid-column-gap: 16px;
  grid-row-gap: 16px;
}
</style>
