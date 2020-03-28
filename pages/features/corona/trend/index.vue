<template>
  <section class="flex flex-col md:-mt-10">
    <header class="mb-8">
      <h1 class="main-header mb-4 text-xl md:text-4xl">
        {{ page.title }}
      </h1>
      <div v-if="isLoading" class="flex justify-center items-center w-full h-screen">
        <scale-loader :loading="isLoading" color="#fff" class="mx-auto" />
      </div>
      <div v-if="!isLoading" class="flex flex-wrap">
        <nav class="flex flex-center">
          <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : view === 'country'}" @click.stop="setView('country')">
            Contry Selector
          </button>
          <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : view === 'world'}" @click.stop="setView('world')">
            World
          </button>
          <button class="bg-orange-100 hover:bg-orange-800 hover:text-white-full text-gray-900 py-1 px-3 rounded mr-4 mb-2" :class="{'bg-orange-800 text-white-full' : view === 'groups'}" @click.stop="setView('groups')">
            Collections
          </button>
        </nav>
        <div class="md:ml-8 md:flex md:-mt-2">
          <div class="mr-8">
            <h2 class="w-16 hidden md:block text-sm uppercase text-sm text-white-800 text-left tracking-wide">
              Show
            </h2>
            <ul class="flex">
              <li class="mr-3">
                <input id="cases" v-model="dimension" type="radio" value="cases" class="mr-1">
                <label for="cases">Confirmed cases</label>
              </li>
              <li>
                <input id="deaths" v-model="dimension" type="radio" value="deaths" class="mr-1">
                <label for="deaths">Registered deaths</label>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="w-16 hidden md:block text-sm uppercase text-sm text-white-800 text-left tracking-wide">
              Source
            </h2>
            <ul class="flex">
              <li class="mr-3">
                <input id="jh" v-model="source" type="radio" value="johnshopkins" class="mr-1">
                <label for="jh">Johns Hopkins</label>
              </li>
              <li>
                <input id="owid" v-model="source" type="radio" value="owid" class="mr-1">
                <label for="owid">ECDC / OWID</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <main v-if="!isLoading" class="lg:flex flex-wrap justify-center">
      <section v-show="view === 'country'" class="lg:w-4/6 mb-12">
        <v-select v-model="selection[0]" class="dropdown lg:mr-8" :options="countriesList" :multiple="true" @input="setSelection($event)" />
        <chart-container
          v-if="selectedTotalCases[0].length"
          id="custom-totals"
          :title="`Total confirmed ${dimension}`"
          :scale-options="['linear','log']"
          :series="selectedTotalCases[0]"
          :config="Object.assign({aspectRatio: 0.5}, chartConfig)"
        />
        <chart-container
          v-if="selectedNewCases[0].length"
          id="custom-new"
          :title="`Daily new confirmed ${dimension}`"
          :series="selectedNewCases[0]"
          :config="Object.assign({aspectRatio: 0.5}, chartConfig)"
        />
      </section>
      <section v-show="view === 'world'" class="lg:w-4/6 mb-12">
        <h1 class="text-lg mb-6">
          {{ worldSeries.title }}
        </h1>
        <chart-container
          v-for="(chart, j) in worldSeries.charts" 
          :id="`world-${j}-${Math.floor(Math.random() * 100)}`"
          :key="`world-${j}`"
          :title="chart.title"
          :scale-options="chart.scales ? chart.scales : null"
          :series="chart.data"
          :config="chart.config"
        />
      </section>
      <section v-show="view === 'world'" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ worldOutsideChinaSeries.title }}
        </h1>
        <chart-container
          v-for="(chart, j) in worldOutsideChinaSeries.charts"
          :id="`outsidechina-${j}-${Math.floor(Math.random() * 100)}`"
          :key="`outsidechina-${j}`"
          :title="chart.title"
          :scale-options="chart.scales ? chart.scales : null"
          :series="chart.data"
          :config="chart.config"
        />
      </section>
      <section v-for="(block, i) in chartSeries" v-show="view === 'groups'" :key="i" class="lg:w-1/2 mb-12">
        <h1 class="text-lg mb-6">
          {{ block.title }}
        </h1>
        <chart-container
          v-for="(chart, j) in block.charts"
          :id="`block-${i}-${j}-${Math.floor(Math.random() * 100)}`"
          :key="`block-${j}`"
          :title="chart.title"
          :scale-options="chart.scales ? chart.scales : null"
          :series="chart.data"
          :config="Object.assign({aspectRatio: (j%2) ? 0.5 : 0.5}, chartConfig)"
        />
      </section>
    </main>
    <footer v-if="!isLoading" class="main-col mx-auto rtf rtf--tight XXmd:text-lg leading-relaxed mb-4">
      <p>{{ page.description }}</p>
      <p v-if="!isLoading && source === 'johnshopkins'" class="rtf">
        Data Source: <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a> (<a href="https://github.com/CSSEGISandData/COVID-19">gitHub files</a>). Updated {{ lastUpdate }}.
      </p>
      <p v-if="!isLoading && source === 'owid'" class="rtf">
        Data Source: <a href="https://ourworldindata.org/coronavirus-source-data">European Centre for Disease Prevention and Control via Our World in Data</a>. Updated {{ lastUpdate }}.
      </p>
      <p class="text-xs mb-6">
        <span v-show="source === 'johnshopkins'">
          <strong>Note:</strong> Johns Hopkins CSSE data for new cases on many countries, including Italy, is missing for March 12th, <a class="link" href="https://github.com/CSSEGISandData/COVID-19/issues/650">see issues</a>.
        </span>
        &nbsp;
      </p>
    </footer>
  </section>
