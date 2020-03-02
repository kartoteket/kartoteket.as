<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header">
        {{ page.title }}
      </h1>
      <div class="rtf md:text-lg leading-relaxed">
        <p>{{ page.description }}</p>
      </div>
      <div class="rtf">
        <p>You can see the details of a specific country by selecting it in the first chart country selector.</p>
        <p>Data Source: <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a> (<a href="https://github.com/CSSEGISandData/COVID-19">gitHub files</a>)</p>
      </div>
    </header>
    <article>
      <plot-map-chart v-if="false" :chart-data="chartData" />
    </article>
    <div class="flex flex-wrap">
      <article class="lg:w-1/2 mb-12">
        <v-select v-model="selection" class="dropdown mx-8" :options="countriesList" value="{default:'Norway'}" />
        <multi-line-chart id="custom" :series="series" />
      </article>
      <article v-for="(set, i) in chartSeries" :key="i" class="lg:w-1/2 mb-12">
        <h1>{{ set.title }}</h1>
        <multi-line-chart :id="i+1" :series="set.data" />
      </article>
    </div>
  </article>
</template>
<script>
/* eslint-disable no-unused-vars */

import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import * as moment from 'moment';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import head from '~/mixins/head.js';
import MultiLineChart from '@/components/charts/MultiLineChart';
import PlotMapChart from '@/components/charts/PlotMapChart';

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
    PlotMapChart,
    vSelect
  },
  mixins: [head],
  data() {
    return {
      maps: {},
      selection: 'Norway',
      view: 'map',
      world: {},
      input: [],
      margin: {
        right: 130,
        left: 120,
        top: 20,
        bottom: 10
      },
      page: {
        title: 'Corona - Daily COVID-19 registrations',
        slug: 'features/corona/daily',
        description:
          'Charts showing the timeline trend of new daily registered confirmed cases of COVID-19 in different countries.',
        url: `https://kartoteket.as/features/corona/daily`
      }
    };
  },
  computed: {
    chartSeries() {
      const scandinavia = {
        title: 'Nordic Countries',
        data: this.getSeries(
          this.getCountries(['Norway', 'Sweden', 'Denmark', 'Finland'])
        )
      };
      const keyCountries = {
        title: 'Key Contries',
        data: this.getSeries(
          this.getCountries([
            'Mainland China',
            'Iran',
            'South Korea',
            'Italy',
            'Japan'
          ])
        )
      };
      const US = {
        title: 'US',
        data: this.getSeries(this.getCountries('US'))
      };

      return [scandinavia, keyCountries, US];
    },
    width() {
      return d3.min([300, 1600]); // @todo: get clientWidth
    },
    height() {
      return d3.min([this.width * 0.5, 800]);
    },
    parsedData() {
      // create copy (ref: https://observablehq.com/@tmcw/observable-anti-patterns-and-code-smells#mutation )
      const data = this.input.slice();

      // filter the data
      // 'World', 'World Excluding China', 'Europe'
      let filtered;
      if (this.selection === 'World Excluding China') {
        filtered = this.filterByCountry(['Mainland China'], data, true);
      } else if (this.selection === 'World') {
        filtered = data;
      } else {
        filtered = this.filterByCountry([this.selection], data);
      }

      return this.groupByCountry(filtered);
    },
    dataset() {
      return this.addDailyValues(this.parsedData.data);
    },
    chartData() {
      return [];
      // return this.view === 'map'
      //   ? this.getLatest(this.getCountries())
      //   : this.getCountries();
    },
    dates() {
      return Array.from(new Set(this.getCountries().map(d => d.date)))
        .map(d => moment(d, 'M/D/YY'))
        .sort(d3.ascending);
    },
    series() {
      return this.getSeries(this.dataset, 5);
    },
    daysCount() {
      return this.parsedData.count;
    },
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
  async asyncData({ $axios }) {
    const files = [
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
    ];

    // load all data (3 different raw csv files)
    const response = await Promise.all(files.map(url => $axios.get(url)));
    const result = response.map(resp => d3.csvParse(resp.data, d3.autoType));
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
    return { input };
  },
  mounted() {
    //   // load and parse data.
    //   // @todo: move to asyncData()
    //   loadData().then(input => {
    //     this.input = input;
    // const all = this.getCountries();
    // this.drawChart('#map1', this.series);
    // this.drawChart(
    //   '#map2',
    //   this.getSeries(this.getCountries(['Italy', 'Mainland China', 'Iran']))
    // );
    //   });
  },
  methods: {
    getSeries(input, limit) {
      let data = d3.groups(input, d => d.name);
      if (limit > 0) {
        data = data.slice(0, limit);
      }
      return data.map((d, i) => {
        return {
          name: d[0],
          values: d[1].map(d => {
            return {
              date: d.date,
              value: d.change.confirmed > 10000 ? 1000 : d.change.confirmed
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
    getCountries(input) {
      let selection = [];
      if (input) {
        const countries = Array.isArray(input) ? input : [input];
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
            confirmed: date.value.confirmed ? date.value.confirmed : null,
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
    }
  }
};
</script>
<style>
.dropdown .vs__selected {
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
