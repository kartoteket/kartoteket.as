<template>
  <svg :id="`chart-${id}`" class="chart" />
</template>
<script>
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
// import * as d3Array from 'd3-array';
import * as moment from 'moment';
import * as topojson from 'topojson-client';

// const d3 = Object.assign({}, d3Lib, d3Array);

export default {
  props: {
    series: {
      type: Array,
      required: true
    },
    id: {
      type: [String, Number],
      default: '1'
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null,
      margin: {
        right: 30,
        left: 80,
        top: 20,
        bottom: 20
      },
      defaultConfig: {
        aspectRatio: 0.5,
        colorScale: d3.scaleOrdinal(d3.schemeSet2)
      }
    };
  },
  computed: {
    options() {
      return { ...this.defaultConfig, ...this.config };
    },
    width() {
      return d3.min([500, 1600]); // @todo: get clientWidth
    },
    height() {
      return d3.min([this.width * this.options.aspectRatio, 800]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain([
          d3.min(this.series, s => d3.min(s.values, v => v.value)),
          d3.max(this.series, s => d3.max(s.values, v => v.value))
        ])
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
    xScale() {
      return (
        d3
          .scaleTime()
          .domain(
            d3.extent(this.series[0].values, d => {
              // console.log(d.date, moment(d.date, 'M/D/YY'));
              return moment(d.date, 'M/D/YY');
            })
          )
          // @todo should get min/max of all sets of values
          .range([this.margin.left, this.width - this.margin.right])
      );
    },
    color() {
      return this.options.colorScale;
      // return d3.scaleOrdinal(d3.schemeSet2);
    },
    changeLine() {
      return d3
        .line()
        .defined(d => !isNaN(d.value))
        .x(d => this.xScale(moment(d.date, 'M/D/YY')))
        .y(d => this.yScale(d.value))
        .curve(d3.curveCatmullRom);
    }
  },
  watch: {
    series(val) {
      this.drawChart(`#chart-${this.id}`, val);
    }
  },

  mounted() {
    // console.log(this.series);
    this.drawChart(`#chart-${this.id}`, this.series);
  },
  methods: {
    drawChart(id, series) {
      const that = this;
      const el = this.chart || d3.select(id);
      const svg = el;
      const t = svg.transition().duration(750);

      // initalize on first call
      if (!el.g) {
        svg
          .attr('viewBox', `0 0 ${this.width} ${this.height}`)
          .attr('style', 'width:100%');
        el.g = svg.append('g');
        el.lines = el.g.append('g').classed('lines', true);
        el.xAxis = el.g.append('g').classed('axis  axis-x', true);
        el.yAxis = el.g.append('g').classed('axis axis-y', true);
        el.legend = el.g.append('g').classed('legend', true);
        el.tooltip = el.g.append('g').classed('tooltip', true);
      }
      // add X axis
      el.xAxis.call(this.xAxis, this.xScale);
      // add y axis
      el.yAxis.call(this.yAxis, this.yScale);

      // add legend
      el.legend.selectAll('g').remove();
      const legends = el.legend
        .attr(
          'transform',
          `translate(${this.margin.left + 10}, ${this.margin.top + 20})`
        )
        .selectAll('g')
        .data(series.sort((a, b) => d3.ascending(a.name, b.name)))
        .join('g');

      legends
        .append('rect')
        .attr('fill', (d, i) => this.color(d.name))
        .attr('width', 20)
        .attr('height', 2)
        .attr('rx', 2)
        .attr('y', (_, i) => i * 16);

      legends
        .append('text')
        .style('font-family', 'Helvetica, Arial, sans serif')
        .style('font-size', '.75rem')
        .style('fill', '#fff')
        .attr('x', 25)
        .attr('dy', 4)
        .attr('y', (_, i) => i * 16)
        .text(d => d.name);

      // el.lines.selectAll('path').remove();
      el.lines
        // .append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .selectAll('path')
        .data(series)
        .join('path')
        .attr('stroke', d => this.color(d.name))
        .transition(t)
        .attr('d', d => this.changeLine(d.values));

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

      // tooltip
      svg.on('touchmove mousemove', function() {
        const values = that.bisect(d3.mouse(this)[0]);
        el.tooltip
          .attr(
            'transform',
            `translate(${that.xScale(moment(values[0].date), 'M/D/YY')},25)`
          ) // ${yTemp(values[2]) - 125
          .call(that.callout, values);
      });
      svg.on('touchend mouseleave', () => el.tooltip.call(that.callout, null));

      this.chart = el;
    },
    // AXIS
    xAxis(svg, x) {
      return svg
        .attr(
          'transform',
          `translate(0,${this.height - this.margin.bottom + 5})`
        )
        .call(
          d3
            .axisBottom(x)
            .ticks(2) // this.width > 600 ? 10 : 3
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
            // .tickFormat(d3.format('d'))
            .ticks(5)
            .tickSizeOuter(0)
            .tickSizeInner(
              (this.width - this.margin.right - this.margin.left) * -1
            )
        );
    },
    callout(g, values) {
      if (!values) return g.style('display', 'none');

      // get the country names
      const names = this.series.map(d => d.name);
      // trick to print date on first line
      names.unshift('Date');
      values.unshift(values[0]);

      g.style('display', null)
        .style('pointer-events', 'none')
        .style('font', '0.75rem Helvetica, arial, sans-serif')
        .style('fill', '#fff');

      const text = g
        .selectAll('text')
        .data([null])
        .join('text')
        .call(text =>
          text
            .selectAll('tspan')
            .data(values)
            .join('tspan')
            .attr(
              'text-anchor',
              d =>
                moment(d.date, 'M/D/YY').isAfter('2020-01-25T00:00:00Z')
                  ? 'end'
                  : 'start'
            )
            .attr(
              'x',
              d =>
                moment(d.date, 'M/D/YY').isAfter('2020-01-25T00:00:00Z')
                  ? '45'
                  : '70'
            )
            .attr('y', (d, i) => `${i * 1.2}em`)
            .style('font-weight', (_, i) => (i ? null : 'bold'))
            .text(function(d, i) {
              if (i < 1) return `${moment(d.date, 'M/D/YY').format('ll')}`; // print date on first line
              return `${names[i]} ${d.value}`;
            })
        );

      g.selectAll('line')
        .data([null])
        .join('line')
        .attr('stroke', '#eee')
        .style('stroke-opacity', 1)
        .attr('stroke-width', 1)
        .style('stroke-dasharray', '3, 3')
        .attr('class', 'guide')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', this.height - this.margin.bottom);

      const { x, y, width: w, height: h } = text.node().getBBox();
      text.attr('transform', `translate(${-w / 2},${15 - y})`);
      //  path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    },
    bisect(mx) {
      const bisect = d3.bisector(d => moment(d.date, 'M/D/YY')).left;
      const date = this.xScale.invert(mx);
      return this.series.map(function(line) {
        const index = bisect(line.values, moment(date, 'M/D/YY'), 1);
        const a = line.values[index - 1];
        const b = line.values[index];
        if (b) return date - a.date < b.date - date ? b : a;
        return a;
      });
    }
  }
};
</script>
<style>
.tooltip text,
.legend text,
.axis {
  font-size: 1rem !important;
}
@screen sm {
  .tooltip text,
  .legend text,
  .axis {
    font-size: 0.75rem !important;
  }
}
</style>