</template>
<script>
import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import 'array-flat-polyfill';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import ScaleLoader from 'vue-spinner/src/PulseLoader.vue';
// import isoToName from '@/utils/countryMap.js';
import ChartContainer from '@/components/charts/ChartContainer';

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
    ChartContainer,
    ScaleLoader,
    vSelect
  },
  mixins: [head],
  data() {
    return {
      isLoading: true,
      view: 'world',
      selection: ['Norway'],
      input: {},
      inputTotal: [],
      inputNew: [],
      margin: {
        right: 80,
        left: 10,
        top: 20,
        bottom: 20
      },
      dimension: 'cases',
      source: 'johnshopkins', // 'owid',
      files: {
        owid: [
          'https://covid.ourworldindata.org/data/ecdc/total_cases.csv',
          'https://covid.ourworldindata.org/data/ecdc/new_cases.csv',
          'https://covid.ourworldindata.org/data/ecdc/total_deaths.csv',
          'https://covid.ourworldindata.org/data/ecdc/new_deaths.csv'
        ],
        johnshopkins: [
          'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/total_cases_by_country.csv',
          'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/new_cases_by_country.csv',
          'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/total_deaths_by_country.csv',
          'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/new_deaths_by_country.csv'
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
    // sourceFiles(){
    //   const rootUrl ?
    // },
    chartConfig() {
      return {
        colorScale: this.colorScale,
        yAxis: 'right',
        margin: this.margin
      };
    },
    colorScale() {
      return d3.scaleOrdinal(d3.schemeSet3); // d3.schemeOranges[9].reverse()
    },
    selectedNewCases() {
      return [this.getConfirmedCases(this.selection[0], { newCases: true })];
    },
    selectedTotalCases() {
      return [this.getConfirmedCases(this.selection[0])];
    },
    worldSeries() {
      return {
        title: 'World',
        charts: [
          {
            title: `Total confirmed ${this.dimension}`,
            data: [this.getWorldConfirmed()],
            scales: ['linear', 'log'],
            config: Object.assign({ aspectRatio: 0.5 }, this.chartConfig)
          },
          {
            title: `Daily new confirmed ${this.dimension}`,
            data: [this.getWorldConfirmed({ newCases: true })],
            config: Object.assign({ aspectRatio: 0.5 }, this.chartConfig)
          }
        ]
      };
    },
    worldOutsideChinaSeries() {
      return {
        title: 'World outside China',
        charts: [
          {
            title: `Total confirmed ${this.dimension}`,
            data: [this.getWorldConfirmed({ includeChina: false })],
            scales: ['linear', 'log'],
            config: Object.assign({ aspectRatio: 0.5 }, this.chartConfig)
          },
          {
            title: `Daily new confirmed ${this.dimension}`,
            data: [
              this.getWorldConfirmed({ includeChina: false, newCases: true })
            ],
            config: Object.assign({ aspectRatio: 0.5 }, this.chartConfig)
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
            'Italy',
            'Spain',
            'Germany',
            'Iran',
            'United States of America'
          ]
        })
      ];
    },
    lastUpdate() {
      const dates = this.inputTotal.map(d => d.date);
      return d3.timeFormat('%d. %b')(dates[dates.length - 1]);
    },
    countriesList() {
      const list = Object.keys(this.inputTotal[0]);
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
    async source() {
      this.inputTotal = await this.fetchData('total');
      this.inputNew = await this.fetchData('new');
    },
    async dimension() {
      this.inputTotal = await this.fetchData('total');
      this.inputNew = await this.fetchData('new');
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
    this.inputTotal = await this.fetchData('total');
    this.inputNew = await this.fetchData('new');
    this.isLoading = false;
  },
  methods: {
    getConfirmedCases(selection, { newCases = false } = {}) {
      if (selection.length < 1) return []; // if no selection, abort
      selection = Array.isArray(selection) ? selection : [selection]; // cast to array
      const input = newCases ? this.inputNew : this.inputTotal;
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
      const input = newCases ? this.inputNew : this.inputTotal;
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
            title: `Total confirmed ${this.dimension}`,
            data: this.getConfirmedCases(countries),
            scales: ['linear', 'log']
          },
          {
            title: `Daily new ${this.dimension}`,
            data: this.getConfirmedCases(countries, { newCases: true })
          }
        ]
      };
    },
    async fetchData(_dataset) {
      const startDate = new Date('Wed Jan 21 2020 01:00:00 GMT+0100'); // Fixed date to get data from

      const dataset = `${_dataset}-${this.dimension}`; // (eg "total-deaths")
      // list of possible datasets. Used for mappping
      const datasets = [
        'total-cases',
        'new-cases',
        'total-deaths',
        'new-deaths'
      ];
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
          this.input[`${source}-${key}`] = set
            .filter(d => d.date > startDate) // since source have different tima ranges, cut off at set startDate
            .map(d => {
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
