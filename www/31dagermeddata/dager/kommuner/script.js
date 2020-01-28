/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* global d3, ss */

const Chart = (function(window, d3) {
  // Set chart properties
  const labels = d3
    .map()
    .set('Befolkning per 1.1. (personer) 2019', 'population')
    .set('Areal (km²) 2019,', 'areal')
    .set('Landareal (km²) 2019', 'land')
    .set('Innbyggere per km² landareal 2019', 'pop-land-ratio');

  // dimensions
  const margin = { global: 40, top: 40, right: 200, bottom: 80, left: 60 };
  const width = 600;
  const height = 400;

  // colorScheme
  const color = d3
    .scaleOrdinal()
    .domain([0, 1])
    .range(['#00796B', '#FF6D00']);

  // Base chart elements
  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const labelY = 'Befolkning';

  // data
  let year = 2019;
  let dataset = [];
  const merged = [];

  // load data and send throught parser before initilizing chart
  d3.csv('data.csv', parse, init);

  /**
   * init chart
   */
  function init(error, data) {
    if (error) {
      throw error;
    }

    dataset = aggregateByDimension(year, data);
    // merged = getMerged(dataset);
    // console.log(merged);

    // const merged = dataset.filter(function(d) {
    //   return d.value.merged;
    // });
    // console.log(merged)

    // const top10byPopulation = merged
    //   .sort(function(a, b) {
    //     return d3.descending(a.value.population, b.value.population);
    //   })
    //   .slice(0, 10);
    // console.log(top10byPopulation)

    // when done with any preparing logick and ready, we start updating the chart componenets
    update();
  }

  /**
   * Updates stack, layers, segments and layers on datachange
   */
  function update() {
    // When the chart is ready, we render to the dom.
    render();
  }

  /**
   * Render chart to canvas/dom
   * Anything dependent on browser window dimensions
   */
  function render() {
    // draw

    const domain = [
      d3.min(dataset, d => d.value.population),
      d3.max(dataset, d => d.value.population)
    ];
    console.log(domain);

    const mapPopulation = dataset.map(d => d.value.population).sort((a, b) => {
      return a - b;
    });
    // console.log(mapPopulation);

    // bins
    const bin1 = d3.histogram();
    const buckets1 = bin1(mapPopulation);
    // console.log('buckets1', buckets1);

    /**
     *  bin.value is an accessor function that bins objects based on their property p
     */
    const bin2 = d3.histogram().value(d => d.value.population);
    const buckets2 = bin2(dataset);
    // console.log('buckets2', buckets2);

    /**
     * bin.domain defines the lowest and highest value to be considered.
     */

    // By default, the domain accessor will use the data’s extent
    // console.log('default domain', d3.histogram().domain()(mapPopulation));

    // A useful way to give a proper domain to a bin is to create a scale with nice bounds,
    const scale = d3
      .scaleLinear()
      .domain(d3.extent(mapPopulation))
      .nice(); // 😃
    const bin4 = d3.histogram().domain(scale.domain());

    // If called with no argument, bin.domain will return the domain accessor
    // console.log('nice domain', bin4.domain()());

    const buckets4 = bin4(mapPopulation);
    // console.log('buckets4', buckets4);

    /**
     * bin.thresholds sets (or reads) the thresholds.
     */

    // set manually with array of values
    const thresholds5 = [2000, 5000, 20000, 100000];
    const bin5 = d3.histogram().thresholds(thresholds5);
    const buckets5 = bin5(mapPopulation);
    // console.log('buckets5', buckets5);

    //  generators are available
    const bin6 = d3.histogram().thresholds(d3.thresholdFreedmanDiaconis);
    const buckets6 = bin6(mapPopulation);
    // console.log('buckets6', buckets6);

    //  custom defined threshold generator
    const bin7 = d3
      .histogram()
      .thresholds(data => ss.ckmeans(data, 10).map(l => d3.min(l)));

    const buckets7 = bin7(mapPopulation);
    // console.log('buckets7', buckets7);

    // merging it all together:
    const thresholds = [2000, 5000, 20000, 100000];
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(mapPopulation))
      .rangeRound([0, width]);
    const labelX = 'Befolkning';

    const bin = d3
      .histogram()
      .domain(xScale.domain())
      .thresholds(thresholds);

    const histogram = d3
      .histogram()
      .domain(xScale.domain())
      .thresholds(thresholds)
      .value(function(d) {
        return d.value.population;
      });

    const buckets = histogram(dataset);
    console.log('buckets', buckets);
    console.log('thresholds', thresholds);
    console.log('xScale.ticks(5)', xScale.ticks(5));

    const quantizeScale = d3
      .scaleQuantize()
      .domain(domain)
      .range([1, 2, 3]);

    const thresholdScale = d3
      .scaleThreshold()
      .domain(thresholds)
      .range(thresholds);

    const yScale = d3
      .scalePoint()
      .domain(thresholds)
      .range([height, 0]);

    const sizeScale = d3
      .scaleSqrt()
      .domain([
        d3.min(dataset, d => d.value.land),
        d3.max(dataset, d => d.value.land)
      ])
      .range([2, 10]);

    const opacity = d3
      .scaleSqrt()
      .domain([
        d3.min(dataset, d => d.value.population),
        d3.max(dataset, d => d.value.population)
      ])
      .range([0.8, 0.6]);

    // set the parameters for the histogram
    // const histogram = d3
    //   .histogram()
    //   .value(function(d) {
    //     return d.value.population;
    //   })
    //   .domain(domain) // then the domain of the graphic
    //   .thresholds(yScale.ticks(5)); // then the numbers of bins

    // console.log(histogram);

    // y axis and label
    const yAxis = d3.axisLeft().scale(yScale);

    svg
      .append('g')
      .attr('class', 'axis axis-y')
      .call(yAxis);

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', 20)
      .attr('y', 10)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(labelY);

    // x axis and label
    svg
      .append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale).ticks(5));

    svg
      .append('text')
      .attr('x', width + 20)
      .attr('y', margin.bottom - 10)
      .attr('dy', '.71em')
      .attr('transform', 'translate(0,' + (height + 40 - margin.bottom) + ')')
      .style('text-anchor', 'end')
      .text(labelX);

    // bubbles
    const bubbles = svg.append('g').attr('class', 'bubbles');
    const dots = svg.append('g').attr('class', 'dots');

    dots
      .selectAll('circle')
      .data(buckets)
      .enter()
      .insert('circle')
      .attr('cx', function(d) {
        console.log('x', xScale(d.x0));
        return xScale(d.x0);
        // console.log(xScale(d));
      });

    bubbles
      .selectAll('circle')
      .data(buckets)
      .enter()
      .insert('circle')
      .attr('cx', function(d) {
        return xScale(d.x0);
      })
      .attr('cy', d => yScale(d.length))
      // .attr('opacity', d => opacity(d.value.population))
      // .attr('r', d => sizeScale(d.value.land))
      .attr('r', 3)
      // .attr('title', d => d.key)
      .style('fill', d => color(1));
    // .on('mouseover', function(d, i) {
    //   fade(d.rank, 0.25);
    // }) // use rank as unique id
    // .on('mouseout', function(d, i) {
    //   fadeOut(d.rank);
    // })
    // .transition('load')
    // .delay(function(d, i) {
    //   return xScale(d.value.land) - yScale(d.value.population);
    // })
    // .duration(3000)
    // .attr('cx', d => xScale(d.value.land))
    // .attr('cy', function(d) {
    //   // // console.log(thresholdScale(d.value.population));
    //   // console.log(
    //   //   // d.value.population,
    //   //   yScale(thresholdScale(d.value.population))
    //   //   // thresholdScale(d.value.population)
    //   // );
    //   return yScale(thresholdScale(d.value.population));
    // })
    // .ease(d3.easeBack);

    // helpers
    // function fade(rank, opacity) {
    //   svg
    //     .selectAll('.bubbles circle')
    //     .filter(function(d) {
    //       return d.rank !== rank;
    //     })
    //     .transition()
    //     .style('opacity', opacity);

    //   d3.selectAll('.annotation').classed('hidden', true);

    //   d3.select('.r' + rank).classed('hidden', false);
    // }

    // function fadeOut() {
    //   svg
    //     .selectAll('circle')
    //     .transition()
    //     .style('opacity', function(d) {
    //       opacity(d.value.d.value.poplandratio);
    //     });

    //   // and, ...clumsy!
    //   d3.selectAll('.annotation.top10').classed('hidden', false);

    //   d3.selectAll('.annotation:not(.top10)').classed('hidden', true);
    // }
  }

  /**
   * toggle
   * Toggle which year to show
   *
   * @param {*} index
   */
  function toggle(y) {
    if (y) year = y;
    else year = year === 2019 ? 2020 : 2019;
    update();
  }

  /**
   * parse
   * Parse data when loaded
   * @param {*} input
   * @returns data with type coercing
   */
  function parse(input) {
    return input;
    // const output = {};
    // for (const k in input) {
    //   if (isNaN(k)) {
    //     output[k] = input[k];
    //   } else {
    //     output[k] = +input[k];
    //   }
    // }
    // return output;
  }

  /**
   * aggregateByDimension
   * @docs http://learnjsdata.com/group_data.html
   * @param {*} dimension
   * @param {*} data
   * @returns totals
   */
  function aggregateByDimension(dimension, data) {
    const keys = d3.keys(data[0]).slice(2);
    const totals = d3
      .nest()
      .key(function(d) {
        return d[dimension];
      })
      .rollup(function(v) {
        // console.log(v.length)
        const row = {};
        keys.forEach(function(k) {
          row.merged = v.length > 1;
          row[k] = Math.round(
            d3.sum(v, function(d) {
              return d[k];
            })
          );
          row.name = v[0][dimension];
        });
        // test later!
        // if(row.name === 'Rennesøy') {
        //   console.log(row)
        // }
        return row;
      })
      .entries(data);

    // timeRange.forEach( function(y) {
    //   sumTotals[y] = d3.nest()
    //     .rollup(function(values) { return d3.sum(values, function(d) { return d[y]; }); })
    //     .object(data);
    // });

    return totals;
  }

  function getMerged(data) {
    const keys = d3.keys(data[0]).slice(2);
    const totals = d3
      .nest()
      .key(function(d) {
        return d[2020];
      })
      .rollup(function(v) {
        const row = {};
        keys.forEach(function(k) {
          if (v.length > 1) {
            row[k] = Math.round(
              d3.sum(v, function(d) {
                return d[k];
              })
            );
            row.name = v[0][2020];
          }
        });
        // test later!
        if (row.name === 'Rennesøy') {
          console.log(row);
        }
        return row;
      })
      .entries(data);

    return totals;
  }

  return {
    render: render,
    toggle: toggle
    // sortStack: sortStack,
    // type: type
  };
})(window, d3);
