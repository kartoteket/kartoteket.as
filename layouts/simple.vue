<template>
  <div class="site-container font-light">
    <nuxt class="p-page flex-1" />
    <footer class="site-footer p-page py-8 flex sm:justify-end">
      <div class="md:w-1/2 font-hairline sm:text-right text-sm sm:text-base">
        <p>Always, it's storytelling.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false
    };
  },
  head: {
    bodyAttrs: {
      class: 'theme-dark'
    }
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
    }
  }
};
</script>
