<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header">
        {{ page.title }}
      </h1>
      <div class="rtf md:text-lg leading-relaxed mb-4">
        <p>{{ page.description }}</p>
      </div>
      <div v-if="isLoading" class="flex justify-center items-center w-full h-screen">
        <scale-loader :loading="isLoading" color="#fff" class="mx-auto" />
      </div>


      <button class="bg-white-700 hover:bg-white-900 text-gray-900 py-1 px-3 rounded mr-4" :class="{'bg-white-full' : view === 'country'}" @click.stop="setView('country')">
        Select Country
      </button>
      <button class="bg-white-700 hover:bg-white-900 text-gray-900 py-1 px-3 rounded mr-4" :class="{'bg-white-full' : view === 'world'}" @click.stop="setView('world')">
        World
      </button>
      <button class="bg-white-700 hover:bg-white-900 text-gray-900 py-1 px-3 rounded mr-4" :class="{'bg-white-full' : view === 'groups'}" @click.stop="setView('groups')">
        Selected Groups
      </button>
    </header>
    <article>
      <!-- <plot-map-chart v-if="false" :chart-data="chartData" /> -->
    </article>
    <div v-if="!isLoading" class="lg:flex flex-wrap">
      <article v-show="view === 'country'" class="lg:w-1/2 mb-12">
        <v-select v-model="selection" class="dropdown lg:mr-8" :options="countriesList" value="{default:'Norway'}" />
        <div class="mb-4">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            Total confirmed cases
          </h2>
          <multi-line-chart v-if="selectTotals.length" id="custom-totals" :series="selectTotals" :config="{colorScale, aspectRatio: 0.5}" />
        </div>
        <div class="mb-4">
          <h2 class="text-sm uppercase text-sm tracking-wide text-white-700 border-b-2 border-white-500 mr-8 mt-4">
            Daily new confirmed cases
          </h2>
          <multi-line-chart v-if="selectSeries.length" id="custom-new" :series="selectSeries" :config="{colorScale, aspectRatio: 0.4}" />
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
    <p v-if="!isLoading">
      Data Source: <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a> (<a href="https://github.com/CSSEGISandData/COVID-19">gitHub files</a>). Last data update from {{ lastUpdate }}.
    </p>
  </article>
</template>
<script>
/* eslint-disable no-unused-vars */

import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import * as moment from 'moment';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import ScaleLoader from 'vue-spinner/src/PulseLoader.vue';
import head from '~/mixins/head.js';
import MultiLineChart from '@/components/charts/MultiLineChart';
// import PlotMapChart from '@/components/charts/PlotMapChart';

