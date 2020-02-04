<template>
  <article class="mb-6">
    <h2 class="aside-header">
      <link-wrapper :to="link(entry)">
        {{ entry.title }}
      </link-wrapper>
    </h2>
    <block-content v-if="entry.lead" class-name="rtf" :render-container-on-single-child="true" :blocks="entry.lead" />
    <ul v-if="entry.list" class="rtf">
      <li v-for="(item, index) in entry.list" :key="index" class="inline">
        <span v-if="index !== 0">, </span>
        <a :href="item.url">{{ item.name }}</a>
      </li>
    </ul>
    <link-wrapper v-if="link(entry)" class="link" :to="link(entry)">
      Read more...
    </link-wrapper>
  </article>
</template>
<script>
import linkWrapper from '@/components/linkWrapper';

export default {
  components: {
    linkWrapper
  },
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  methods: {
    link(e) {
      if (e.slug && e.body) return `/notes/${e.slug.current}`;
      if (e.url) return e.url;
      return null;
    }
  }
};
</script>
