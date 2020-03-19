<template>
  <svg :id="`chart-${id}`" class="chart" />
</template>
<script>
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'; // @todo cherrypick like this: var d3 = Object.assign({}, require("d3-format"), require("d3-geo"), require("d3-geo-projection"));
// import * as d3Array from 'd3-array';
import * as moment from 'moment';
import * as topojson from 'topojson-client';

const locale = d3.formatLocale({
  decimal: ',',
  thousands: ' ',
  grouping: [3]
});
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

      defaultConfig: {
        aspectRatio: 0.5,
        colorScale: d3.scaleOrdinal(d3.schemeSet2),
        textColor: '#fff',
        yAxis: 'left',
        margin: {
          right: 30,
          left: 50,
          top: 20,
          bottom: 20
        }
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
        .range([
          this.height - this.options.margin.bottom,
          this.options.margin.top
        ]);
    },
    xScale() {
      return (
        d3
          .scaleTime()
          .domain(
            d3.extent(this.series[0].values, d => {
              return d.date;
            })
          )
          // @todo should get min/max of all sets of values
          .range([
            this.options.margin.left,
            this.width - this.options.margin.right
          ])
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
        .x(d => this.xScale(d.date))
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
          `translate(${this.options.margin.left + 10}, ${this.height -
            this.options.margin.bottom -
            20})`
        )
        .selectAll('g')
        .data(
          series.sort((a, b) =>
            d3.ascending(
              a.values[a.values.length - 1].value,
              b.values[b.values.length - 1].value
            )
          )
        )
        .join('g');

      legends
        .append('rect')
        .attr('fill', (d, i) => this.color(d.name))
        .attr('width', 20)
        .attr('height', 2)
        .attr('rx', 2)
        .attr('y', (_, i) => i * -16);

      legends
        .append('text')
        .style('font-family', 'Helvetica, Arial, sans serif')
        .style('font-size', '.75rem')
        .style('fill', this.options.textColor)
        .attr('x', 25)
        .attr('dy', 4)
        .attr('y', (_, i) => i * -16)
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
        .attr('stroke', this.options.textColor);

      el.xAxis
        .selectAll('.tick')
        .selectAll('line')
        .style('opacity', 0.25)
        .attr('stroke', this.options.textColor);
      el.xAxis
        .selectAll('.tick')
        .selectAll('text')
        .attr('y', '5');

      el.xAxis
        .selectAll('.domain')
        .transition(t)
        .style('opacity', 0.25);

      el.yAxis
        .selectAll('.domain')
        .transition(t)
        .style('opacity', 0.25);

      // tooltip
      svg.on('touchmove mousemove', function() {
        const values = that.bisect(d3.mouse(this)[0]);
        if (values[0]) {
          el.tooltip
            .attr('transform', `translate(${that.xScale(values[0].date)},25)`) // ${yTemp(values[0].value) - 125
            .call(that.callout, values);
        }
      });
      svg.on('touchend mouseleave', () => el.tooltip.call(that.callout, null));

      this.chart = el;
    },
    // AXIS
    xAxis(svg, x) {
      return svg
        .attr(
          'transform',
          `translate(0,${this.height - this.options.margin.bottom})`
        )
        .call(
          d3
            .axisBottom(x)
            .ticks(4) // this.width > 600 ? 10 : 3
            .tickFormat(d3.timeFormat('%d.%m'))
            .tickSizeOuter(0)
            .tickSizeInner(
              (this.height -
                this.options.margin.top -
                this.options.margin.bottom) *
                -1
            )
        );
    },
    yAxis(svg, y) {
      let generator = d3.axisLeft(y);
      let position = this.options.margin.left;
      const tickWidth =
        (this.width - this.options.margin.right - this.options.margin.left) *
        -1;

      if (this.options.yAxis === 'right') {
        generator = d3.axisRight(y);
        position = this.width - this.options.margin.right;
      }
      return svg.attr('transform', `translate(${position},0)`).call(
        generator
          // .tickFormat(d3.format('d'))
          .ticks(5)
          .tickSizeOuter(0)
          .tickSizeInner(tickWidth)
      );
    },
    callout(g, values) {
      if (!values) return g.style('display', 'none');

      // get a date x days back in tome
      const flipDate = new Date().setTime(
        new Date().getTime() - 24 * 60 * 60 * 1000 * 10
      ); // 10 days

      // get the country names
      const names = this.series.map(d => d.name);

      // flip as series are sorted ascending
      names.reverse();
      values.reverse();

      // trick to print date on first line
      names.unshift('Date');
      values.unshift(values[0]);

      // genearet text
      const echoTooltip = text =>
        text
          .selectAll('tspan')
          .data(values)
          .join('tspan')
          .attr(
            'text-anchor',
            d => (d.date.getTime() > flipDate ? 'end' : 'start')
          )
          .attr('x', d => (d.date.getTime() < flipDate ? '10' : '-10'))
          .attr('y', (d, i) => `${i * 1.2}em`)
          .style('font-weight', (_, i) => (i ? null : 'bold'))
          .text(function(d, i) {
            if (i < 1) return `${d3.timeFormat('%d. %b')(d.date)}`; // print date on first line
            return `${names[i]} ${locale.format(',')(d.value)}`;
          });

      // tooltip container
      const callout = g
        .style('display', null)
        .style('pointer-events', 'none')
        .style('font', '0.75rem Helvetica, arial, sans-serif')
        .style('fill', this.options.textColor);

      // generate text to get dimensions
      const text = callout.append('text').call(text => echoTooltip(text));
      const { x, y, width: w, height: h } = text.node().getBBox();

      // tooltip guide-line
      callout
        .selectAll('line')
        .data([null])
        .join('line')
        .attr('stroke', this.options.textColor)
        .style('stroke-opacity', 0.5)
        .attr('stroke-width', 1)
        .style('stroke-dasharray', '3, 3')
        .attr('class', 'guide')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr(
          'y2',
          this.height - this.options.margin.bottom - this.options.margin.top - 4
        );

      // tooltip bg box
      callout
        .selectAll('rect')
        .data([null])
        .join('rect')
        .attr('fill', '#2a3b4b')
        .attr('fill-opacity', 0.75)
        .attr('stroke', this.options.textColor)
        .attr('stroke-opacity', 0.25)
        .attr('rx', 5)
        .attr('width', w + 20)
        .attr('x', x - 10)
        .attr('y', -15)
        .attr('height', h + 10);

      // re-append text on top og bg box
      callout.selectAll('text').remove();
      callout.append('text').call(text => echoTooltip(text));

      // position
      text.attr('transform', `translate(0,${-10 - y})`);
    },
    bisect(mx) {
      const bisect = d3.bisector(d => d.date).right;
      const date = this.xScale.invert(mx);
      return this.series.map(function(line) {
        const index = bisect(line.values, date, 1);
        const a = line.values[index - 1];
        const b = line.values[index];
        if (b) return date - a.date > b.date - date ? b : a;
        return null;
      });
    }
  }
};
</script>
<style>
.tooltip text,
.legend text,
.axis {
  font-size: 0.8rem !important;
}
@screen sm {
  .tooltip text,
  .legend text,
  .axis {
    font-size: 0.75rem !important;
  }
}
</style>
