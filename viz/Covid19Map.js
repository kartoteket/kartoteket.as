import * as d3Lib from 'd3';
import * as d3Array from 'd3-array';
import * as topojson from 'topojson-client';
import moment from 'moment';

const d3 = Object.assign({}, d3Lib, d3Array);
// const baseUrl = 'http://localhost:3000/files/';
// eslint-disable-next-line prettier/prettier
const baseUrl = 'https://storage.googleapis.com/kartoteket/covid19/data/johnshopkins/';

const texts = {
  no: {
    _new: 'Nye',
    _total: 'Totalt',
    _deaths: 'Døde:',
    _confirmed: 'Bekreftet:',
    _recovered: 'Friskmeldte:',
    _numConfirmed: 'Antall daglig bekreftede tilfeller',
    _lastTick: 'tilfeller (Wuhan)'
  },
  en: {
    _new: 'New',
    _total: 'Total',
    _deaths: 'Deaths:',
    _confirmed: 'Confirmed:',
    _recovered: 'Recovered:',
    _numConfirmed: 'Number of daily confirmed incidents',
    _lastTick: 'incidents (Wuhan)'
  }
};

export default class Covid19Map {
  constructor(element, width, language = 'en') {
    this.version = '1.1.0';
    this.element = `#${element}`;
    this.height = 600;
    this.width = width < 600 ? width : 900;
    this.land = null;
    this.projection = null;
    this.countries = null;
    this.topo = null;
    this.textColor = '#333';
    this.bubbleColor = '#641B18'; // '#2B3F4E'; // '#F1CA3F'; // '#2B3F4E'
    this.chartColor = '#641B18'; // '#2B3F4E'; // D60000, '#4e79a7'
    this.animationSpeed = 400;
    this.currentIndex = 0;
    this.paused = false;
    this.texts = this.getLocalizedTexts(language);
    this.setSizes();
  }

  setSizes() {
    this.normalTextSize = Math.min(Math.round(this.width / 30), 14);
    this.headlineTextSize = Math.max(Math.round(7000 / this.width), 19);
    const chartWidth = Math.min(this.width - 50, 600);

    this.pos = {
      numbers: {
        x: 10,
        y: this.width > 600 ? 20 : 250
      },
      legend: {
        x: 10,
        y: 400
      },
      bLegend: {
        x: this.width > 600 ? 200 : 10,
        y: 20
      },
      chart: {
        x: this.width > 600 ? this.width - 100 - chartWidth : 0,
        y: this.height - 350,
        height: 300,
        width: chartWidth
      }
    };
  }

  update(width) {
    if (width < 600 && this.width > 600) {
      this.width = width;
      this.setSizes();
      this.projection = this.getProjection();
      this.draw(true);
    } else if (width > 600 && this.width < 600) {
      this.width = 900;
      this.setSizes();
      this.projection = this.getProjection();
      this.draw(true);
    }
  }

  async init() {
    this.topo = await d3.json(
      'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
    );
    this.land = this.getLand();
    this.projection = this.getProjection();
    this.countries = this.getCountries();
    this.inputData = await this.getData();
    this.dates = this.getDates();
    this.dataSeries = this.getDataSerie();
    this.timeline = this.getTimelineData(20);
    this.draw();
    return true;
  }

  draw(redraw) {
    this.createMap();
    this.x = this.getX();
    this.y = this.yScale();
    this.line = this.createLineAccessor();
    this.opacity = this.createOpacityScale();
    this.sizeLinear = this.createSizeScale();
    this.createBubbles();
    if (this.width > 600) {
      this.createBubbleLegend();
    }
    this.createChart();
    if (!redraw) {
      this.startTimer();
    } else {
      this.updateChartAndBubles();
    }
  }

