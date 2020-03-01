<template>
  <article class="flex flex-col">
    <header class="main-col mb-8">
      <h1 class="main-header">
        Corona virus COVID-19
      </h1>
      <div class="rtf md:text-lg leading-relaxed">
        DataSource: <a href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a>
      </div>
    </header>
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
    </div>
  </article>
</template>
<script>
/* eslint-disable no-unused-vars */

import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import * as moment from 'moment';
import * as topojson from 'topojson-client';

import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

import topo from './world2.topojson.json';

import head from '~/mixins/head.js';
import MultiLineChart from '@/components/charts/MultiLineChart';

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
        title: 'About Kartoteket',
        slug: 'feature/corona',
        description:
          'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO',
        url: `https://kartoteket.as/feature/corona`
      }
    };
  },
  computed: {
    chartSeries() {
      const scandinavia = {
        title: 'Scandinavia',
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
      const World = {
        title: 'US',
        data: this.getSeries(this.getCountries('US'))
      };

      return [scandinavia, keyCountries, World];
    },
    width() {
      return d3.min([300, 1600]); // @todo: get clientWidth
    },
    height() {
      return d3.min([this.width * 0.5, 800]);
    },
    x() {
      return d3
        .scaleTime()
        .domain(d3.extent(this.dataset, d => moment(d.date))) // d3.extent(data, d => parseDate(d.LastUpdate))
        .range([this.margin.left, this.width - this.margin.right]);
    },
    y() {
      // sort by length - inside out
      const arr = [];
      const copy = this.daysCount.slice();
      copy.sort((a, b) => a.length - b.length);
      copy.forEach((e, i) => {
        if (i % 2) arr.unshift(e);
        else arr.push(e);
      });
      return d3
        .scaleBand()
        .domain(arr.map(d => d.name) /* .sort(d3.descending) */)
        .range([this.height - this.margin.bottom, this.margin.top])
        .paddingInner(1)
        .paddingOuter(1)
        .align(0.5)
        .round(true);
    },
    yCountry() {
      return d3
        .scaleLinear()
        .domain([0, d3.max(this.dataset, d => d.confirmed) + 30])
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
    color() {
      return d3
        .scaleOrdinal()
        .domain(['confirmed', 'recovered', 'deaths'])
        .range(['#2B3F4E', '#AEC84B', '#D14A51']);
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
      return this.view === 'map' ? this.latest : this.dataset;
    },
    latest() {
      // @todo: should also be a method
      return this.dataset
        .filter(d => moment(d.date).isSame(this.dates[this.dates.length - 1]))
        .sort((a, b) => d3.ascending(a.length, b.length));
    },
    dates() {
      return Array.from(new Set(this.dataset.map(d => d.date)))
        .map(d => moment(d))
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
    countries() {
      // @todo: Noe need to double this. Move filter to where it is used
      return this.land.features.filter(
        d => !d.properties.NAME.includes('tarctica')
      );
    },
    land() {
      return topojson.feature(topo, topo.objects.countries);
    },
    projection() {
      return d3
        .geoNaturalEarth1()
        .fitExtent([[0, 0], [this.width, this.height]], this.land)
        .translate([this.Width / 2, this.height]);
    },
    path() {
      return d3.geoPath(this.projection);
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
  async asyncData() {
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
    },
    // SCALES
    size(selection) {
      const domain = this.input.filter(d => {
        if (selection === 'World' || selection === 'Mainland China')
          return true;
        return d.country !== 'Mainland China';
      });

      const range = this.view === 'chart' ? [2, 25] : [2, 65];

      return d3
        .scaleSqrt()
        .domain(d3.extent(domain, d => d.confirmed))
        .range(range);
    },
    // AXIS
    xAxis(svg) {
      const interval = this.width > 600 ? 10 : 3;
      return svg.attr('transform', `translate(0,${this.margin.top})`).call(
        d3
          .axisTop(this.x)
          .ticks(interval)
          .tickFormat(d3.timeFormat('%d.%m'))
          .tickSizeOuter(0)
          .tickSizeInner(
            (this.height - this.margin.top - this.margin.bottom) * -1
          )
      );
    },
    yAxis(svg, y) {
      return svg
        .attr('transform', `translate(${this.margin.left - 20},0)`)
        .call(
          d3
            .axisLeft(y)
            .tickSizeOuter(0)
            .tickSizeInner(
              (this.width - this.margin.right - this.margin.left) * -1
            )
        );
    },
    // HELPERS
    yScaleKey(dimension) {
      if (this.countriesList.includes(this.selection)) {
        return dimension;
      }
      return 'name';
    },
    showTooltip(d, g) {
      g.style('display', null)
        .style('pointer-events', 'none')
        .style('font', '12px Helvetica, arial, sans-serif');

      g.selectAll('text')
        .data([null])
        .join('text')
        .attr(
          'transform',
          `translate(${d3.event.pageY - 10}, ${d3.event.pageX})`
        )
        .call(text =>
          text
            .selectAll('tspan')
            .attr('fill', '#777')
            .datum(d)
            .join('tspan')
            .attr('y', (d, i) => `${i * 1.2}em`)
            .style('font-weight', (_, i) => (i ? null : 'bold'))
            .text(d => `${d.name} ${d.value}`)
        );
    },
    removeTooltip() {
      const tooltip = d3.select('.svg-tooltip');
      return tooltip.style('visibility', 'hidden');
    },
    addVoronoi(g, generator, toolTip) {
      g.selectAll('path')
        .data(generator(this.chartData).polygons())
        .enter()
        .append('path')
        .attr('d', (d, i) => 'M' + d.join('L') + 'Z')
        .datum((d, i) => d.data)
        // Give each cell a unique class where the unique part corresponds to the circle classes
        .attr('class', (d, i) => `cid-${i}`)
        // .style("stroke", "#2074A0") //If you want to look at the cells
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', d => this.showTooltip(d, toolTip))
        .on('mouseout', d => this.removeTooltip(d, toolTip));
    },
    chartVoronoi() {
      d3.voronoi()
        .x(function(d) {
          return this.x(moment(d.date));
        })
        .y(function(d) {
          return this.y(d.name);
        })
        .extent([[0, 0], [this.width, this.height]]);
    },
    mapVoronoi() {
      d3.voronoi()
        .x(d => this.projection(d.pos)[0])
        .y(d => this.projection(d.pos)[1])
        .extent([[0, 0], [this.width, this.height]]);
    },
    dots(selection, t, dimension) {
      selection.join(
        enter =>
          enter
            .append('circle')
            .attr('class', d => d.name)
            .style('opacity', 0)
            .attr('r', 0)
            //        .attr("transform", `translate(${width / 2},${height})`)
            .attr(
              'transform',
              d => `translate(${this.x(moment(d.date))},${this.y(d.name)})`
            )
            .style('fill', d => this.color(dimension))
            .style('stroke', d => this.color(dimension))
            .call(enter =>
              enter
                .transition(t)
                .style('opacity', 0.75)
                .style('fill-opacity', 0.25)
            ),
        update => update,
        exit =>
          exit.call(exit =>
            exit
              .transition(t)
              .attr('r', 0)
              .style('opacity', 0)
              .remove()
          )
      );
      //    .on("mouseover", function(d) {
      //     console.log('m over');
      //  });
    },
    legend() {
      const values = [
        this.size.domain()[0],
        this.size.domain()[1] * 0.25,
        this.size.domain()[1] * 0.5,
        this.size.domain()[1]
      ];
      return this.legendCircle()
        .tickValues(values)
        .tickFormat(
          (d, i, e) => (i === e.length - 1 ? d + ' confirmed cases' : d)
        )
        .scale(this.size)
        .tickSize(5);
    },
    // By Harry Stevens - Source: https://observablehq.com/@harrystevens/circle-legend#legendCircle
    legendCircle(context) {
      let scale;
      let tickValues;
      let tickFormat = d => d;
      let tickSize = 5;

      function legend(context) {
        let g = context.select('g');
        if (!g._groups[0][0]) {
          g = context.append('g');
        }
        g.attr('transform', `translate(${[1, 1]})`);

        const ticks = tickValues || scale.ticks();

        const max = ticks[ticks.length - 1];

        g.selectAll('circle')
          .data(ticks.slice().reverse())
          .enter()
          .append('circle')
          .attr('fill', 'none')
          .attr('stroke', 'currentColor')
          .attr('cx', scale(max))
          .attr('cy', scale)
          .attr('r', scale);

        g.selectAll('line')
          .data(ticks)
          .enter()
          .append('line')
          .attr('stroke', 'currentColor')
          .attr('stroke-dasharray', '4, 2')
          .attr('x1', scale(max))
          .attr('x2', tickSize + scale(max) * 2)
          .attr('y1', d => scale(d) * 2)
          .attr('y2', d => scale(d) * 2);

        g.selectAll('text')
          .data(ticks)
          .enter()
          .append('text')
          .attr('font-family', "'Helvetica Neue', sans-serif")
          .attr('font-size', 11)
          .attr('dx', 3)
          .attr('dy', 4)
          .attr('x', tickSize + scale(max) * 2)
          .attr('y', d => scale(d) * 2)
          .text(tickFormat);
      }

      legend.tickSize = function(_) {
        return arguments.length ? ((tickSize = +_), legend) : tickSize;
      };

      legend.scale = function(_) {
        return arguments.length ? ((scale = _), legend) : scale;
      };

      legend.tickFormat = function(_) {
        return arguments.length ? ((tickFormat = _), legend) : tickFormat;
      };

      legend.tickValues = function(_) {
        return arguments.length ? ((tickValues = _), legend) : tickValues;
      };

      return legend;
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
