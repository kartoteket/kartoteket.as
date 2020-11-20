<template>
  <svg :id="`map-${id}`" class="map" />
</template>
<script>
/* eslint-disable no-unused-vars */

import * as d3Lib from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
import * as d3Array from 'd3-array';
import * as moment from 'moment';
import * as topojson from 'topojson-client';

import topo from './world2.topojson.json';

const d3 = Object.assign({}, d3Lib, d3Array);

export default {
  props: {
    chartData: {
      type: Array,
      required: true
    },
    id: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    return {
      view: 'map',
      world: {},
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
    width() {
      return d3.min([300, 1600]); // @todo: get clientWidth
    },
    height() {
      return d3.min([this.width * 0.5, 800]);
    },
    x() {
      return d3
        .scaleTime()
        .domain(d3.extent(this.chartData, d => moment(d.date))) // d3.extent(data, d => parseDate(d.LastUpdate))
        .range([this.margin.left, this.width - this.margin.right]);
    },
    y() {
      // sort by length - inside out
      const arr = [];
      const copy = this.daysCount.slice();
      copy.sort((a, b) => a.length - b.length);
      copy.forEach((e, i) => {
        if (i % 2) { arr.unshift(e); } else { arr.push(e); }
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
        .domain([0, d3.max(this.chartData, d => d.confirmed) + 30])
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
    color() {
      return d3
        .scaleOrdinal()
        .domain(['confirmed', 'recovered', 'deaths'])
        .range(['#2B3F4E', '#AEC84B', '#D14A51']);
    },
    daysCount() {
      return this.parsedData.count;
    },
    countries() {
      // @todo: Noe need to double this. Use land and move filter to where it is used
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
    }
  },

  mounted() {
    // console.log(this.chartData);
    // noop
  },
  methods: {
    drawChart(id, series) {
      const that = this;
      const el = this.chart || d3.select(id);
      const svg = el;
      const t = svg.transition().duration(750);

      // initalize on first call
      if (!el.g) {
        el.g = svg.append('g');
        el.dots = el.g.append('g').classed('dots', true);
        el.voronoi = el.g.append('g').classed('voronoi', true);
        el.confirmeddots = el.dots.append('g').classed('confirmeddots', true);
        el.deathdots = el.dots.append('g').classed('deathdots', true);
        el.recovereddots = el.dots.append('g').classed('recovereddots', true);
        el.map = el.g.append('g').classed('map', true);
        el.xAxis = el.g.append('g').classed('axis axis-x', true);
        el.yAxis = el.g.append('g').classed('axis axis-y', true);
        el.toolTip = el.g.append('g').classed('tooltip', true);
        el.ledgends = el.g
          .append('g')
          .classed('legends', true)
          .attr(
            'transform',
            `translate(${this.margin.left * 1.2},${this.height -
              this.margin.bottom * 14})`
          )
          .style('fill', '#2B3F4E')
          .attr('color', '#2B3F4E');

        // add X axis
        el.xAxis.call(this.xAxis);

        // color ledgend
        // el.ledgends;
        const cLegend = el.ledgends
          .append('g')
          .attr('transform', 'translate(0,10)')
          .classed('ledgend-color', true)
          .selectAll('circle')
          .data(this.color.domain().reverse())
          .enter();

        cLegend
          .append('circle')
          .style('fill-opacity', 0.75)
          .attr('r', (_, i) => (i + 1) * 6)
          .attr('transform', (_, i) => `translate(0, ${i * 40})`)
          .attr('fill', d => this.color(d))
          .attr('stroke', d => this.color(d));

        cLegend
          .append('text')
          .attr('dy', '.5em')
          .attr('transform', (_, i) => `translate(25, ${i * 40})`)
          .attr('font-family', 'Helvetica Neue, sans-serif')
          .attr('font-size', '11px')
          .text(d => d);

        // add map
        el.map
          // .attr('transform', `translate(0,${height / 4})`)
          .selectAll('countries')
          .append('g')
          .data(this.countries)
          .enter()
          .append('path')
          .attr('class', d => `${d.properties.id}`) // todo: is undefined!
          .attr('fill', 'rgba(0,0,0,0.03)')
          .attr('linewidth', 0.5)
          .attr('stroke', 'rgba(0,0,0,0.08)')
          .attr('d', this.path);
      }

      // add size legend (must be reactive)
      el.ledgends.select('.ledgend-size').remove();
      el.ledgends
        .append('g')
        .attr('transform', 'translate(100,0)')
        .classed('ledgend-size', true)
        .call(this.legend);

      // add y axis (must be reactive)
      const yScale =
        this.selection === 'World' || this.selection === 'World Excluding China'
          ? this.y
          : this.yCountry;
      el.yAxis.call(this.yAxis, yScale);

      // add dots
      el.confirmeddots.selectAll('circle').remove();
      if (this.dimension === 'all' || this.dimension === 'confirmed') {
        el.confirmeddots
          .selectAll('circle')
          .data(this.chartData)
          .call(this.dots, t, 'confirmed');
      }

      // add death dots
      el.deathdots.selectAll('circle').remove();
      if (this.dimension === 'all' || this.dimension === 'deaths') {
        el.deathdots
          .selectAll('circle')
          .data(this.chartData)
          .call(this.dots, t, 'deaths');
      }

      // add recovered dots
      el.recovereddots.selectAll('circle').remove();
      if (this.dimension === 'all' || this.dimension === 'recovered') {
        el.recovereddots
          .selectAll('circle')
          .data(this.chartData)
          .call(this.dots, t, 'recovered');
      }

      // map view
      if (this.view === 'map') {
        el.xAxis.style('opacity', 0);
        el.yAxis.style('opacity', 0);
        el.map.style('opacity', 1);

        // el.dots.attr('transform', `translate(0,${height / 4})`);

        // position dots
        el.confirmeddots
          .selectAll('circle')
          .transition(t)
          .attr('r', d => (d.confirmed ? this.size(d.confirmed) : 0))
          .attr('transform', d => `translate(${this.projection(d.pos)})`);

        el.deathdots
          .selectAll('circle')
          .transition(t)
          .attr('r', d => (d.deaths ? this.size(d.deaths) : 0))
          .attr('transform', d => `translate(${this.projection(d.pos)})`);

        el.recovereddots
          .selectAll('circle')
          .transition(t)
          .attr('r', d => (d.recovered ? this.size(d.recovered) : 0))
          .attr('transform', d => `translate(${this.projection(d.pos)})`);

        // add map voronoi (todo: add toolltip to mpousevents)
        el.voronoi.selectAll('path').remove();
        el.voronoi.call(this.addVoronoi, this.mapVoronoi, el.toolTip);
      }

      // chart view
      if (this.view === 'chart') {
        el.xAxis.style('opacity', 1);
        el.yAxis.style('opacity', 1);
        el.map.style('opacity', 0.5);

        el.dots.attr('transform', 'translate(0,0)');

        // position dots
        el.confirmeddots
          .selectAll('circle')
          .transition(t)
          .attr('r', d => (d.confirmed ? this.size(d.confirmed) : 0))
          .attr(
            'transform',
            d =>
              `translate(${this.x(this.parseDate(d.date))},${yScale(
                d[this.yScaleKey('confirmed')]
              )})`
          );

        el.deathdots
          .selectAll('circle')
          .transition(t)
          .attr('r', d => (d.deaths ? this.size(d.deaths) : 0))
          .attr('transform', d => {
            const offset = 0;
            // size(d.confirmed) + size(d.recovered) * 2 + size(d.deaths);
            return `translate(${this.x(this.parseDate(d.date)) +
              offset},${this.yScale(d[this.yScaleKey('deaths')])})`;
          });

        el.recovereddots
          .selectAll('circle')
          .transition(t)
          .attr('r', d => (d.recovered ? this.size(d.recovered) : 0))
          .attr('transform', d => {
            const offset = 0;
            // size(d.confirmed) + size(d.recovered) * 2 + size(d.deaths);
            return `translate(${this.x(this.parseDate(d.date)) +
              offset},${this.yScale(d[this.yScaleKey('recovered')])})`;
          });

        // add chart voronoi  (todo: add toolltip to mpousevents)
        el.voronoi.selectAll('path').remove();
        el.voronoi.call(this.addVoronoi, this.chartVoronoi, el.toolTip);
      }

      // style axis and tick lines
      el.yAxis
        .selectAll('.tick')
        .selectAll('line')
        .style('opacity', 0.25)
        .attr('stroke', '#ddd');

      el.xAxis
        .selectAll('.tick')
        .selectAll('line')
        .style('opacity', 0.25)
        .attr('stroke', '#ddd');

      el.xAxis
        .selectAll('.domain')
        .transition(t)
        .style('opacity', 0);

      el.yAxis
        .selectAll('.domain')
        .transition(t)
        .style('opacity', 0);

      return svg.node();
    },
    // SCALES
    size(selection) {
      const domain = this.input.filter(d => {
        if (selection === 'World' || selection === 'Mainland China') { return true; }
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