  createMap() {
    const svg = d3
      .select(this.element)
      .attr('viewBox', [0, 0, this.width, this.height]);

    // ensure all child elements are removed before redrawing
    svg.selectAll('g').remove();

    const path = d3.geoPath(this.projection);
    const map = svg.append('g').classed('world', true);
    // bubbles for bubblechart
    svg.append('g').attr('class', 'bubbles');
    // chart for timeseries
    svg
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${0} ${this.pos.chart.y})`);

    map
      .selectAll('countries')
      .append('g')
      .data(this.countries)
      .enter()
      .append('path')
      .attr('class', d => `${d.properties.name}`)
      .attr('fill', 'rgba(0,0,0,0.11')
      .attr('linewidth', 0.5)
      .attr('stroke', 'rgba(0,0,0,0.11)')
      .attr('d', path);

    // legend
    svg
      .append('g')
      .classed('legends', true)
      .attr(
        'transform',
        `translate(${this.pos.legend.x}, ${this.pos.legend.y})`
      )
      .attr('font-size', `${this.normalTextSize}px`)
      .style('fill', '#2B3F4E')
      .attr('color', '#2B3F4E');

    const numbers = svg
      .append('g')
      .attr('class', 'numbers')
      .attr('font-family', 'Helvetica Neue, sans-serif')
      .attr('font-size', `${this.normalTextSize}px`)
      .attr('fill', this.textColor)
      .attr(
        'transform',
        `translate(${this.pos.numbers.x},${this.pos.numbers.y})`
      );

    const date = numbers
      .append('g')
      .attr('class', 'current-date')
      .attr('transform', `translate(10, 0)`);

    date
      .append('g')
      .append('text')
      .attr('font-size', `${this.headlineTextSize}px`)
      .attr('class', 'dateText');

    numbers
      .append('g')
      .attr('transform', 'translate(170,0)')
      .append('text')
      .text(this.texts._new);

    numbers
      .append('g')
      .attr('transform', 'translate(120,0)')
      .append('text')
      .text(this.texts._total);

    numbers
      .append('line')
      .attr('stroke', this.textColor)
      .style('stroke-opacity', 1)
      .attr('stroke-width', 0.7)
      .attr('x1', 0)
      .attr('x2', 210)
      .attr('y1', 8)
      .attr('y2', 8);

    // confirmed
    numbers
      .append('g')
      .attr('transform', `translate(10,${this.normalTextSize * 1 + 10})`)
      .append('text')
      .text(this.texts._confirmed);

    numbers
      .append('g')
      .attr('transform', `translate(120,${this.normalTextSize * 1 + 10})`)
      .append('text')
      .attr('class', 'confirmed');

    numbers
      .append('g')
      .attr('transform', `translate(170,${this.normalTextSize * 1 + 10})`)
      .append('text')
      .attr('class', 'new-confirmed');
    // dead
    numbers
      .append('g')
      .attr('transform', `translate(10,${this.normalTextSize * 2 + 10})`)
      .append('text')
      .text(this.texts._deaths);

    numbers
      .append('g')
      .attr('transform', `translate(120,${this.normalTextSize * 2 + 10})`)
      .append('text')
      .attr('class', 'deaths');

    numbers
      .append('g')
      .attr('transform', `translate(170,${this.normalTextSize * 2 + 10})`)
      .append('text')
      .attr('class', 'new-deaths');

    /*
      Alternate approach is to map data to countries and use path.centroid:
        see: https://observablehq.com/@d3/bubble-map
    */
    return svg.node();
  }

  createBubbles() {
    const bubbles = d3.select('.bubbles'); // add bubbles

    bubbles
      .selectAll('circle')
      .data(this.timeline)
      .enter()
      .append('circle')
      .attr('class', d => d.name)
      .attr('r', d => this.size(d.confirmed))
      .attr('linewidth', 0.5)
      .attr('stroke', '#333')
      .style('fill', this.bubbleColor)
      .style('opacity', d => this.opacity(d.confirmed))
      .attr('transform', d => `translate(${this.projection(d.pos)})`);
  }

  updateBubbles(data) {
    const bubbles = d3.select('.bubbles');
    const t = bubbles.transition().duration(this.animationSpeed);

    bubbles
      .selectAll('circle')
      .data(data)
      .transition(t)
      .attr('r', d => this.size(d.confirmed))
      .style('opacity', d => this.opacity(d.confirmed))
      .attr('transform', d => `translate(${this.projection(d.pos)})`);
  }

  createChart() {
    const chart = d3.select('.chart');
    // const t = chart.transition().duration(speed);
    // initalize on first call

    const rect = chart
      .append('rect')
      .attr('class', 'rect')
      .attr('x', this.pos.chart.x)
      .attr('y', 0)
      .attr('height', this.pos.chart.height)
      .attr('width', this.pos.chart.width)
      .style('fill', 'rgba(0,0,0,0)');

    const lines = chart.append('g').classed('lines', true);
    const xAxis = chart.append('g').classed('axis axis-x', true);
    const yAxis = chart.append('g').classed('axis axis-y', true);
    const legend = chart
      .append('g')
      .classed('legend', true)
      .attr(
        'transform',
        `translate(${this.pos.chart.x + this.pos.bLegend.x}, ${this.pos.chart
          .height + this.pos.bLegend.y})`
      );

    const tooltip = chart.append('g').classed('tooltip', true);

    // add X axis
    xAxis.call(this.xAxis, this);

    // add y axis
    yAxis.call(this.yAxis, this);

    const guide = tooltip.append('g').attr('class', 'guide');
    guide
      .append('line')
      .attr('stroke', '#ddd')
      .style('stroke-opacity', 0.2)
      .attr('stroke-width', 10)
      .attr('x1', this.pos.chart.x + 4)
      .attr('x2', this.pos.chart.x + 4)
      .attr('y1', this.pos.chart.height)
      .attr('y2', 0);
    guide
      .append('line')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.2)
      .attr('x1', this.pos.chart.x)
      .attr('x2', this.pos.chart.x)
      .attr('y1', this.pos.chart.height)
      .attr('y2', 0);

    guide
      .append('line')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.2)
      .attr('x1', this.pos.chart.x + 8)
      .attr('x2', this.pos.chart.x + 8)
      .attr('y1', this.pos.chart.height)
      .attr('y2', 0);

    lines
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(this.dataSeries)
      .join('path')
      .attr('stroke', this.chartColor)
      .attr('d', d => this.line(d.values));

    // style axis and tick lines
    yAxis
      .selectAll('.tick')
      .selectAll('line')
      .style('opacity', 0.25)
      .attr('stroke', '#ddd')
      .attr('fill', '#333');

    yAxis
      .selectAll('.tick')
      .selectAll('text')
      .attr('font-size', `${this.normalTextSize}px`)
      .attr('fill', '#333');

    xAxis
      .selectAll('.tick')
      .selectAll('line')
      .style('opacity', 0.25)
      .attr('stroke', '#ddd')
      .attr('fill', '#333');

    xAxis
      .selectAll('.tick')
      .selectAll('text')
      .attr('font-size', `${this.normalTextSize}px`)
      .attr('fill', '#333');

    xAxis.selectAll('.domain').style('opacity', 0);

    yAxis.selectAll('.domain').style('opacity', 0);

    // legend
    legend
      .append('line')
      .attr('stroke', this.chartColor)
      .style('stroke-opacity', 1)
      .attr('stroke-width', 2)
      .attr('x1', 0)
      .attr('x2', 90)
      .attr('class', 'legend-line')
      .attr('y1', 17)
      .attr('y2', 17);

    legend
      .append('g')
      .attr('transform', `translate(${100},${this.pos.bLegend.y})`)
      .append('text')
      .attr('font-size', `${this.normalTextSize}px`)
      .attr('fill', '#333')
      .text(this.texts._numConfirmed);

    rect.on('click', () => {
      const r = rect.node();
      const xpos = d3.mouse(r)[0] - this.pos.chart.x;
      const width = r.getBBox().width;
      const widths = width / this.dates.length;
      this.currentIndex = Math.min(
        Math.round(xpos / widths),
        this.dates.length
      );
      this.toggleTimer();
      this.updateChartAndBubles();
    });
  }

  getProjection() {
    // stephan granhaug.
    let extent = [[-100, 0], [this.width, this.height]];
    if (this.width < 600) {
      extent = [[-50, -50], [this.width, 350]];
    }
    return d3.geoNaturalEarth1().fitExtent(extent, this.land);
  }

  updateChartAndBubles() {
    const timelineData = this.getTimelineData(this.currentIndex);
    const numberData = this.getNumberData(timelineData);
    this.updateBubbles(timelineData);
    this.updateGuide();
    this.updateNumbers(numberData);
  }

  updateGuide() {
    const r = this.x.range();
    const w = r[1] - r[0];
    const numDates = this.dates.length;
    const tickLength = w / numDates;
    const guidePos = r[0] + tickLength * (this.currentIndex + 1) - 4;

    // update the guide
    const guide = d3.select('.guide');
    const t = guide.transition().duration(this.animationSpeed);

    guide
      .transition(t)
      .attr('transform', `translate(${guidePos - this.pos.chart.x},0)`);
  }

  updateNumbers(data) {
    const dateText = d3.select('.dateText'); // add a footertext
    const confirmedText = d3.select('.confirmed');
    const newConfirmedText = d3.select('.new-confirmed');
    const newDeathsText = d3.select('.new-deaths');
    const deathsText = d3.select('.deaths');

    dateText.text(data.date);
    confirmedText.text(data.confirmed);
    newConfirmedText.text(data.newConfirmed);
    deathsText.text(data.deaths);
    newDeathsText.text(data.newDeaths);
  }

  getTimelineData(index) {
    const dateString = moment(this.dates[index]).format('M/D/YY');
    const tdata = this.inputData.filter(d => d.date === dateString);
    return tdata;
  }

  async getData() {
    const files = [`${baseUrl}raw_confirmed.csv`, `${baseUrl}raw_deaths.csv`];

    // load all data (3 different raw csv files)
    const input = await Promise.all(files.map(url => d3.csv(url, d3.autoType)));
    const outputData = [];
    const indexer = {};
    // load data segments matching the 3 files
    const segments = ['confirmed', 'deaths'];
    const dateCols = input[0].columns.slice(4);
    //
    // iterate each of the files confirmed, deaths, revovered
    //
    input.forEach((array, i) => {
      const currentSegment = segments[i];
      //
      // iterate each row in each input file
      //
      array.forEach((row, j) => {
        const state = row['Province/State'] || row['Country/Region'];
        const pos = [row.Long, row.Lat];
        const country = row['Country/Region'];

        if (i === 0) {
          // confirmed (index 1)
          indexer[state] = {};
          // iterate and merge all the dates in each row
          dateCols.forEach(date => {
            const o = {
              state,
              pos,
              country,
              date: date
            };
            o[currentSegment] = row[date];
            const len = outputData.push(o);
            indexer[state][date] = len - 1;
          });
        } else if (i === 1) {
          // deaths (index 1)
          // iterate and merge all the dates in each row
          dateCols.forEach(date => {
            const index = indexer[state][date];
            outputData[index][currentSegment] = row[date];
          });
        }
      });
    });
    return outputData;
  }

  getNumberData(timelineData) {
    const prevIndex = Math.max(this.currentIndex - 1, 0);
    const prevString = moment(this.dates[prevIndex]).format('M/D/YY');
    const prevTimeline = this.inputData.filter(d => d.date === prevString);
    const confirmed = d3.sum(timelineData, d => d.confirmed);
    const deaths = d3.sum(timelineData, d => d.deaths);
    const newConfirmed = confirmed - d3.sum(prevTimeline, d => d.confirmed);
    const newDeaths = deaths - d3.sum(prevTimeline, d => d.deaths);

    return {
      date: this.dates[this.currentIndex].format('DD MMM YYYY'),
      confirmed,
      deaths,
      newConfirmed,
      newDeaths
    };
  }

  size(s) {
    return !s ? s : this.sizeLinear(s);
  }

  createSizeScale() {
    return d3
      .scaleSqrt()
      .domain(d3.extent(this.inputData, d => d.confirmed))
      .range([1, this.width / 10]);
  }

  createOpacityScale() {
    return d3
      .scaleLinear()
      .domain([d3.max(this.inputData, d => d.confirmed), 1])
      .range([0.2, 0.65]);
  }

  toggleTimer() {
    if (this.timer) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.currentIndex += 1;
      this.updateChartAndBubles();
      if (this.currentIndex >= this.dates.length - 1) {
        this.stopTimer();
      }
    }, this.animationSpeed);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  getX() {
    return d3
      .scaleTime()
      .domain(d3.extent(this.inputData, d => moment(d.date)))
      .range([this.pos.chart.x, this.pos.chart.width + this.pos.chart.x]);
  }

  getY() {
    return d3
      .scaleBand()
      .domain(this.dates.map(d => moment(d).format('D-M')))
      .range([this.pos.chart.y, this.pos.chart.height - this.pos.chart.y])
      .paddingInner(1)
      .paddingOuter(1)
      .align(0.5)
      .round(true);
  }

  xAxis(svg, scope) {
    const r = scope.x.range();
    const w = r[1] - r[0];
    svg.attr('transform', `translate(0, ${scope.pos.chart.height})`).call(
      d3
        .axisBottom(scope.x)
        .tickFormat(d3.timeFormat('%d.%m'))
        .ticks(Math.round(w / 60))
        .tickSizeOuter(0)
        .tickSizeInner(scope.pos.chart.height * -1)
    );
  }

  yAxis(svg, scope) {
    const y = scope.yScale();
    svg
      .attr(
        'transform',
        `translate(${scope.pos.chart.width + scope.pos.chart.x},0)`
      )
      .call(
        d3
          .axisRight(y)
          .tickSizeOuter(0)
          .tickSizeInner(scope.pos.chart.width * -1)
      );
  }

  yScale() {
    return d3
      .scaleLinear()
      .domain([
        d3.min(this.dataSeries, s => d3.min(s.values, v => v.value)),
        d3.max(this.dataSeries, s => d3.max(s.values, v => v.value))
      ])
      .range([this.pos.chart.height, 0]);
  }

  getDataSerie() {
    const grouped = d3.groups(this.inputData, d => d.date);
    let prev = 0;
    const val = grouped.map(d => {
      const values = d3.sum(d[1], s => s.confirmed) - prev;
      prev += values; // just get tha change day by day
      return {
        date: d[0],
        value: values
      };
    });

    const serie = [
      {
        name: 'world',
        values: val
      }
    ];
    return serie;
    /*  
    // if we want series by country
    const grouped = d3.groups(inputData, d => d.country);
    return grouped.map((d, i) => {
      const valueGroup = d3.groups(d[1], d => d.date);
      let prev = 0;
      return {
        name: d[0],
        values: valueGroup.map(d => {
          const val = d3.sum(d[1], d => d.confirmed) - prev; // get the daily growth
          prev += val;
          return {
            date: d[0],
            value: val
          };
        })
      };
    });
    */
  }

  getLocalizedTexts(language) {
    if (language !== 'no' && language !== 'en') {
      language = 'en';
    }
    return texts[language];
  }

  createBubbleLegend() {
    const tickFormat = (d, i, e) => {
      return i === e.length - 1
        ? `${Math.round(d)} ${this.texts._lastTick}`
        : Math.round(d);
    };
    const tickSize = 5;

    const tickValues = [
      Math.round(this.sizeLinear.domain()[0]),
      Math.round(this.sizeLinear.domain()[1] * 0.15),
      Math.round(this.sizeLinear.domain()[1] * 0.3),
      Math.round(this.sizeLinear.domain()[1])
    ];

    const legend = d3.select('.legends');
    const g = legend.append('g').classed('ledgend-size', true);
    const max = tickValues[tickValues.length - 1];
    g.selectAll('circle')
      .data(tickValues.slice().reverse())
      .enter()
      .append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'currentColor')
      .attr('linewidth', 0.5)
      .attr('cx', this.size(max))
      .attr('cy', d => this.size(d))
      .attr('r', d => this.size(d));

    g.selectAll('line')
      .data(tickValues)
      .enter()
      .append('line')
      .attr('stroke', 'currentColor')
      .attr('stroke-dasharray', '4, 2')
      .attr('x1', this.size(max))
      .attr('x2', tickSize + this.size(max) * 2)
      .attr('y1', d => this.size(d) * 2)
      .attr('y2', d => this.size(d) * 2);

    g.selectAll('text')
      .data(tickValues)
      .enter()
      .append('text')
      .attr('font-family', 'Helvetica Neue, sans-serif')
      .attr('font-size', this.normalTextSize)
      .attr('dx', 3)
      .attr('dy', 4)
      .attr('x', tickSize + this.size(max) * 2)
      .attr('y', d => this.size(d) * 2)
      .text(tickFormat);
  }

  createLineAccessor() {
    return d3
      .line()
      .defined(d => !isNaN(d.value))
      .x(d => this.x(moment(d.date)))
      .y(d => this.y(d.value))
      .curve(d3.curveBasis);
  }

  getDates() {
    // Creates a sorted array of all unique dates stored as moments
    const dates = Array.from(new Set(this.inputData.map(d => d.date)));
    return dates.map(d => moment(d)).sort(d3.ascending);
  }

  getLand() {
    return topojson.feature(this.topo, this.topo.objects.countries);
  }

  getCountries() {
    return topojson
      .feature(this.topo, this.topo.objects.countries)
      .features.filter(d => !d.properties.name.includes('tarctica'));
  }
}
