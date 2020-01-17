
    //
    // all the variables
    //



   const svg = d3
    .create("svg")
    .attr('class', 'chart')
    .attr("viewBox", [0, 0, width, height]);
    // add a rectangle
    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", bg_color);

    // Create the base forces
    const simulation = d3
      .forceSimulation(reshapedData)
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force('collide', forceCollide)
      .stop();

    // create a node to use for text
    const textNode = svg.append('g').attr('class', 'text');

    // Descriptive headline
    textNode
      .append('g')
      .attr('transform', `translate(${margin}, 20)`)
      .append('text')
      .attr('class', 'headline')
      .text(
        `Tabell 07459 - Befolkning, sortert på region, alder og kjønn. Hver sirkel representerer ${personsPerUnit} personer.`
      );

    textNode
      .append('line')
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5)
      .style("stroke-dasharray", '3, 3')
      .attr('class', 'guide')
      .attr('x1', margin)
      .attr('y1', 25)
      .attr('x2', width - margin)
      .attr('y2', 25);

    // grouping message
    textNode
      .append('g')
      .attr('transform', `translate(${width / 2}, 40)`)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0.5)
      .text('Klikk på overskriftene under for å sortere data')
      .attr('class', 'selection-links');

    textNode
      .append('line')
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5)
      .style("stroke-dasharray", '3, 3')
      .attr('class', 'guide')
      .attr('x1', margin)
      .attr('y1', 45)
      .attr('x2', width - margin)
      .attr('y2', 45);

    // first link
    textNode
      .append('g')
      .attr('transform', `translate(${margin}, 60)`)
      .append('text')
      .text('Alder')
      .attr('class', 'selection-links')
      .on('click', d => {
        // remove old axis
        svg.select('.axis-x').remove();
        svg.select('.axis-y').remove();

        // set x axis for age
        svg
          .append('g')
          .attr('class', 'axis-label axis-y')
          .attr('transform', `translate(${2 * margin},${2 * margin})`)
          .call(yAgeAxis);

        simulation.force('x');
        simulation.force('x').x(forceXAge);
        simulation.force('y').y(forceYAge);
        simulation.alpha(1).restart();
        console.log('clicked');
      });

    textNode
      .append('g')
      .attr('transform', `translate(120, 60)`)
      .append('text')
      .text('Kjønn')
      .attr('class', 'selection-links')
      .on('click', d => {
        // remove old axis
        svg.select('.axis-x').remove();
        svg.select('.axis-y').remove();
        // setup the axis
        svg
          .append('g')
          .attr('class', 'axis-label axis-x')
          .attr('transform', `translate(${margin},${height - margin})`)
          .call(xGenderAxis);

        simulation.stop();
        simulation.force('x').x(forceXGender);
        simulation.force('y').y(randomY);
        simulation.alpha(1).restart();
        console.log('clicked');
      });

    textNode
      .append('g')
      .attr('transform', `translate(190, 60)`)
      .append('text')
      .text('Region')
      .attr('class', 'selection-links')
      .on('click', d => {
        // remove old axis
        svg.select('.axis-x').remove();
        svg.select('.axis-y').remove();

        // setup the axis
        svg
          .append('g')
          .attr('class', 'axis-label axis-x')
          .attr('transform', `translate(${margin},${height - margin})`)
          .call(xRegionAxis);

        simulation.stop();
        simulation.force('x').x(forceXRegion);
        simulation.force('y').y(randomY);
        simulation.alpha(1).restart();
        console.log('clicked');
      });

    textNode
      .append('g')
      .attr('transform', `translate(270, 60)`)
      .append('text')
      .text('Alder og Kjønn')
      .attr('class', 'selection-links')
      .on('click', d => {
        // remove old axis
        svg.select('.axis-x').remove();
        svg.select('.axis-y').remove();
        // set x axis for age
        svg
          .append('g')
          .attr('class', 'axis-label axis-y')
          .attr('transform', `translate(${2 * margin},${2 * margin})`)
          .call(yAgeAxis);

        svg
          .append('g')
          .attr('class', 'axis-label axis-x')
          .attr('transform', `translate(${margin},${height - margin})`)
          .call(xGenderAxis);

        simulation.stop();
        simulation.force('x').x(forceXGender);
        simulation.force('y').y(forceYAge);
        simulation.alpha(1).restart();
        console.log('clicked');
      });

    textNode
      .append('g')
      .attr('transform', `translate(400, 60)`)
      .append('text')
      .text('Region og Alder')
      .attr('class', 'selection-links')
      .on('click', d => {
        // remove old axis
        svg.select('.axis-x').remove();
        svg.select('.axis-y').remove();
        // set x axis for age
        svg
          .append('g')
          .attr('class', 'axis-label axis-y')
          .attr('transform', `translate(${2 * margin},${2 * margin})`)
          .call(yAgeAxis);
        // setup the axis
        svg
          .append('g')
          .attr('class', 'axis-label axis-x')
          .attr('transform', `translate(${margin},${height - margin})`)
          .call(xRegionAxis);

        simulation.stop();
        simulation.force('x').x(forceXRegion);
        simulation.force('y').y(forceYAge);
        simulation.alpha(1).restart();
        console.log('clicked');
      });
    //
    // Calculate the space allowed for each circle in the grid
    //
    console.log(
      'circles:',
      normalisedNum,
      'w:',
      availableWidth,
      'h:',
      availableHeight,
      'wr:',
      availableWidth / availableHeight,
      'hr:',
      availableHeight / availableWidth,
      'nr:',
      numRows,
      'nc:',
      numColumns
    );
    const chartNode = svg
      .append('g')
      .attr('class', 'chartnode')
      .attr('transform', `translate(${margin},${margin + textHeight})`);

    // draw the initial grid of circles
    const nodes = chartNode
      .selectAll('g.node')
      .data(reshapedData)
      .join('g')
      .attr('class', 'node')
      .call(g =>
        g
          .attr('transform', (d, i) => {
            const columnPos = (i % numColumns) * w;
            const row = Math.ceil((numRows / normalisedNum) * i);
            const rowPos = row * w;
            return `translate(${columnPos},${rowPos})`;
          })
          .append('circle')
          .attr('r', d => {
            return 6; //sizeScale(d.age)
          })
          .attr('stroke', '#333')
          .attr('stroke-width', 0.3)
          .style('fill', d => colorScale(`${d.sex}_${d.age}`))
          .style('opacity', 0.9)
      );

    simulation.on('tick', () =>
      nodes.attr('transform', d => `translate(${d.x},${d.y})`)
    );

   // invalidation.then(() => svg.remove());
    return svg.node();
    