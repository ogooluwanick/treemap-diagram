// API url
const URL = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

// retrieve data
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(d3.json(URL));
    }, 300);
});

promise.then((data) => {

    // svg + legend dimensions
    const width = 1080;
    const height = 600;

    // create an object that pairs each platform with a color
    const consoleColors = {
        "3DS": "#5e0106",
        "Wii": "#7e0209",
        "DS": "#bd030c",
        "N64": "#be6166",
        "GBA": "#be9093",
        "SNES": "#FC0411",
        "GB": "#fe8289",
        "NES": "#fec0c4",
        "PS4": "#07002e",
        "PS3": "#67608e",
        "PSP": "#8a80be",
        "PS2": "#13007C",
        "PS": "#c4bfde",
        "XOne": "#436635",
        "X360": "#87CC69",
        "XB": "#aadd9f",
        "PC": "#c2c2c2",
        "2600": "#777777"
    }; 

    // create the tooltip for each rect element
    const tip = d3.tip()
                  .attr('id', 'tooltip')
                  .attr('class', 'd3-tip')
                  .html((d) => {
                      d3.select('#tooltip').attr('data-value', d.data.value);

                      return `
                        <h3>${d.data.name} (${d.data.category})</h3>
                        <p>${d.data.value} units sold</p>
                      `;
                  });

    // create svg area
    const svg = d3.select('#container')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .call(tip);     
                  
    // create treemap layout
    const treemap = d3.treemap()
                      .size([width, height]);              

    // create root node
    const root = d3.hierarchy(data)
                   .sum((d) => d.value)
                   .sort((a, b) => b.height - a.height || b.value - a.value);              

    // pass root node into treemap
    treemap(root);

    // create and place a g element for each group of data
    const cell = svg.selectAll('.cell')
                    .data(root.leaves())
                    .enter()
                    .append('g')
                    .attr('class', 'cell')
                    .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);             
    
    // append a rect to each cell and calculate the dimensions                
    cell.append('rect')
        .attr('class', 'tile')
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .style('fill', (d) => consoleColors[d.data.category])
        .style('stroke', 'black')
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // create and append text to each tile    
//     cell.append('text')
//         .attr('class', 'tile-text')
//         .attr('transform', 'translate(5, 15)')
//         .style('fill', 'white')
//         .text((d) => `${d.data.name }  (${d.data.value} units)`)
//         .attr('id', 'cell-text')

        cell
      .append('text')
      .attr('class', 'tile-text')
      .selectAll('tspan')
      .data(function (d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter()
      .append('tspan')
      .attr('x', 4)
      .attr('y', function (d, i) {
        return 13 + i * 10;
      })
        .style('fill', 'white')
        .style('font-size', '12px')

      .text(function (d) {
        return d;
      });

    // create legend and legend dimensions
    const legendWidth = 960;
    const legendHeight = 50;
    const legendPadding = 20;
    const categories = Object.keys(consoleColors);

    const legend = d3.select('#legend')
                     .append('svg')
                     .attr('width', legendWidth)
                     .attr('height', legendHeight);

    const legendAxis = d3.scaleLinear()
                         .domain([0, categories.length])
                         .range([legendPadding, legendWidth - legendPadding]);                 

    legend.selectAll('rect')
          .data(categories)
          .enter()
          .append('rect')
          .attr('class', 'legend-item')
          .attr('x', (d, i) => legendAxis(i))
          .attr('y', 0)
          .attr('width', 20)
          .attr('height', 20)
          .style('fill', (d) => consoleColors[d])
          .style('stroke', 'black');
          
    legend.selectAll('text')
          .data(categories)
          .enter()
          .append('text')
          .attr('class', 'legend-text')
          .attr('x', (d, i) => legendAxis(i))
          .attr('y', 40)
          .style('fill', 'black')
          .text((d) => d);
});