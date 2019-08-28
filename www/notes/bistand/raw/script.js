/* jshint laxbreak: true */
/* jshint expr: true */
/* global d3 */
/* context dependent style sheet loading */
function inIframe () {
 'use strict';
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
if(inIframe()){
  document.getElementById('pageStyle').setAttribute('href', 'style-simple.css');
}

var Chart = (function(window,d3) {
  /* jshint validthis: true */
  /*jshint latedef:false*/
 'use strict';

  var width,
      height,
      margin,
      isMobileIsh,
      token = 0,
      locale = 'no',
      showPercentage = false,
      sortOrder = showPercentage ? d3.stackOrderDescending : d3.stackOrderReverse,
      duration = 1500,
      delay = 2000,

      svg = d3.select('svg'),
      g = svg.append('g'),
      segments = g.append('g').attr('class', 'segments'),
      xAxis = g.append('g').attr('class', 'axis axis--x'),
      govGroup = g.append('g').attr('class', 'gov'),
      curtain = g.append('rect').attr('class', 'curtain'), // removed after initial render
      tooltip = d3.select('.tooltip'),
      segment,
      labels,
      govLines,
      govLabels,

      x,
      y,
      color,

      // t = d3.transition().duration(850).ease(d3.easeCubicInOut),
      goverments,
      schemes = ['Greens','YlOrRd','PuBu'],
      timeRange = d3.range(1999, 2017),
      formatYear = d3.timeFormat('%Y'),
      parseYear = d3.timeParse('%Y'),

      area,
      stack,
      aggregatedData = [],
      layers = [],
      series = [],

      no = d3.map()
      .set('Africa', 'Afrika')
      .set('America', 'Amerika')
      .set('Asia', 'Asia')
      .set('Europe', 'Europa')
      .set('The Middle East', 'Midtøsten')
      .set('Oceania', 'Oseania')
      .set('Global unspecified', 'Globalt')
      .set('Multilateral', 'Multilateralt')
      .set('Administration', 'Aministrasjon')
      .set('Governance and Civil Society', 'Forvaltning og sivilt samfunn')
      .set('Conflict Resolution', 'Konflikt')
      .set('Economic development and trade', 'Finans og handel')
      .set('Education', 'Utdanning')
      .set('Health and social services', 'Helse og inrastruktur')
      .set('Environment and energy', 'Miljø og energi')
      .set('Emergency assistance', 'Nødhjelp')
      .set('Multilateral', 'Multilateral')
      .set('Admin & Multilateral', 'Administrasjon og multilateralt')
      .set('Migrants in Norway', 'Flyktninger i Norge')
      .set('Unspecified', 'Uspesifisert')
      .set('Multilateral (other)','Multilateralt')
      .set('UN','FN')
      .set('World Bank','')
      .set('Norwegian NGOs','Norske NGOer')
      .set('Int. & local NGOs','Internasjonale NGOer')
      .set('Public sector (in Norway)','Offentlig sektor i Norge')
      .set('Public sector (recipient)','Offentlig sektor ute')
      .set('Other','Andre');

  // d3.csv('geo.csv', parse, init);
  d3.queue()
    .defer(d3.csv, 'geo.csv', parseRow)
    .defer(d3.csv, 'sector.csv', parseRow)
    .defer(d3.csv, 'partner.csv', parseRow)
    .defer(d3.csv, 'gov.csv', parseGov)
    .await(init);

  /**
   * init chart
   */
  function init(error, geo, sector, partner, gov) {

    if (error) { throw error; }

    aggregatedData.push(aggregateByDimension('Verdensdel', geo));
    aggregatedData.push(aggregateByDimension('Sektorgruppe', sector));
    aggregatedData.push(aggregateByDimension('Mygroup', partner));

    // re-stack data as functional series. NB: SE OGSÅ http://learnjsdata.com/group_data.html
    timeRange.forEach( function(y) {
      var row = { year: parseYear(y) };
      aggregatedData.forEach( function(data) {
        for (var d in data[0]) {
          if(showPercentage) {
            row[d] = Math.round(data[0][d][y] / data[1][y] * 100);
          } else {
            row[d] = data[0][d][y];
          }
        }
      });
      series.push(row);
    });

    // gov
    goverments = gov;

    update();
    // setTimeout(step, delay, 2);

  }

  /**
   * Updates stack, layers, segments and layers on datachange
   */
  function update() {

    // ref:https://github.com/d3/d3-shape/blob/master/README.md#stack
    stack = d3.stack()
      .keys(Object.keys(aggregatedData[token][0]))
      .order(sortOrder)
      .offset(d3.stackOffsetWiggle);

    if(showPercentage) {
      stack.offset(d3.stackOffsetExpand);
    }

    layers = stack(series);

    // Ref: https://github.com/d3/d3-selection#joining-data
    segment = segments.selectAll('path').data(layers);
    segment.enter()
           .append('path')
           .attr('class', 'segment')
           .on('mouseover', mouseOver)
           .on('mouseout', mouseOut)
           .on('mousemove', mouseMove)
           .merge(segment);
    segment.exit().remove();

    labels = segments.selectAll('text').data(layers);
    labels.enter()
          .append('text')
          .attr('class', 'label')
          .merge(labels);
    labels.exit().remove();

    govLines = govGroup.selectAll('line').data(goverments);
    govLines.enter()
            .append('line')
            .merge(govLines);
    govLines.exit().remove();

    govLabels = govGroup.selectAll('text').data(goverments);
    govLabels.enter()
            .append('text')
            .attr('class', 'label')
            .merge(govLabels);
    govLabels.exit().remove();

    color = d3.scaleSequential(d3['interpolate' + schemes[token]]).domain([-4, 9]); // -4 to skip the lighter end of the scale

    render();

  }


  /**
   * render
   */
  function render() {

    setDimensions(window.innerWidth);

    // scales
    x = d3.scaleTime()
          .domain([parseYear(1999), parseYear(2016)])
          .range([0, width]);

    y = d3.scaleLinear()
          .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
          .range([height, 0]);

    area = d3.area()
          .x(function(d) {return x(d.data.year); })
          .y0(function(d) {return y(d[0]) - 0.2; }) // .2 spacing, ref: https://bl.ocks.org/HarryStevens/c893c7b441298b36f4568bc09df71a1e
          .y1(function(d) {return y(d[1]) + 0.2; })
          // .curve(d3.curveBasis);
          .curve(d3.curveCardinal);

    // draw
    svg.attr('width', (width + margin.left + margin.right ))
       .attr('height', (height + margin.top + margin.bottom));

    g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // layers
    segments.selectAll('.segment')
      .transition().duration(850).ease(d3.easeCubicInOut)
        .attr('d', function(d) { return area(d); })
        .attr('fill', function(d) { return color(d.index); });

    // labels
    segments.selectAll('.label')
      .attr('x', 13)
      .attr('dy', '0.35em')
      .attr('transform', 'translate(' + width + ')')
      .style('fill', function(d) { return color(d.index); })
      .style('opacity', 0 )
      .text(function(d) { return lang(d.key); })
      .transition().duration(850).ease(d3.easeCubicInOut)
        .style('opacity', 1 )
        .attr('transform', function(d) {
          return 'translate(' + width + ',' + y(d[17][1] - (d[17][1] - d[17][0])/2) + ')';
        });

    xAxis.attr('transform', 'translate(0,' + 0 + ')')
        .call(
          d3.axisBottom(x)
          .ticks(d3.timeYear.every(2))
          .tickSizeInner(height)
          .tickSizeOuter(0)
          .tickPadding(- (height / 2) - 10)
        )
        .select('.tick:last-of-type text')
          .attr('dx', -5)
          .style('text-anchor', 'end');


    govGroup.selectAll('line')
            .attr('x1', function (d) { return x(d.start); })
            .attr('y1', 28)
            .attr('x2', function (d) { return x(d.start)+3; })
            .transition().duration(350).ease(d3.easeCubicInOut)
            .attr('y2', function (d, i) {
              var modifier = showPercentage ? 0.25 : -1;
              return height + (( i%2 ? 50 : 25 ) * modifier) ;
            })
            .attr('stroke-width', function (d, i) { return i ? 1 : 0; });

    govGroup.selectAll('.label')
            .attr('text-anchor', function (d, i) { return i === 0 ? 'end' : 'start'; })
            .transition().duration(350).ease(d3.easeCubicInOut)
            .attr('transform', function(d, i) {
              var modifier = showPercentage ? 0.75 : -1;
              var xPos = i === 0 ? x(d.end) : x(d.start);
              var yPos = height + (( i%2 ? 40 : 15 ) * modifier);

              return 'translate(' + xPos + ',' + yPos + ')';
            });

    govGroup.selectAll('tspan').remove();
    govGroup.selectAll('.label').append('tspan')
             .text(function(d) { return d.pm; })
             .attr('x', function (d, i) { return i === 0 ? -10 : -1; })
             .attr('dy', '0.35em');

    govGroup.selectAll('.label').append('tspan')
             .text(function(d) { return '(' + d.parties + ')'; })
             .attr('x', function (d, i) { return i === 0 ? -10 : -1; })
             .attr('dy', '1.35em')
             .style('font-size', '10px');


    // position caption and credits
    // var caption = d3.select('.caption');
    // var captionOffset = Math.max(0, width - caption.node().getBoundingClientRect().width)/2;
    // caption.style('left',  captionOffset + 'px');

    // Animate curtain on first render only
    g.select('.curtain')
     .attr('x', -1 * width)
     .attr('y', -1 * height)
     .attr('height', height)
     .attr('width', width)
     .attr('transform', 'rotate(180)')
     .style('fill', '#fcfcfc')
     .transition().duration(850).ease(d3.easeCubicInOut)
      .attr('width', 0)
      .remove();

  }

  // auxiliary functions
  function lang(s) {

      if(locale === 'no' && no.has(s)) {
        return no.get(s);
      }
      return s;
  }


  function mouseOver () {
    d3.select(this).classed('hover', true);
  }

  function mouseOut () {
    d3.select(this).classed('hover', false);
    tooltip.classed('hidden', true);
  }

  function mouseMove (d) {
    var mouse = d3.mouse(this),
        mouseX = mouse[0],
        aligner = -2 + (width - mouseX) / (width / 2),
        year = formatYear(d3.timeYear.round(x.invert(mouseX))),
        // year = formatYear(x.invert(mouseX)),
        data = d.filter(function(a) { return formatYear(a.data.year) === year; })[0].data,
        segment = d.key;

    if(data.hasOwnProperty(segment)) {

      var value = d3.format('s')(data[segment]);
      var percent = d3.format('.0%')(data[segment] / aggregatedData[0][1][year]);

      tooltip.select('.segment').text(lang(segment));
      tooltip.select('.year').text(year);
      tooltip.select('.value').text(showPercentage ? percent : value);

      tooltip.style('left', ( mouseX + (90 * aligner) ) +'px')
             // .style('color', color(d.index))
             // .style('top', '100px')
             .classed('hidden', false);
    }
  }

  function toggle(index) {
    token = index ? index-1 : token++;
    if (token === series.length) {
      token = 0;
    }
    update();
  }

  function sortStack() {
    sortOrder = sortOrder ===  d3.stackOrderInsideOut ? ( showPercentage ? d3.stackOrderDescending : d3.stackOrderReverse ) : d3.stackOrderInsideOut;
    update();
  }

  function type() {
    showPercentage = !showPercentage;
    sortOrder = showPercentage ? d3.stackOrderDescending : d3.stackOrderReverse;
    if (event) {
      event.target.textContent = showPercentage ? 'NOK' : '%';
    }
    update();
  }


  function aggregateByDimension(dimension, data) {
    var totals;
    var sumTotals = {};

    totals = d3.nest()
      .key(function(d) { return d[dimension]; })
      .rollup(function(v) {
            var row = {};
            timeRange.forEach( function(y) {
               row[y] = Math.round(d3.sum(v, function(d) {return d[y];}));
            });
          return row;
      })
      .object(data);

    timeRange.forEach( function(y) {
      sumTotals[y] = d3.nest()
        .rollup(function(values) { return d3.sum(values, function(d) { return d[y]; }); })
        .object(data);
    });

    return [totals, sumTotals];
  }

  function parseRow(input) {
    var output = {};
    for (var k in input) {
      if(isNaN(k)) {
        output[k] = input[k];
      } else {
        output[k] = +input[k];
      }
    }
   return output;
  }

  function parseGov(d) {
    var parser = d3.timeParse('%d.%m.%Y');
    return {
      start: parser(d.start),
      end: parser(d.end),
      pm: d.pm,
      parties: d.parties
    };
  }

  function stackMax(layer) {
    return d3.max(layer, function(d) { return d[1]; });
  }

  function stackMin(layer) {
    return d3.min(layer, function(d) { return d[0]; });
  }

  function setDimensions(window) {
      isMobileIsh = window <= 470;
      if (isMobileIsh) {
        margin = {top: 20, right: 20, bottom: 10, left: 10 };
      } else {
        margin = {top: 30, right: 200, bottom: 50, left: 20 };
      }

      width = Math.min(window, 970) - margin.left - margin.right;
      height = width/1  - margin.top - margin.bottom;

  }

  function step (i) {
    if ( i >= 75) {
      sortStack();
    } else if (i > 50) {
      type();
    } else {
      toggle(Math.min(Math.round(i/10),3));
    }
    i = Math.random() * 100 | 4;
    setTimeout(step, delay, i);
  }

  return {
    render : render,
    toggle : toggle,
    sortStack : sortStack,
    type: type,
  };

})(window,d3);

window.addEventListener('resize', Chart.render);  // should debounce...
