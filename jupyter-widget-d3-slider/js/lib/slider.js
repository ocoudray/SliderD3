
var d3 = require('d3');
require('./slider.less');



var create = function (that) {
	console.log('start create');

	// create svg element
	var svgElmt = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svgElmt.setAttribute('width', '900');
	svgElmt.setAttribute('height', '100');

	// append svg element to dom
	that.el.appendChild(svgElmt);

	that.el.setAttribute('class', 'jupyter-widget d3-slider');

	// d3 select 
	var svg = d3.select(svgElmt);
	// .attr('class', 'area');
	window.svg = svg;

	// Attributes
	var margin = { right: 40, left: 40 };
	var width = +svg.attr('width') - margin.left - margin.right;
	var height = +svg.attr('height');

	// scale
	var x = d3.scaleLinear()
		.domain([0, 180])
		.range([0, width])
		.clamp(true);

	// slider
	var slider = svg.append('g')
		.attr('class', 'jupyter-widget d3-slider slider')
		.attr('transform', 'translate(' + margin.left + ',' + height / 2 + ')');

	// build slider and attach drag behavior
	slider.append('line')
		.attr('class', 'jupyter-widget d3-slider track')
		.attr('x1', x.range()[0])
		.attr('x2', x.range()[1])
		.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr('class', 'jupyter-widget d3-slider track-inset')
		.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr('class', 'jupyter-widget d3-slider track-overlay')
		.call(d3.drag()
			.on('start', function () { })
			.on('drag', function () { hue(x.invert(d3.event.x)); that.text.textContent=x.invert(d3.event.x);})
			.on('end', function () { sync_value(x.invert(d3.event.x)); })
		);

	// add ticks to slider
	slider.insert('g', '.track-overlay')
		.attr('class', 'jupyter-widget d3-slider ticks')
		.attr('transform', 'translate(0,' + 18 + ')')
		.selectAll('text')
		.data(x.ticks(10))
		.enter().append('text')
		.attr('x', x)
		.attr('text-anchor', 'middle')
		.text(function (d) { return d + '°'; });

	// add handle to slider
	var handle = slider.insert('circle', '.track-overlay')
		.attr('class', 'jupyter-widget d3-slider handle')
		.attr('r', 7);

	// function to move handle and color background for a given h(ue)
	var hue = function (h) {
		handle.attr('cx', x(h));
		svg.style('background-color', d3.hsl(h, 0.8, 0.8));
	};

	// function to sync js value to model
	var sync_value = function (h) {
		that.model.set({ 'value': h });
		that.model.save_changes();
		that.text.textContent = h; // update text content
	};

	// init values
	var h = that.model.get('value');

	// direct set
	// hue(h);

	// // tweened intro
	slider.transition()
		.duration(750)
		.tween('hue', function () {
			var i = d3.interpolate(0, h);
			return function (t) { hue(i(t)); };
		});

	// store for value_changed
	// that is an object to which you can attach stuff
	// for later use in value_changed()
	that.hue = hue;
	// that.slider = slider;

	// add text to display value while dragging
	var text = document.createElement("p");
	text.setAttribute("style", "text-align : center");
	text.textContent = h;
	that.el.appendChild(text);
	that.text = text;

	console.log('end create');	
};


var value_changed = function (that) {

	var prev_h = that.model.previous('value');
	var new_h = that.model.get('value');

	// debug
	console.log('prev_h = ' + prev_h + ', new_h = ' + new_h);

	// collect function hue store in that during render()
	var hue = that.hue;
	// var slider = that.slider;

	// direct set
	hue(new_h);

	// update text value
	that.text.textContent = new_h;
	// tweened move - works but does not fit
	// jupyter-widget 1 model - many views concept
	// slider.transition()
	// 	.duration(750)
	// 	.tween('hue', function () {
	// 		var i = d3.interpolate(prev_h, new_h);
	// 		return function (t) { hue(i(t)); };
	// 	});
};



var slider = {
	create: create,
	value_changed: value_changed
};

module.exports = slider;

