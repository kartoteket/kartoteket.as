<template>
  <component :is="is" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
// Copied from: https://github.com/vuejs/vue-router/issues/1280#issuecomment-358773490
export default {
  props: {
    to: {
      type: String,
      default: null
    }
  },
  data() {
    return { is: 'a' };
  },
  methods: {
    linkProps(url) {
      if (!url) {
        return {
          is: 'router-link',
          tag: 'span',
          to: '',
          event: null
        };
      }
      if (url.match(/^(http(s)?):\/\//)) {
        return {
          is: 'a',
          href: url
          //  target: '_blank',
          //   rel: 'noopener'
        };
      }
      return {
        is: 'router-link',
        to: url
      };
    }
  }
};
</script>
