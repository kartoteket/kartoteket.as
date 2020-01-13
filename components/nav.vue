<template>
  <nav>
    <ul class="list-reset flex">
      <li v-for="item in navItems" :key="item.path" :class="`p-1 m-4 border-2 rounded-full border-${item.color}`">
        <nuxt-link :to="item.path" :class="`bg-${item.color} rounded-full w-24 h-24 block flex items-center justify-center text-white no-underline`">
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
          path: '/',
          label: 'Home',
          color: 'vermillon'
        },
        {
          path: 'about',
          label: 'About',
          color: 'deep-blue'
        },
        {
          path: 'work',
          label: 'Work',
          color: 'green'
        },
        {
          path: 'approach',
          label: 'Approach',
          color: 'yellow'
        },
        {
          path: 'articles',
          label: 'Articles',
          color: 'purple'
        }
      ]
    };
  }
};
</script>
