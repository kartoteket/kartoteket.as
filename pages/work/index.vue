<template>
  <section class="lg:pt-16">
    <h1 class="main-header">
      Selected Work
    </h1>

    <div class="flex Xdebug xxl:w-2/3 uppercase text-sm tracking-wide text-white-700 mt-16">
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

    <article v-for="(entry, index) in tempwork" :key="index" class=" border-b border-white-200 font-light  xxl:w-2/3 mb-16 pt-4 opacity-90 flex Xdebug">
      <h1 class="text-xl w-3/12 mr-4">
        {{ entry.title }}
      </h1>
      <p class="w-4/12 mr-4">
        {{ entry.desc }}
      </p>
      <p class="w-2/12 mr-4">
        {{ entry.client }}
      </p>
      <p class="w-2/12 mr-4">
        {{ entry.category }}
      </p>
      <p class="w-1/12 mr-4">
        {{ entry.year }}
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
          year: '2020'
        },
        {
          title: 'Website for architects lundhagem',
          desc:
            ' Website for the amazing lundhagem architects. A Nuxt/Vue frontend with an headless implementation of Craft CMS as backend.',
          client: 'lundhagem',
          category: 'Visualization',
          year: '2019'
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
