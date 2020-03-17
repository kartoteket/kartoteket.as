<template>
  <article class="flex flex-col">
    <div v-if="isLoading" class="flex justify-center items-center w-full h-screen">
      <scale-loader :loading="isLoading" color="#444" class="mx-auto" />
    </div>
    <div v-if="!isLoading">
      <article v-for="(block, i) in chartSeries" :key="i">
        <div v-for="(chart, j) in block.charts" :key="j" class="mb-4">
          <h2 v-if="chart.title" class="text-sm uppercase text-sm tracking-wide text-gray-800 border-b-2 border-gray-500 mt-4">
            {{ chart.title }}
          </h2>
          <multi-line-chart :id="`${i}-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :config="{colorScale, textColor: '#444', aspectRatio: (j%2) ? 0.4 : 0.52, margin}" />
        </div>
      </article>
    </div>
    <p v-if="!isLoading" class="text-xs text-right pr-4">
      Kilde: <a class="underline" target="_parent" href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a>. 
      Grafikk: <a class="underline" target="_parent" href="https://kartoteket.as">Kartoteket</a>.
      Oppdatert {{ lastUpdate }}.
    </p>
  </article>
</template>
<script>
import * as d3 from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import 'array-flat-polyfill';

import ScaleLoader from 'vue-spinner/src/PulseLoader.vue';
import lookup from '@/utils/countryNames.js';
import MultiLineChart from '@/components/charts/MultiLineChart';

export default {
  layout: 'embed',
  components: {
    MultiLineChart,
    ScaleLoader
  },
  data() {
    return {
      isLoading: true,
      selection: ['Norway', ''],
      sub: 'both',
      inputTotalConfirmed: [],
      inputNewConfirmed: [],
      inputTotalDeaths: [],
      inputNewDeaths: [],
      margin: {
        right: 20,
        left: 50,
        top: 20,
        bottom: 20
      }
    };
  },
  computed: {
    colorScale() {
      return d3.scaleOrdinal(d3.schemeSet2); // d3.schemeTableau10
    },
    chartSeries() {
      return [
        this.createChartSeries({
          // title: 'Nordic Countries',
          countries: this.selection
        })
      ];
    },
    lastUpdate() {
      const dates = this.inputTotalConfirmed.map(d => d.date);
      return d3.timeFormat('%d. %b')(dates[dates.length - 1]);
    }
  },
  async mounted() {
    if (this.$route.params.slug) {
      const selection = this.$route.params.slug
        .split(',')
        .map(d => d.trim().toLowerCase());
      // nb: here we can also reate cusmtom selctions like fx 'nordic'
      if (Array.isArray(selection)) {
        this.selection = selection;
      }
    }
    if (this.$route.params.sub) {
      this.sub = this.$route.params.sub;
    }

    this.inputTotalConfirmed = await this.fetchTotalConfirmed();
    this.inputNewConfirmed = await this.fetchNewConfirmed();
    this.isLoading = false;
  },
  methods: {
    getConfirmedCases(selection, { newCases = false } = {}) {
      if (selection.length < 1) return []; // if no selection, abort
      selection = Array.isArray(selection) ? selection : [selection]; // cast to array
      const input = newCases
        ? this.inputNewConfirmed
        : this.inputTotalConfirmed;

      if (selection.includes('outsidechina')) {
        const worldTotals = this.getWorldConfirmed({
          includeChina: false,
          newCases
        });
        return [worldTotals];
      }
      if (selection.includes('world')) {
        const worldTotals = this.getWorldConfirmed({ newCases });
        return [worldTotals];
      }

      const output = selection.map(country => {
        const values = input.map(d => {
          // ad hoc lookups
          if (country === 'us') country = 'united states';

          return {
            date: d.date,
            value: d[country]
          };
        });
        return {
          name: this.printCountryName(country),
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
          value: includeChina ? d.world : d.world - d.china
        };
      });
      return {
        name: includeChina ? 'verden' : 'utenfor Kina',
        values
      };
    },
    createChartSeries({ title, countries }) {
      const charts = [];
      // @todo: split this up

      if (this.sub === 'combined') {
        const combo = this.getConfirmedCases(countries)
          .map(d => {
            d.name =
              countries.length > 1
                ? `${d.name}, totalt antall`
                : `Totalt antall, ${d.name}`;
            return d;
          })
          .concat(
            this.getConfirmedCases(countries, { newCases: true }).map(d => {
              d.name =
                countries.length > 1
                  ? `${d.name}, nye tilfeller`
                  : `Nye tilfeller, ${d.name}`;
              return d;
            })
          );
        charts.push({
          title: 'Antall bekreftede tilfeller',
          data: combo
        });
        return {
          title,
          charts
        };
      }

      if (this.sub !== 'new') {
        const total = {
          title: 'Totalt antall bekreftede tilfeller',
          data: this.getConfirmedCases(countries)
        };
        charts.push(total);
      }
      if (this.sub !== 'total') {
        const daily = {
          title: 'Bekreftede nye tilfeller',
          data: this.getConfirmedCases(countries, { newCases: true })
        };
        charts.push(daily);
      }

      return {
        title,
        charts
      };
    },
    printCountryName(name) {
      return this.capitalize(lookup(name));
    },
    capitalize(string) {
      if (string.length < 4) {
        return string.toUpperCase();
      }
      return string
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
    },
    lowerCaseKeys(obj) {
      let key;
      const keys = Object.keys(obj);
      let n = keys.length;
      const newObj = {};
      while (n--) {
        key = keys[n];
        newObj[key.toLowerCase()] = obj[key];
      }
      return newObj;
    },
    async fetchTotalConfirmed() {
      const input = await d3.csv(
        'https://covid.ourworldindata.org/data/total_cases.csv',
        d3.autoType
      );
      const lowerCasedKeys = input.map(d => this.lowerCaseKeys(d));
      return lowerCasedKeys;
    },
    async fetchNewConfirmed() {
      const input = await d3.csv(
        'https://covid.ourworldindata.org/data/new_cases.csv',
        d3.autoType
      );
      const lowerCasedKeys = input.map(d => this.lowerCaseKeys(d));
      return lowerCasedKeys;
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
    }
  }
};
</script>
