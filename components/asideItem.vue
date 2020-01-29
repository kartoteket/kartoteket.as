<template>
  <article class="mb-6">
    <h2 class="aside-header">
      {{ entry.title }}
    </h2>
    <block-content v-if="entry.lead" class-name="rtf" :render-container-on-single-child="true" :blocks="entry.lead" />
    <ul v-if="entry.list" class="rtf">
      <li v-for="(item, index) in entry.list" :key="index" class="inline">
        <span v-if="index !== 0">, </span>
        <a :href="item.url">{{ item.name }}</a>
      </li>
    </ul>
    <a v-if="entry.slug && entry.body" class="link" :href="`notes/${entry.slug.current}`">Read more</a>
    <a v-if="entry.url" class="link" :href="entry.url">Besøk</a>
  </article>
</template>
<script>
export default {
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  mounted() {
    console.log(this.entry);
  }
};
</script>
