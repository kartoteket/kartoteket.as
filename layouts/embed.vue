<template>
  <div class="site-container font-light">
    <nuxt class="flex-1" />
  </div>
</template>

<script>
export default {
  head: {
    bodyAttrs: {
      class: 'theme-light'
    },
    title: 'Chart by', // craches ie11 if not set
    meta: '',
    link: ''
  }
};
</script>
