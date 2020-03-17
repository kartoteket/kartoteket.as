<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header mb-4">
        {{ page.title }}
      </h1>
      <div class="rtf rtf--tight md:text-lg leading-relaxed mb-4">
        <p>{{ page.description }}</p>
        <p class="text-xs">
          <strong>Note:</strong> Johns Hopkins CSSE data on many countries, including Italy, is erroneous for March 12th, <a href="https://github.com/CSSEGISandData/COVID-19/issues/650">see issues</a>.
        </p>
      </div>
      <div v-if="isLoading" class="flex justify-center items-center w-full h-screen">
        <scale-loader :loading="isLoading" color="#fff" class="mx-auto" />
      </div>

      <nav class="flex flex-center">
        <button class="bg-white-700 hover:bg-white-900 text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-white-full' : view === 'country'}" @click.stop="setView('country')">
          Select Country
        </button>
        <button class="bg-white-700 hover:bg-white-900 text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-white-full' : view === 'world'}" @click.stop="setView('world')">
          World
        </button>
        <button class="bg-white-700 hover:bg-white-900 text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-white-full' : view === 'groups'}" @click.stop="setView('groups')">
          Selected Groups
        </button>
      </nav>
    </header>
    <article>
      <!-- <plot-map-chart v-if="false" :chart-data="chartData" /> -->
    </article>
    <div v-if="!isLoading" class="lg:flex flex-wrap">
      <article v-show="view === 'country'" class="lg:w-1/2 mb-12">
        <v-select v-model="selection[0]" class="dropdown lg:mr-8" :options="countriesList" @input="setSelection($event)" />
        <div class="mb-4">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            Total confirmed cases
          </h2>
          <multi-line-chart v-if="selectedTotalCases[0].length" id="custom-totals" :series="selectedTotalCases[0]" :config="{colorScale, aspectRatio: 0.5}" />
        </div>
        <div class="mb-4">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            Daily new confirmed cases
          </h2>
          <multi-line-chart v-if="selectedNewCases[0].length" id="custom-new" :series="selectedNewCases[0]" :config="{colorScale, aspectRatio: 0.4}" />
        </div>
      </article>

      <article v-show="view === 'country'" class="lg:w-1/2 mb-12">
        <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mb-4 md:-mt-10">
          Compare with
        </h2>
        <v-select v-model="selection[1]" class="dropdown lg:mr-8" :options="countriesList" @input="setSelection($event, 2)" />
        <div v-show="selection[1]" class="mb-4">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            Total confirmed cases
          </h2>
          <multi-line-chart v-if="selectedTotalCases[1].length" id="custom-totals-2" :series="selectedTotalCases[1]" :config="{colorScale, aspectRatio: 0.5}" />
        </div>
        <div v-show="selection[1]" class="mb-4">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            Daily new confirmed cases
          </h2>
          <multi-line-chart v-if="selectedNewCases[1].length" id="custom-new-2" :series="selectedNewCases[1]" :config="{colorScale, aspectRatio: 0.4}" />
        </div>
      </article>

      <article v-show="view === 'world'" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ worldSeries.title }}
        </h1>
        <div v-for="(chart, j) in worldSeries.charts" :key="j" class="mb-4" :class="(j%2) ? '' : ''">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            {{ chart.title }}
          </h2>
          <multi-line-chart :id="`world-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :config="{colorScale, aspectRatio: (j%2) ? 0.4 : 0.5}" />
        </div>
      </article>

      <article v-show="view === 'world'" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ worldOutsideChinaSeries.title }}
        </h1>
        <div v-for="(chart, j) in worldOutsideChinaSeries.charts" :key="j" class="mb-4" :class="(j%2) ? '' : ''">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            {{ chart.title }}
          </h2>
          <multi-line-chart :id="`world-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :config="{colorScale, aspectRatio: (j%2) ? 0.4 : 0.5}" />
        </div>
      </article>

      <article v-for="(block, i) in chartSeries" v-show="view === 'groups'" :key="i" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ block.title }}
        </h1>
        <div v-for="(chart, j) in block.charts" :key="j" class="mb-4" :class="(j%2) ? '' : ''">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            {{ chart.title }}
          </h2>
          <multi-line-chart :id="`${i}-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :config="{colorScale, aspectRatio: (j%2) ? 0.4 : 0.5}" />
        </div>
      </article>
    </div>
    <p v-if="!isLoading" class="rtf">
      Data Source: <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a> (<a href="https://github.com/CSSEGISandData/COVID-19">gitHub files</a>). Updated {{ lastUpdate }}.
    </p>
  </article>
</template>
<script>
import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import 'array-flat-polyfill';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import ScaleLoader from 'vue-spinner/src/PulseLoader.vue';
import MultiLineChart from '@/components/charts/MultiLineChart';

import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';
import head from '~/mixins/head.js';

const d3 = Object.assign({}, d3Lib, d3Array);

