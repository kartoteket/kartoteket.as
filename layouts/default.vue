<template>
  <div class="site-container">
    <header :class="`site-header bg-${colorMap(currentPage)}`">
      <nuxt-link to="to" class="text-white no-underline">
        Kartoteket
      </nuxt-link>
    </header>
    <siteNav />
    <nuxt />
    <footer class="site-header">
      Footer
    </footer>
  </div>
</template>

<script>
import siteNav from '@/components/nav';
export default {
  components: {
    siteNav
  },
  data() {
    return {
      currentPage: '/'
    };
  },
  watch: {
    $route(to, from) {
      this.currentPage = to.path;
    }
  },
  created() {
    this.currentPage = this.$route.path;
  },
  methods: {
    colorMap: function(path) {
      const map = {
        '/': 'vermillon',
        '/about': 'deep-blue',
        '/work': 'green',
        '/approach': 'yellow',
        '/articles': 'purple'
      };
      return map[path];
    }
  }
};
</script>
