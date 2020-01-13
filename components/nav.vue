<template>
  <nav>
    <ul class="list-reset flex xdebug">
      <li v-for="item in navItems" :key="item.path" class="seperate">
        <nuxt-link :to="item.path" class="text-white uppercase px-4">
          {{ item.label }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      navItems: [
        {
          path: 'work',
          label: 'Work'
        },
        {
          path: 'about',
          label: 'About'
        },
        {
          path: 'contact',
          label: 'Contact'
        }
      ]
    };
  }
};
</script>
<style scoped>
.seperate + .seperate {
  border-left: 1px solid white;
}
</style>
