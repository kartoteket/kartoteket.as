<template>
  <nav>
    <button
      :aria-expanded="open.toString()"
      :aria-controls="id"
      aria-label="Open menu"
      class="
        sm:hidden flex
        fixed
        right-0 bottom-0
        mb-4 mr-4
        z-20
        w-12 h-12
        justify-center
        items-center
        rounded-full
        bg-blue-900
        shadow-lg
        scale-in
        "
      @click="$emit('click')"
    >
      <div aria-hidden="true" class="icon" :class="open ? 'close' : 'menu'" />
    </button>

    <ul
      :id="id"
      class="
        list-reset
        fixed sm:relative
        flex
        flex-col sm:flex-row
        justify-center
        items-center
        inset-0
        h-screen sm:h-auto
        z-10
        bg-blue-900 sm:bg-transparent
        text-center
        "
      :hidden="!open"
      :class="open ? 'menu-fade-out' : 'menu-fade-in'"
      @click="$emit('click')"
    >
      <li v-for="item in navItems" :key="item.path" class="seperate">
        <nuxt-link :to="item.path" class="text-white-full sm:uppercase px-4 text-4xl sm:text-base leading-loose">
          {{ item.label }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      navItems: [
        {
          path: '/about',
          label: 'About'
        },
        {
          path: '/work',
          label: 'Work'
        },
        {
          path: '/notes',
          label: 'Notes'
        },

        {
          path: '/contact',
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
  }
};
</script>
<style>
@screen max-sm {
  .menu-fade-out {
    opacity: 1;
    width: 100vw;
    transition: opacity 0.5s, width 0s;
  }
  .menu-fade-in {
    opacity: 0;
    width: 0;
    overflow: hidden;
    transition: opacity 0.5s, width 0s 0.5s;
  }
}

@sceen sm {
  .seperate + .seperate {
    border-left: 1px solid white;
  }
}
.scale-in {
  animation: 1s ease-out 0s 1 scaleUp;
}

@keyframes scaleUp {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
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