export default {
  components: {
    MultiLineChart,
    ScaleLoader,
    // PlotMapChart,
    vSelect
  },
  mixins: [head],
  data() {
    return {
      isLoading: true,
      view: 'world',
      selection: ['Norway', ''],
      inputTotalConfirmed: [],
      inputNewConfirmed: [],
      inputTotalDeaths: [],
      inputNewDeaths: [],
      margin: {
        right: 130,
        left: 120,
        top: 20,
        bottom: 10
      },
      page: {
        title: 'Corona Timelines',
        slug: 'features/corona/trend',
        description:
          'Charts showing the timeline trend of total confirmed cases and new daily registered confirmed cases of COVID-19 in affected countries.',
        url: 'https://kartoteket.as/features/corona/trend',
        image: 'https://kartoteket.as/preview-corona-charts.png'
      }
    };
  },
  computed: {
    colorScale() {
      return d3.scaleOrdinal(d3.schemeSet2); // d3.schemeTableau10
    },
    selectedNewCases() {
      return [
        this.getConfirmedCases(this.selection[0], { newCases: true }),
        this.getConfirmedCases(this.selection[1], { newCases: true })
      ];
    },
    selectedTotalCases() {
      return [
        this.getConfirmedCases(this.selection[0]),
        this.getConfirmedCases(this.selection[1])
      ];
    },
    worldSeries() {
      return {
        title: 'World',
        charts: [
          {
            title: 'Total confirmed cases',
            data: [this.getWorldConfirmed()]
          },
          {
            title: 'Daily new confirmed cases',
            data: [this.getWorldConfirmed({ newCases: true })]
          }
        ]
      };
    },
    worldOutsideChinaSeries() {
      return {
        title: 'World outside China',
        charts: [
          {
            title: 'Total confirmed cases',
            data: [this.getWorldConfirmed({ includeChina: false })]
          },
          {
            title: 'Daily new confirmed cases',
            data: [
              this.getWorldConfirmed({ includeChina: false, newCases: true })
            ]
          }
        ]
      };
    },
    chartSeries() {
      return [
        this.createChartSeries({
          title: 'Nordic Countries',
          countries: ['Norway', 'Sweden', 'Denmark', 'Finland']
        }),
        this.createChartSeries({
          title: 'Most affected (excluding China)',
          countries: [
            'Iran',
            'South Korea',
            'Italy',
            'Spain',
            'Germany',
            'France'
          ]
        })
      ];
    },
    lastUpdate() {
      const dates = this.inputTotalConfirmed.map(d => d.date);
      return dates[dates.length - 1];
    },
    countriesList() {
      const list = Object.keys(this.inputTotalConfirmed[0]);
      list.shift(); // removes "date"
      return list;
    },
    structuredData() {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          webSite,
          organisation,
          webPage({
            url: this.page.url,
            name: this.page.title,
            description: this.page.description,
            main: this.page.url
          }),
          breadCrumbs([['Homepage', ''], [this.page.title, this.page.slug]])
        ]
      };
    }
  },
  async mounted() {
    const views = ['country', 'world', 'groups'];
    this.view = views.includes(this.$route.query.view)
      ? this.$route.query.view
      : 'world';

    if (this.$route.query.c1) {
      this.selection[0] = this.$route.query.c1;
    }
    if (this.$route.query.c2) {
      this.selection[1] = this.$route.query.c2;
    }
    this.inputTotalConfirmed = await this.fetchTotalConfirmed();
    this.inputNewConfirmed = await this.fetchNewConfirmed();
    // this.inputTotalDeaths = await this.fetchTotalDeaths();
    // this.inputNewDeaths = await this.fetchNewDeaths();
    this.isLoading = false;
  },
  methods: {
    getConfirmedCases(selection, { newCases = false } = {}) {
      if (selection.length < 1) return []; // if no selection, abort
      selection = Array.isArray(selection) ? selection : [selection]; // cast to array
      const input = newCases
        ? this.inputNewConfirmed
        : this.inputTotalConfirmed;
      const output = selection.map(country => {
        const values = input.map(d => {
          return {
            date: d.date,
            value: d[country]
          };
        });
        return {
          name: country,
          values
        };
      });
      return output;
    },
    getWorldConfirmed({ includeChina = true, newCases = false } = {}) {
      const input = newCases
        ? this.inputNewConfirmed
        : this.inputTotalConfirmed;
      const values = input.map(d => {
        return {
          date: d.date,
          value: includeChina ? d.World : d.World - d.China
        };
      });
      return {
        name: includeChina ? 'World' : 'World excluding China',
        values
      };
    },
    createChartSeries({ title, countries }) {
      return {
        title,
        charts: [
          {
            title: 'Total confirmed cases',
            data: this.getConfirmedCases(countries)
          },
          {
            title: 'Daily New cases',
            data: this.getConfirmedCases(countries, { newCases: true })
          }
        ]
      };
    },
    async fetchTotalConfirmed() {
      const input = await d3.csv(
        'https://covid.ourworldindata.org/data/total_cases.csv',
        d3.autoType
      );
      return input;
    },
    async fetchNewConfirmed() {
      const input = await d3.csv(
        'https://covid.ourworldindata.org/data/new_cases.csv',
        d3.autoType
      );
      return input;
    },
    async fetchTotalDeaths() {
      const input = await d3.csv(
        'https://covid.ourworldindata.org/data/total_deaths.csv',
        d3.autoType
      );
      return input;
    },
    async fetchNewDeaths() {
      const input = await d3.csv(
        'https://covid.ourworldindata.org/data/new_deaths.csv',
        d3.autoType
      );
      return input;
    },
    setView(val) {
      if (val !== this.view) {
        this.view = val;
        const query = { view: val };
        if (val === 'country') {
          query.c1 = this.selection[0];
          query.c2 = this.selection[1];
        }
        this.$router.replace({
          path: this.$route.path,
          query
        });
      }
    },
    setSelection(val, set = 1) {
      const query = {
        view: this.view,
        c1: set === 1 ? val : this.selection[0],
        c2: set === 2 ? val : this.selection[1]
      };
      this.$router.replace({
        path: this.$route.path,
        query
      });
    }
  }
};
</script>
<style>
.dropdown .vs__selected {
  background-color: transparent;
  color: #fff;
}
.dropdown .vs__clear,
.dropdown .vs__open-indicator {
  fill: rgba(255, 255, 255, 0.75);
}
.dropdown .vs__dropdown-toggle {
  border-color: rgba(255, 255, 255, 0.25);
}
</style>
