<template>
  <article class="mb-4">
    <header class="flex justify-between border-b-2 border-white-500 mr-8 mt-4">
      <h2 class="text-sm uppercase text-sm tracking-wide text-white-700">
        {{ title }}
      </h2>
      <nav v-if="scaleOptions && scaleOptions.length">
        <label v-for="scale in scaleOptions" :key="scale" :for="scale" class="capitalize">
          <input
            id="scale"
            v-model="yScaleType"
            type="radio"
            :value="scale"
          >
          {{ scale }}
        </label>
      </nav>
    </header>
    <multi-line-chart
      :id="id"
      :series="series"
      :y-scale-type="yScaleType"
      :config="config"
    />
  </article>
</template>
<script>
import MultiLineChart from '@/components/charts/MultiLineChart';

export default {
  name: 'ChartContainer',
  components: {
    MultiLineChart
  },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    series: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    scaleOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      yScaleType: 'linear'
    };
  }
};
</script>
