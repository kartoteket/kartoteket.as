<template>
  <article class="flex flex-col">
    <header class="text-center mb-8">
      <h1 class="main-header mb-1 text-xl md:text-4xl">
        {{ page.title }}
      </h1>
      <p class="text-xs mb-6">
        <span v-show="source === 'johnshopkins'">
          <strong>Note:</strong> Johns Hopkins CSSE data for new cases on many countries, including Italy, is missing for March 12th, <a class="link" href="https://github.com/CSSEGISandData/COVID-19/issues/650">see issues</a>.
        </span>
        <span v-show="source === 'owid'">
          <strong>Note:</strong> WHO data for new cases on some countries, including Norway, is missing for March 13th.
        </span>
        &nbsp;
      </p>
      <div v-if="isLoading" class="flex justify-center items-center w-full h-screen">
        <scale-loader :loading="isLoading" color="#fff" class="mx-auto" />
      </div>
      <div class="flex flex-wrap justify-center md:justify-between">
        <div class="w-full md:w-auto">
          <h2 class="text-sm uppercase text-sm text-white-800 text-left tracking-wide border-b-2 border-white-500 mr-8 mb-4">
            View Charts
          </h2>
          <nav class="flex flex-center">
            <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : view === 'country'}" @click.stop="setView('country')">
              Select
            </button>
            <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : view === 'world'}" @click.stop="setView('world')">
              World
            </button>
            <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : view === 'groups'}" @click.stop="setView('groups')">
              Collections
            </button>
          </nav>
        </div>
        <div class="w-full md:w-auto">
          <h2 class="text-sm uppercase text-sm text-white-800 text-left tracking-wide border-b-2 border-white-500 mr-8 mb-4">
            Data Source
          </h2>
          <nav class="flex flex-center">
            <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 text-sm md:text-base py-1 px-2 md:px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : source === 'owid'}" @click.stop="source = 'owid'">
              WHO / Our World in Data
            </button>
            <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 text-sm md:text-base py-1 px-2 md:px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : source === 'johnshopkins'}" @click.stop="source = 'johnshopkins'">
              Johns Hopkins
            </button>
          </nav>
        </div>
      </div>
    </header>
    <div v-if="!isLoading" class="lg:flex flex-wrap justify-center">
      <article v-show="view === 'country'" class="lg:w-3/5 mb-12">
        <v-select v-model="selection[0]" class="dropdown lg:mr-8" :options="countriesList" :multiple="true" @input="setSelection($event)" />
        <div class="mb-4">
          <header class="flex justify-between border-b-2 border-white-500 mr-8 mt-4">
            <h2 class="text-sm uppercase text-sm tracking-wide text-white-700">
              Total confirmed cases
            </h2>
            <nav>
              <label v-for="scale in ['linear','log']" :key="scale" :for="scale" class="capitalize">
                <input
                  id="scale"
                  name="custom-totals"
                  :checked="yScaleTypes['custom-totals'] === scale || scale === 'linear'"
                  type="radio"
                  :value="scale"
                  @change="$set(yScaleTypes,'custom-totals',scale)"
                > {{ scale }}
              </label>
            </nav>
          </header>
          <multi-line-chart v-if="selectedTotalCases[0].length" id="custom-totals" :series="selectedTotalCases[0]" :y-scale-type="yScaleTypes['custom-totals']" :config="Object.assign({aspectRatio: 0.5, yScaleType: 'log'}, chartConfig)" />
        </div>
        <div class="mb-4">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            Daily new confirmed cases
          </h2>
          <multi-line-chart v-if="selectedNewCases[0].length" id="custom-new" :series="selectedNewCases[0]" :config="Object.assign({aspectRatio: 0.5}, chartConfig)" />
        </div>
      </article>

      <!--
      <article v-if="false" v-show="view === 'country'" class="lg:w-1/2 mb-12">
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
      -->
      <article v-show="view === 'world'" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ worldSeries.title }}
        </h1>
        <div v-for="(chart, j) in worldSeries.charts" :key="`world-${j}`" class="mb-4" :class="(j%2) ? '' : ''">
          <header class="flex justify-between border-b-2 border-white-500 mr-8 mt-4">
            <h2 class="text-sm uppercase text-sm tracking-wide text-white-700">
              {{ chart.title }}
            </h2>
            <nav v-if="chart.scales">
              <label v-for="scale in chart.scales" :key="scale" :for="scale" class="capitalize">
                <input
                  id="scale"
                  :name="`world-${j}`"
                  :checked="yScaleTypes[`world-${j}`] === scale || scale === 'linear'"
                  type="radio"
                  :value="scale"
                  @change="$set(yScaleTypes,`world-${j}`,scale)"
                > {{ scale }}
              </label>
            </nav>
          </header>
          <multi-line-chart :id="`world-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :y-scale-type="yScaleTypes[`world-${j}`]" :config="chart.config" />
        </div>
      </article>

      <article v-show="view === 'world'" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ worldOutsideChinaSeries.title }}
        </h1>
        <div v-for="(chart, j) in worldOutsideChinaSeries.charts" :key="`outsidechina-${j}`" class="mb-4" :class="(j%2) ? '' : ''">
          <header class="flex justify-between border-b-2 border-white-500 mr-8 mt-4">
            <h2 class="text-sm uppercase text-sm tracking-wide text-white-700">
              {{ chart.title }}
            </h2>
            <nav v-if="chart.scales">
              <label v-for="scale in chart.scales" :key="scale" :for="scale" class="capitalize">
                <input
                  id="scale"
                  :name="`outsidechina-${j}`"
                  :checked="yScaleTypes[`outsidechina-${j}`] === scale || scale === 'linear'"
                  type="radio"
                  :value="scale"
                  @change="$set(yScaleTypes,`outsidechina-${j}`,scale)"
                > {{ scale }}
              </label>
            </nav>
          </header>
          <multi-line-chart :id="`outsidechina-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :y-scale-type="yScaleTypes[`outsidechina-${j}`]" :config="chart.config" />
        </div>
      </article>

      <article v-for="(block, i) in chartSeries" v-show="view === 'groups'" :key="i" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ block.title }}
        </h1>
        <div v-for="(chart, j) in block.charts" :key="j" class="mb-4" :class="(j%2) ? '' : ''">
          <header class="flex justify-between border-b-2 border-white-500 mr-8 mt-4">
            <h2 class="text-sm uppercase text-sm tracking-wide text-white-700">
              {{ chart.title }}
            </h2>
            <nav v-if="chart.scales">
              <label v-for="scale in chart.scales" :key="scale" :for="scale" class="capitalize">
                <input
                  id="scale"
                  :name="`chart-${i}-${j}`"
                  :checked="yScaleTypes[`chart-${i}-${j}`] === scale || scale === 'linear'"
                  type="radio"
                  :value="scale"
                  @change="$set(yScaleTypes,`chart-${i}-${j}`,scale)"
                > {{ scale }}
              </label>
            </nav>
          </header>
          <multi-line-chart :id="`chart-${i}-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :y-scale-type="yScaleTypes[`chart-${i}-${j}`]" :config="Object.assign({aspectRatio: (j%2) ? 0.4 : 0.5, yScaleType: (j%2) ? 'linear' : 'log'}, chartConfig)" />
        </div>
      </article>
    </div>
    <div class="main-col mx-auto rtf rtf--tight XXmd:text-lg leading-relaxed mb-4">
      <p>{{ page.description }}</p>
      <p v-if="!isLoading && source === 'johnshopkins'" class="rtf">
        Data Source: <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a> (<a href="https://github.com/CSSEGISandData/COVID-19">gitHub files</a>). Updated {{ lastUpdate }}.
      </p>
      <p v-if="!isLoading && source === 'owid'" class="rtf">
        Data Source: <a href="https://ourworldindata.org/coronavirus-source-data">Our World in Data</a>. Updated {{ lastUpdate }}.
      </p>
    </div>
  </article>