import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';

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
      maps: {},
      selection: 'Norway',
      input: [],
      margin: {
        right: 130,
        left: 120,
        top: 20,
        bottom: 10
      },
      page: {
        title: 'Corona - Confirmed cases of COVID-19 ',
        slug: 'features/corona/daily',
        description:
          'Charts showing the timeline trend of total confirmed cases and new daily registered confirmed cases of COVID-19 in affected countries.',
        url: 'https://kartoteket.as/features/corona/daily',
        image: 'https://kartoteket.as/preview-corona-charts.png'
      }
    };
  },
  computed: {
    colorScale() {
      return d3.scaleOrdinal(d3.schemeSet2); // d3.schemeTableau10
    },
    selectSeries() {
      return this.getNewCases(this.selection);
    },
    selectTotals() {
      return this.getTotals(this.selection);
    },
    worldSeries() {
      return {
        title: 'World',
        charts: [
          {
            title: 'Total confirmed cases',
            data: [this.getWorldTotals()]
          },
          {
            title: 'Daily new confirmed cases',
            data: [this.getWorldNew()]
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
            data: [this.getWorldTotals(false)]
          },
          {
            title: 'Daily new confirmed cases',
            data: [this.getWorldNew(false)]
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
          title: 'Most effected (excluding China)',
          countries: ['Iran', 'South Korea', 'Italy']
        })
        // this.createChartSeries({
        //   title: 'China',
        //   countries: ['Mainland China']
        // }),
        // this.createChartSeries({
        //   title: 'US',
        //   countries: ['US']
        // })
      ];
    },
    // parsedData() {
    //   // create copy (ref: https://observablehq.com/@tmcw/observable-anti-patterns-and-code-smells#mutation )
    //   const data = this.input.slice();

    //   // filter the data
    //   // 'World', 'World Excluding China', 'Europe'
    //   let filtered;
    //   if (this.selection === 'World Excluding China') {
    //     filtered = this.filterByCountry(['Mainland China'], data, true);
    //   } else if (this.selection === 'World') {
    //     filtered = data;
    //   } else {
    //     filtered = this.filterByCountry([this.selection], data);
    //   }

    //   return this.groupByCountry(filtered);
    // },
    // chartData() {
    //   return this.view === 'map'
    //     ? this.getLatest(this.getCountries())
    //     : this.getCountries();
    // },
    dates() {
      return Array.from(new Set(this.getCountries().map(d => d.date)))
        .map(d => moment(d, 'M/D/YY'))
        .sort(d3.ascending);
    },
    lastUpdate() {
      return moment(this.dates[this.dates.length - 1]).format('ll');
    },
    // daysCount() {
    //   // @todo: re-facotr so that we can delete this.parsedData !
    //   return this.parsedData.count;
    // },
    countriesList() {
      return Array.from(new Set(this.input.map(d => d.country))).sort(
        d3.ascending
      );
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

    this.input = await this.fetchData();
    this.isLoading = false;
  },
  // async asyncData({ $axios }) {
  //   const files = [
  //     'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
  //     'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
  //     'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
  //   ];

  //   // load all data (3 different raw csv files)
  //   let input = [];
  //   let response = [];
  //   let result = [];

  //   try {
  //     response = await Promise.all(
  //       files.map(url =>
  //         $axios.get(url, {
  //           data: {},
  //           headers: { 'Content-Type': 'text/plain' }
  //         })
  //       )
  //     );
  //   } catch (err) {
  //     console.error(err); // TypeError: failed to fetch
  //   }

  //   if (response.length > 0) {
  //     result = response.map(resp => {
  //       if (resp.status === 200 && resp.data) {
  //         return d3.csvParse(resp.data, d3.autoType);
  //       }
  //     });
  //   }
  //   // console.log(result.length);
  //   // load data segments matching the 3 files
  //   const segments = ['confirmed', 'deaths', 'recovered'];

  //   // her we loop through all the raw input data and map the `segments`from the 3 input fields
  //   // we save lat/lng as pos array
  //   // output is nested array
  //   if (result.length > 0) {
  //     input = result
  //       .map((array, i) => {
  //         return array.map((obj, j) => {
  //           const names = {
  //             country: obj['Country/Region'],
  //             state: obj['Province/State']
  //           };
  //           delete obj['Province/State'];
  //           delete obj['Country/Region'];
  //           const { Lat, Long, ...rest } = obj;

  //           return Object.entries(rest).map(([key, value]) => {
  //             obj = {
  //               ...names,
  //               pos: [Long, Lat],
  //               date: key
  //             };
  //             obj[segments[i]] = value;
  //             return obj;
  //           });
  //         });
  //       })
  //       .flat(2);
  //   }
  //   return { input };
  // },
  methods: {
    getTotals(input) {
      const countries = Array.isArray(input) ? input : [input];
      return countries.map(country => {
        return {
          name: country,
          values: this.getCountries(country).map(d => {
            return { date: d.date, value: d.confirmed };
          })
        };
      });
    },
    getNewCases(input, limit) {
      let data = d3.groups(this.getCountries(input), d => d.name);
      if (limit > 0) {
        data = data.slice(0, limit);
      }
      return data.map((d, i) => {
        return {
          name: d[0],
          values: d[1].map(d => {
            return {
              date: d.date,
              value: d.change.confirmed // d.change.confirmed > 10000 ? 1000 : d.change.confirmed
            };
          })
        };
      });
    },
    getLatest(input) {
      return input
        .filter(d => moment(d.date).isSame(this.dates[this.dates.length - 1]))
        .sort((a, b) => d3.ascending(a.length, b.length));
    },
    getCountries(filter) {
      let selection = [];
      if (filter) {
        const countries = Array.isArray(filter) ? filter : [filter];
        selection = this.filterByCountry(countries, this.input);
      } else {
        selection = this.input;
      }
      const grouped = this.groupByCountry(selection);
      const extended = this.addDailyValues(grouped.data);
      return extended;
    },
    filterByCountry(countries, data, exclude = false) {
      if (exclude) {
        return data.filter(d => !countries.includes(d.country));
      }
      return data.filter(d => countries.includes(d.country));
    },
    world(includeChina = true) {
      const data = this.input.filter(
        d => d.country !== 'Mainland China' || includeChina
      );

      // Note, than when rolling up to country level, we loose data on state and lat/lng position
      const totals = d3
        .nest()
        .key(d => d.date)
        .rollup(v => {
          return {
            confirmed: d3.sum(v, d => d.confirmed),
            deaths: d3.sum(v, d => d.deaths),
            recovered: d3.sum(v, d => d.recovered)
          };
        })
        .entries(data);

      totals.forEach(({ value }, i) => {
        const change = {
          confirmed: value.confirmed,
          deaths: value.deaths,
          recovered: value.recovered
        };
        if (i > 0) {
          change.confirmed = value.confirmed - totals[i - 1].value.confirmed;
          change.deaths = value.deaths - totals[i - 1].value.deaths;
          change.recovered = value.recovered - totals[i - 1].value.recovered;
        }
        totals[i].change = change;
      });

      return totals;
    },
    getWorldTotals(includeChina = true) {
      return {
        name: includeChina ? 'World' : 'World excluding China',
        values: this.world(includeChina).map(d => {
          return { date: d.key, value: d.value.confirmed };
        })
      };
    },
    getWorldNew(includeChina = true) {
      return {
        name: includeChina ? 'World' : 'World excluding China',
        values: this.world(includeChina).map(d => {
          return { date: d.key, value: d.change.confirmed };
        })
      };
    },
    groupByCountry(input) {
      // Note, than when rolling up to country level, we loose data on state and lat/lng position
      const nested = d3
        .nest()
        .key(d => d.country)
        .key(d => d.date)
        .rollup(v => {
          return {
            pos: d3.min(v, d => d.pos), // why .min() ??!?
            confirmed: d3.sum(v, d => d.confirmed),
            deaths: d3.sum(v, d => d.deaths),
            recovered: d3.sum(v, d => d.recovered)
          };
        })
        .entries(input);

      // here we un-nest the data by mapping all the values to key/value pair
      const mapped = nested.map((country, index) =>
        country.values.map(date => {
          return {
            name: country.key,
            date: date.key,
            pos: date.value.pos,
            confirmed: date.value.confirmed ? date.value.confirmed : 0,
            deaths: date.value.deaths,
            recovered: date.value.recovered
          };
        })
      );

      // count number of days there are registered confirmed cases in each country
      const count = mapped.map(country => {
        const count = d3.count(country, d => d.confirmed);
        const name = country[0].name;
        return { name, count };
      });

      // return a flattened array of the data, just china, no china
      // and a count of days with registrations used to sort
      return {
        data: mapped.flat(),
        count: count
      };
    },
    addDailyValues(input) {
      // group by country and calculate the relative change  between each days.
      // We could/should probably do this in the initial parsing, befor we flatten that array
      const grouped = d3.group(input, d => d.name);
      const iterator = grouped.values();
      for (const element of iterator) {
        element.map((d, i) => {
          const change = {
            confirmed: d.confirmed,
            deaths: d.deaths,
            recovered: d.recovered
          };
          if (i > 0) {
            change.confirmed = d.confirmed - element[i - 1].confirmed;
            change.deaths = d.deaths - element[i - 1].deaths;
            change.recovered = d.recovered - element[i - 1].recovered;
          }
          element[i].change = change;
        });
      }
      return Array.from(grouped, ([key, value]) => value).flat();
    },
    createChartSeries({ title, countries }) {
      return {
        title,
        charts: [
          {
            title: 'Total confirmed cases',
            data: this.getTotals(countries)
          },
          {
            title: 'Daily New cases',
            data: this.getNewCases(countries)
          }
        ]
      };
    },
    async fetchData() {
      const files = [
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
      ];

      // load all data (3 different raw csv files)
      const result = await Promise.all(
        files.map(url => d3.csv(url, d3.autoType))
      );
      // load data segments matching the 3 files
      const segments = ['confirmed', 'deaths', 'recovered'];

      // her we loop through all the raw input data and map the `segments`from the 3 input fields
      // we save lat/lng as pos array
      // output is nested array
      const input = result
        .map((array, i) => {
          return array.map((obj, j) => {
            const names = {
              country: obj['Country/Region'],
              state: obj['Province/State']
            };
            delete obj['Province/State'];
            delete obj['Country/Region'];
            const { Lat, Long, ...rest } = obj;

            return Object.entries(rest).map(([key, value]) => {
              obj = {
                ...names,
                pos: [Long, Lat],
                date: key
              };
              obj[segments[i]] = value;
              return obj;
            });
          });
        })
        .flat(2);
      return input;
    },
    setView(val) {
      if (val !== this.view) {
        this.view = val;
        this.$router.replace({
          path: this.$route.path,
          query: { view: val }
        });
      }
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
