<template>
  <nav>
    <button
      :aria-expanded="open.toString()"
      :aria-controls="id"
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
      @click="toggle"
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
        w-screen sm:w-auto
        h-screen sm:h-auto
        z-10
        bg-blue-900 sm:bg-transparent
        text-center
        fade-in-out
        "
      :hidden="!open"
      :class="open ? 'opacity-100' : 'opacity-0 sm:opacity-100'"
      @click="toggle"
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
  data() {
    return {
      open: false,
      id: null,
      navItems: [
        {
          path: 'about',
          label: 'About'
        },
        {
          path: 'work',
          label: 'Work'
        },
        {
          path: 'notes',
          label: 'Notes'
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
