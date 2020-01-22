<template>
  <div class="site-container font-light">
    <header class="flex justify-between items-center h-24 lg:mb-8 w-full p-page">
      <nuxt-link to="/" class="text-white-full no-underline uppercase text-xl tracking-wide opacity-90 z-20" @click="toggleMenu">
        Kartoteket
      </nuxt-link>
      <siteNav :open="isMenuOpen" @click="toggleMenu" />
    </header>
    <nuxt class="p-page flex-1" />
    <footer class="site-footer p-page py-8 flex sm:justify-end">
      <div class="md:w-1/2 font-hairline sm:text-right text-sm sm:text-base">
        <!--
        <p>We write code that creates relations.</p>
        <p>Relationships enables analysis of patterns, transforming data into knowledge. </p>
        <p>By connecting the dots, we paint you the picture.</p>
        <p>That picture might be a map or a data visualization. It might be a website. Always, it's storytelling.</p> -->
        <p>Always, it's storytelling.</p>
      </div>
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
      isMenuOpen: false
    };
  },
  mounted() {
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.isMenuOpen = false;
      }
    });
  },
  destroyed() {
    document.removeEventListener('keyup', this.closeHandler);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      console.log('this.isMenuOpen', this.isMenuOpen);
    }
  }
};
</script>
