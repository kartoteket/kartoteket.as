<template>
  <main class="lg:pt-16">
    <article v-for="(entry, index) in tempwork" :key="index" class="border-t border-white-500 font-light lg:w-2/3 mb-16 pt-4 opacity-90 flex">
      <h1 class="text-xl w-1/2 pr-8">
        {{ entry.title }}
      </h1>
      <p class="">
        {{ entry.desc }}
      </p>
    </article>
  </main>
</template>
<script>
export default {
  data() {
    return {
      tempwork: [
        {
          title: '31 days of data',
          desc:
            ' Website for the amazing lundhagem architects. A Nuxt/Vue frontend with an headless implementation of Craft CMS as backend.',
          slug: 'lundhagem'
        },
        {
          title: 'Website for architects lundhagem',
          desc:
            ' Website for the amazing lundhagem architects. A Nuxt/Vue frontend with an headless implementation of Craft CMS as backend.'
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
