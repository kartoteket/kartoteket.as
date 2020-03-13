<template>
  <article class="flex flex-col">
    <div v-if="isLoading" class="flex justify-center items-center w-full h-screen">
      <scale-loader :loading="isLoading" color="#444" class="mx-auto" />
    </div>
    <div v-if="!isLoading">
      <article v-for="(block, i) in chartSeries" :key="i">
        <div v-for="(chart, j) in block.charts" :key="j" class="mb-4" :class="(j%2) ? '' : ''">
          <h2 v-if="chart.title" class="text-sm uppercase text-sm tracking-wide text-gray-800 border-b-2 border-gray-500 mr-8 mt-4">
            {{ chart.title }}
          </h2>
          <multi-line-chart :id="`${i}-${j}-${Math.floor(Math.random() * 100)}`" :series="chart.data" :config="{colorScale, textColor: '#444', aspectRatio: (j%2) ? 0.4 : 0.5}" />
        </div>
      </article>
    </div>
    <p v-if="!isLoading" class="text-xs text-right">
      Kilde: <a class="underline" target="_parent" href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a>. 
      Grafikk: <a class="underline" target="_parent" href="https://kartoteket.as">Kartoteket</a>.
      Oppdatert {{ lastUpdate }}.
    </p>
  </article>
</template>
<script>
import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import * as moment from 'moment';
import 'array-flat-polyfill';

import ScaleLoader from 'vue-spinner/src/PulseLoader.vue';
import MultiLineChart from '@/components/charts/MultiLineChart';
// import PlotMapChart from '@/components/charts/PlotMapChart';

const d3 = Object.assign({}, d3Lib, d3Array);

export default {
  layout: 'embed',
  components: {
    MultiLineChart,
    ScaleLoader
  },
  data() {
    return {
      isLoading: true,
      maps: {},
      selection: ['Norway', ''],
      sub: 'both',
      input: [],
      margin: {
        right: 130,
        left: 120,
        top: 20,
        bottom: 10
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
    dates() {
      return Array.from(new Set(this.getCountries().map(d => d.date)))
        .map(d => moment(d, 'M/D/YY'))
        .sort(d3.ascending);
    },
    lastUpdate() {
      return moment(this.dates[this.dates.length - 1], 'M/D/YY').format('ll');
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

    this.input = await this.fetchData();
    this.isLoading = false;
  },
  methods: {
    getTotals(input) {
      if (input.length < 1) return [];
      const countries = Array.isArray(input) ? input : [input];
      return countries.map(country => {
        return {
          name: this.printCountryName(country),
          values: this.getCountries(country).map(d => {
            return { date: d.date, value: d.confirmed };
          })
        };
      });
    },
    getNewCases(input, limit) {
      if (input.length < 1) return [];
      let data = d3.groups(this.getCountries(input), d => d.name.toLowerCase());
      if (limit > 0) {
        data = data.slice(0, limit);
      }
      return data.map((d, i) => {
        return {
          name: this.printCountryName(d[0]),
          values: d[1].map(d => {
            return {
              date: d.date,
              value: d.change.confirmed > 10000 ? 1000 : d.change.confirmed
            };
          })
        };
      });
    },
    getCountries(filter) {
      // if filter we only use  a selection of the data
      let selection = [];
      let countries = [];
      if (filter) {
        countries = Array.isArray(filter) ? filter : [filter];
        selection = this.filterByCountry(countries, this.input);
      } else {
        selection = this.input;
      }

      // only get last 2 weeks
      // @todo: ad hoc fix her. Do a search from the left of first value
      console.log(countries);
      const cutoff = countries.includes('taiwan*') ? 20 : 2;

      selection = selection.filter(d => {
        const start = moment().subtract(cutoff, 'weeks');
        return moment(d.date, 'M/D/YY').isSameOrAfter(start);
      });

      const grouped = this.groupByCountry(selection); // group values on country level
      const extended = this.addDailyValues(grouped.data); // add changes (daily new numbers)
      return extended;
    },
    filterByCountry(_countries, data, exclude = false) {
      const countries = _countries.map(d => d.toLowerCase());
      if (exclude) {
        return data.filter(d => !countries.includes(d.country.toLowerCase()));
      }
      return data.filter(d => countries.includes(d.country.toLowerCase()));
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
            confirmed: d3.sum(v, d => d.confirmed)
            // deaths: d3.sum(v, d => d.deaths),
            // recovered: d3.sum(v, d => d.recovered)
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
            confirmed: date.value.confirmed ? date.value.confirmed : 0
            // deaths: date.value.deaths,
            // recovered: date.value.recovered
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
            confirmed: d.confirmed
            // deaths: d.deaths,
            // recovered: d.recovered
          };
          if (i > 0) {
            change.confirmed = d.confirmed - element[i - 1].confirmed;
            // change.deaths = d.deaths - element[i - 1].deaths;
            // change.recovered = d.recovered - element[i - 1].recovered;
          }
          element[i].change = change;
        });
      }
      return Array.from(grouped, ([key, value]) => value).flat();
    },
    createChartSeries({ title, countries }) {
      const charts = [];
      if (this.sub !== 'new') {
        const total = {
          title: 'Totalt bekreftet tilfeller',
          data: this.getTotals(countries)
        };
        charts.push(total);
      }
      if (this.sub !== 'total') {
        const daily = {
          title: 'Nye bekreftet tilfeller',
          data: this.getNewCases(countries)
        };
        charts.push(daily);
      }
      return {
        title,
        charts
      };
    },
    printCountryName(name) {
      if (name === 'norway') return 'Norge';
      if (name === 'taiwan*') return 'Taiwan';
      return this.capitalize(name);
    },
    capitalize(string) {
      return string
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    async fetchData() {
      const files = [
        'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'
        // 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
        // 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
      ];

      // load all data (3 different raw csv files)
      const result = await Promise.all(
        files.map(url => d3.csv(url, d3.autoType))
      );
      // load data segments matching the 3 files
      const segments = ['confirmed'];
      // const segments = ['confirmed', 'deaths', 'recovered'];

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
    }
  }
};
</script>
