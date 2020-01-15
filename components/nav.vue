<template>
  <nav>
    <button
      :aria-expanded="open.toString()"
      :aria-controls="id"
      class="sm:hidden flex fixed right-0 top-0 mt-8 mr-4 sm:mr-8 z-20 w-8 h-8 justify-center items-center"
      @click="toggle"
    >
      <div aria-hidden="true" class="icon" :class="open ? 'close' : 'menu'" /></div>
    </button>

    <ul
      :id="id"
      class="
        Xdebug
        list-reset
        fixed sm:relative sm:flex
        inset-0
        w-screen sm:w-auto
        h-screen sm:h-auto
        z-10
        bg-blue-900 sm:bg-transparent
        p-16 pt-32 sm:p-0
        text-center
        fade-in-out"
      :hidden="!open"
      :class="open ? 'opacity-100' : 'opacity-0 sm:opacity-100'"
      @click="toggle"
    >
      <li v-for="item in navItems" :key="item.path" class="seperate">
        <nuxt-link :to="item.path" class="text-white uppercase px-4 text-2xl sm:text-base leading-loose">
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
      open: false,
      id: null,
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
  },
  // source: https://github.com/accessible-app/vuejs/blob/master/src/components/Menu.vue
  mounted() {
    this.id = Math.random()
      .toString(36)
      .substring(2, 15);

    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.closeHandler();
      }
    });
  },
  destroyed: function() {
    document.removeEventListener('keyup', this.closeHandler);
  },
  methods: {
    toggle() {
      this.open = !this.open;
    }
  }
};
</script>
<style>
@sceen sm {
  .seperate + .seperate {
    border-left: 1px solid white;
  }
}

.icon {
  --width: 25px;
  --stroke: 2px;
  --space: 7px;
}

.icon,
.icon:before,
.icon:after {
  transition: transform 0.25s ease;
}

.menu.icon {
  position: relative;
  color: #fff;
  width: var(--width);
  height: var(--stroke);
  background-color: currentColor;
}
.menu.icon:before {
  content: '';
  position: absolute;
  top: calc(var(--space) * -1);
  left: 0;
  width: var(--width);
  height: var(--stroke);
  background-color: currentColor;
}
.menu.icon:after {
  content: '';
  position: absolute;
  top: var(--space);
  left: 0;
  width: var(--width);
  height: var(--stroke);
  background-color: currentColor;
}

.close.icon {
  opacity: 1;
  position: relative;
  width: var(--width);
  height: var(--width);
  background-color: transparent;
}
.close.icon:before {
  content: '';
  position: absolute;
  left: 0;
  top: 11px;
  width: var(--width);
  height: var(--stroke);
  background-color: currentColor;
  transform: rotate(-45deg);
}
.close.icon:after {
  content: '';
  position: absolute;
  left: -4px;
  top: 19px;
  width: var(--width);
  height: var(--stroke);
  background-color: currentColor;
  transform: rotate(45deg);
  transform-origin: bottom right;
}
</style>