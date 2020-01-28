/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* global d3 */

const Chart = (function(window, d3) {
  // Set chart properties
  const labels = d3
    .map()
    .set('Befolkning per 1.1. (personer) 2019', 'population')
    .set('Areal (km²) 2019,', 'areal')
    .set('Landareal (km²) 2019', 'land')
    .set('Innbyggere per km² landareal 2019', 'pop-land-ratio');

  // dimensions
  const margin = { top: 30, right: 30, bottom: 30, left: 30 };
  const width = 1000;
  const height = width;
  const diameter = width;

  // colorScheme
  const color = d3.scaleOrdinal(d3.schemeCategory20);

  // Base chart elements
  const svg = d3.select('.chart').append('svg');
  const nodes = svg.append('g').attr('class', 'nodes');
  // const g = svg.append('g');

  // Specific chart elements
  // let bubble = d3.pack();
  // let nodes = d3.hierarchy();

  // data
  let year = 2019;
  let dataset = [];
  let merged = [];

  // load data and send throught parser before initilizing chart
  d3.csv('data.csv', parse, init);

  /**
   * init chart
   */
  function init(error, data) {
    if (error) {
      throw error;
    }

    dataset = data;
    merged = getMerged(dataset);
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
    const communes = aggregateByDimension(year, dataset);

    const bubble = d3
      .pack(communes)
      .size([diameter, diameter])
      .padding(1.5);

    const tree = d3
      .hierarchy({
        name: 'root',
        children: communes
      })
      .sum(function(d) {
        return d.value ? d.value.population : 0;
      });

    // DEBUG
    // console.log(nodes);

    // clear all
    d3.selectAll('.node').remove();

    const b = bubble(tree).descendants();

    // console.log(b);

    const node = nodes.selectAll('g').data(b);
    node
      .enter()
      // .filter(function(d){
      //     return  !d.children
      // })
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .merge(node);
    node.exit().remove();
    // When the chart is ready, we render to the dom.
    render();
  }

  /**
   * Render chart to canvas/dom
   * Anything dependent on browser window dimensions
   */
  function render() {
    // draw
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'bubble');

    d3.selectAll('.node')
      .append('circle')
      .style('fill', function(d, i) {
        return color(i);
      })
      .transition()
      .duration(250)
      .ease(d3.easeCubicInOut)
      .attr('r', function(d) {
        return d.r;
      });

    d3.selectAll('.node')
      .append('text')
      .attr('dy', '.2em')
      .style('text-anchor', 'middle')
      .text(function(d) {
        return d.data.key;
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', function(d) {
        return d.r / 5;
      })
      .attr('fill', 'white');

    d3.selectAll('.node')
      .append('title')
      .text(function(d) {
        // console.log(d);
        return d.data.key + ': ' + d.value;
      });

    //   node
    //     .append('text')
    //     .attr('dy', '.2em')
    //     .style('text-anchor', 'middle')
    //     .text(function(d) {
    //       console.log(d);
    //       return d.data.key.substring(0, d.r / 3);
    //     })
    //     .attr('font-family', 'sans-serif')
    //     .attr('font-size', function(d) {
    //       return d.r / 5;
    //     })
    //     .attr('fill', 'white');
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
