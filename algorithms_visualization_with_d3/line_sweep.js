/*
 * CONSTANTS
 */
TICK_INTERVAL = 1000; // ms
POINT_RADIUS = 5;

var isAlgorithmRunning = false;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.svgElement = null;
    }
}


var svg = d3
.select('body')
.append('svg')
.attr('width', 500)
.attr('height', 500)

var dataset = [];

var pointAttrs = {
    cx: function(point) { return (point.x); },
    cy: function(point) { return (point.y); },
};

svg
.on('click', function() {
    if (isAlgorithmRunning) return;
    var coordinates = d3.mouse(this);
    dataset.push(new Point(Math.floor(coordinates[0]), Math.floor(coordinates[1])));

    svg
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', point => point.x)
    .attr('cy', point => point.y)
    .attr('r', POINT_RADIUS)
    .attr('dummy', function(point) {
        // save the reference of the svg element
        // representing this point, used while running
        // the algorithm. Do not use () => {} function
        // syntax because the variable `this` needs to 
        // store refer to the element (the context from)
        // which this function was called
        point.svgElement = this;
    })
    .on('click', function(d, i) {
        // point clicked, remove point
        if (isAlgorithmRunning) return;
        dataset.pop(i);
        this.remove();
        d3.event.stopPropagation();
    })
    .on('mouseover', onMouseOver)
    .on('mouseout', onMouseOut)
})

function onMouseOver(point, index) {
    d3
    .select(this)
    .attr('fill', 'orange')
    .attr('r', POINT_RADIUS*2);

    svg
    .append('text')
    .attr('id', 't' + point.x + '-' + point.y + '-' + index)  // Create an id for text so we can select it later for removing on mouseout
    .attr('x', function() { return point.x - 30; })
    .attr('y', function() { return point.y - 15; })
    .text(() => [point.x, point.y])
}

function onMouseOut(point, index) {
    d3
    .select(this)
    .attr('fill', 'black')
    .attr('r', POINT_RADIUS);

    // remove text
    svg
    .select('#t' + point.x + '-' + point.y + '-' + index)
    .remove();
}

d3
.select('#run-algorithm-button')
.on('click', () => {
    isAlgorithmRunning = true;
    findConvexHull(dataset);
})

/*
 * ALGORITHM IMPLEMENTATION
 */

function tick(interval = TICK_INTERVAL) {
    return new Promise((fulfill, reject) => {
        setTimeout(() => fulfill(), interval);
    })
}

function partOfUpperHull(p1, p2, p3) {
    var theta1 = Math.atan((p2.y - p1.y)/(p2.x - p1.x));
    var theta2 = Math.atan((p3.y - p2.y)/(p3.x - p2.x));
    return theta2 < theta1;
}

function partOfLowerHull(p1, p2, p3) {
    var theta1 = Math.atan((p2.y - p1.y)/(p2.x - p1.x));
    var theta2 = Math.atan((p3.y - p2.y)/(p3.x - p2.x));
    return theta2 > theta1;
}

function drawLineBetweenPoints(p1, p2) {
    return svg
    .append('line')
    .attr('x1', p1.x)
    .attr('y1', p1.y)
    .attr('x2', p2.x)
    .attr('y2', p2.y)
    .style('stroke', 'rgb(0, 0, 0)')
    .style('stroke-width', 2)
}

function findConvexHull(dataset) {
    // sort
    dataset.sort((p1, p2) => {
        if (p1.x !== p2.x) return p1.x - p2.x;
        else return p1.y - p2.y;
    })

    // instert the first to points in LUpper
    var LUpper = [...dataset.slice(0, 2)];
    var LUpperLines = [];
    var LLower = [...dataset.slice(dataset.length - 2, dataset.length).reverse()]
    var LLowerLines = [];
    console.log(LLower)

    var computeUpperHull = (dataset, index) => {
        if (index === dataset.length) return Promise.resolve();
        return Promise.resolve()
        .then(() => {
            LUpper.push(dataset[index]);
            LUpperLines.push(drawLineBetweenPoints(LUpper[LUpper.length - 1], LUpper[LUpper.length - 2]));
        })
        .then(() => {
            // TODO check 
            var g = () => {
                if ((LUpper.length > 2) && !partOfUpperHull(LUpper[LUpper.length - 1], LUpper[LUpper.length - 2], LUpper[LUpper.length - 3])) {
                    return tick()
                    .then(() => {
                        LUpper.splice(LUpper.length - 2, 1);
                        LUpperLines.pop().remove();
                    })
                    .then(() => tick(300))
                    .then(() => {
                        LUpperLines.pop().remove();
                    })
                    .then(() => tick(300))
                    .then(() => {
                        LUpperLines.push(drawLineBetweenPoints(LUpper[LUpper.length - 1], LUpper[LUpper.length - 2]));
                    })
                    .then(g);
                } else return Promise.resolve();
                
            }
            return g();
        })
        .then(tick)
        .then(() => computeUpperHull(dataset, index+1))
    }

    var computeLowerHull = (dataset, index) => {
        if (index === -1) return Promise.resolve();
        return Promise.resolve()
        .then(() => {
            LLower.push(dataset[index]);
            LLowerLines.push(drawLineBetweenPoints(LLower[LLower.length - 1], LLower[LLower.length - 2]));
            return Promise.resolve();
        })
        .then(() => {
            // TODO check 
            var g = () => {
                if ((LLower.length > 2) && !partOfUpperHull(LLower[LLower.length - 1], LLower[LLower.length - 2], LLower[LLower.length - 3])) {
                    return tick()
                    .then(() => {
                        LLower.splice(LLower.length - 2, 1);
                        LLowerLines.pop().remove();
                    })
                    .then(() => tick(300))
                    .then(() => {
                        LLowerLines.pop().remove();
                    })
                    .then(() => tick(300))
                    .then(() => {
                        LLowerLines.push(drawLineBetweenPoints(LLower[LLower.length - 1], LLower[LLower.length - 2]));
                    })
                    .then(g);
                } else return Promise.resolve();
                
            }
            return g();
        })
        .then(tick)
        .then(() => computeLowerHull(dataset, index-1))
    }

    Promise.resolve()
    .then(() => {
        LUpperLines.push(drawLineBetweenPoints(LUpper[0], LUpper[1]));
    })
    .then(tick)
    .then(() => computeUpperHull(dataset, 2))
    .then(tick)
    .then(() => LLowerLines.push(drawLineBetweenPoints(LLower[0], LLower[1])))
    .then(tick)
    .then(() => computeLowerHull(dataset, dataset.length - 3))
}