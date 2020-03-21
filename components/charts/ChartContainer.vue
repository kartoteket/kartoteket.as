<template>
  <article class="mb-4">
    <header class="flex justify-between border-b-2 border-white-500 mr-8 mt-4">
      <h2 class="text-sm uppercase text-sm tracking-wide text-white-700">
        {{ title }}
      </h2>
      <nav>
        <label v-for="scale in scaleOptions" :key="scale" :for="scale" class="capitalize">
          <input
            id="scale"
            :name="id"
            :checked="yScaleTypes[id] === scale || scale === 'linear'"
            type="radio"
            :value="scale"
            @change="$set(yScaleTypes,id,scale)"
          > {{ scale }}
        </label>
      </nav>
    </header>
    <multi-line-chart
      :id="id"
      :series="series"
      :y-scale-type="yScaleTypes[id]"
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
      yScaleTypes: []
    };
  }
};
</script>