</template>
<script>
import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import 'array-flat-polyfill';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import ScaleLoader from 'vue-spinner/src/PulseLoader.vue';
// import isoToName from '@/utils/countryMap.js';
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
      selection: ['Norway'],
      input: {},
      inputTotalConfirmed: [],
      inputNewConfirmed: [],
      inputTotalDeaths: [],
      inputNewDeaths: [],
      yScaleTypes: [],
      margin: {
        right: 80,
        left: 10,
        top: 20,
        bottom: 20
      },
      source: 'johnshopkins', // 'owid',
      files: {
        owid: [
          'https://covid.ourworldindata.org/data/total_cases.csv',
          'https://covid.ourworldindata.org/data/new_cases.csv'
          // 'https://covid.ourworldindata.org/data/total_deaths.csv',
          // 'https://covid.ourworldindata.org/data/new_deaths.csv',
        ],
        johnshopkins: [
          'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/total_cases_by_country.csv',
          'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/new_cases_by_country.csv'
          // 'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/total_deaths_by_country.csv',
          // 'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/new_deaths_by_country.csv',
          // 'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/total_recovered_by_country.csv',
          // 'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/new_recovered_by_country.csv'
        ]
      },
      page: {
        title: 'Corona Development',
        slug: 'features/corona/trend',
        description:
          'Charts showing the timeline trend of total confirmed cases and new daily registered confirmed cases of COVID-19 in affected countries.',
        url: 'https://kartoteket.as/features/corona/trend',
        image: 'https://kartoteket.as/preview-corona-charts.png'
      }
    };
  },
  computed: {
    chartConfig() {
      return {
        colorScale: this.colorScale,
        yAxis: 'right',
        margin: this.margin
      };
    },

    colorScale() {
      return d3.scaleOrdinal(d3.schemeOranges[9].reverse()); // d3.schemeTableau10
    },
    selectedNewCases() {
      return [
        this.getConfirmedCases(this.selection[0], { newCases: true })
        // this.getConfirmedCases(this.selection[1], { newCases: true })
      ];
    },
    selectedTotalCases() {
      return [
        this.getConfirmedCases(this.selection[0])
        // this.getConfirmedCases(this.selection[1])
      ];
    },
    worldSeries() {
      return {
        title: 'World',
        charts: [
          {
            title: 'Total confirmed cases',
            data: [this.getWorldConfirmed()],
            scales: ['linear', 'log'],
            config: Object.assign({ aspectRatio: 0.5 }, this.chartConfig)
          },
          {
            title: 'Daily new confirmed cases',
            data: [this.getWorldConfirmed({ newCases: true })],
            config: Object.assign({ aspectRatio: 0.4 }, this.chartConfig)
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
            data: [this.getWorldConfirmed({ includeChina: false })],
            scales: ['linear', 'log'],
            config: Object.assign({ aspectRatio: 0.5 }, this.chartConfig)
          },
          {
            title: 'Daily new confirmed cases',
            data: [
              this.getWorldConfirmed({ includeChina: false, newCases: true })
            ],
            config: Object.assign({ aspectRatio: 0.4 }, this.chartConfig)
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
      return d3.timeFormat('%d. %b')(dates[dates.length - 1]);
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
  watch: {
    async source(val) {
      this.inputTotalConfirmed = await this.fetchData('totalCases');
      this.inputNewConfirmed = await this.fetchData('newCases');
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
    // if (this.$route.query.c2) {
    //   this.selection[1] = this.$route.query.c2;
    // }
    this.inputTotalConfirmed = await this.fetchData('totalCases');
    this.inputNewConfirmed = await this.fetchData('newCases');
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
            data: this.getConfirmedCases(countries),
            scales: ['linear', 'log']
          },
          {
            title: 'Daily New cases',
            data: this.getConfirmedCases(countries, { newCases: true })
          }
        ]
      };
    },
    async fetchData(dataset) {
      // list of possible datasets. Used for mappping
      const datasets = ['totalCases', 'newCases', 'totalDeaths', 'newDeaths'];
      const source = this.source;
      // store loaded source/datasets on instance. Only fetch first time
      if (!this.input[`${source}-${dataset}`]) {
        const promises = [];
        const files = this.files[source];

        // fetch all or specific dataset
        if (dataset === 'all') {
          files.forEach(function(url) {
            promises.push(d3.csv(url, d3.autoType));
          });
        } else {
          promises.push(d3.csv(files[datasets.indexOf(dataset)], d3.autoType));
        }

        // make request
        const result = await Promise.all(promises);

        // handle request result: use datsets map to store result
        result.forEach((set, i) => {
          const key = dataset === 'all' ? datasets[i] : dataset;
          this.input[`${source}-${key}`] = set.map(d => {
            // Add hoc tmp fix
            if (
              !Object.prototype.hasOwnProperty.call(
                d,
                'United States of America'
              ) &&
              Object.prototype.hasOwnProperty.call(d, 'United States')
            ) {
              d['United States of America'] = d['United States'];
              delete d['United States'];
            }
            // console.log(d);
            return d;
          });
          // this.input[`${source}-${key}`] = set;
        });
      }

      return dataset === 'all'
        ? this.input
        : this.input[`${source}-${dataset}`];
    },
    setView(val) {
      if (val !== this.view) {
        this.view = val;
        const query = { view: val };
        if (val === 'country') {
          query.c1 = this.selection[0];
          // query.c2 = this.selection[1];
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
        c1: set === 1 ? val : this.selection[0]
        // c2: set === 2 ? val : this.selection[1]
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

.dropdown .vs__deselect,
.dropdown .vs__clear,
.dropdown .vs__open-indicator {
  fill: rgba(255, 255, 255, 0.75);
}

.dropdown .vs__selected,
.dropdown .vs__dropdown-toggle {
  border-color: rgba(255, 255, 255, 0.25);
}
</style>
