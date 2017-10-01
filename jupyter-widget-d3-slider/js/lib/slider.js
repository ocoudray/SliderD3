
var d3 = require('d3');
var slider_css = require('./slider.css');



var create = function (that) {
	console.log('start create');

	// create svg element
	var svgElmt = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svgElmt.setAttribute('width', '900');
	svgElmt.setAttribute('height', '100');

	// append css to svg element
	var link = document.createElement('link');
	link.href = slider_css;
	link.type = 'text/css';
	link.rel = 'stylesheet';
	svgElmt.appendChild(link);

	// append svg element to dom
	that.el.appendChild(svgElmt);
	console.log('svg added to dom');

	// d3 select 
	var svg = d3.select(svgElmt)
		.attr('class', 'area');
	console.log('svg selected');
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
		.attr('class', 'slider')
		.attr('transform', 'translate(' + margin.left + ',' + height / 2 + ')');

	// build slider and attach drag behavior
	slider.append('line')
		.attr('class', 'track')
		.attr('x1', x.range()[0])
		.attr('x2', x.range()[1])
		.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr('class', 'track-inset')
		.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr('class', 'track-overlay')
		.call(d3.drag()
			.on('start', function () { console.log('start'); })
			.on('drag', function () { console.log('drag'); hue(x.invert(d3.event.x)); })
			.on('end', function () { console.log('end'); sync_value(x.invert(d3.event.x)); })
		);

	// add ticks to slider
	slider.insert('g', '.track-overlay')
		.attr('class', 'ticks')
		.attr('transform', 'translate(0,' + 18 + ')')
		.selectAll('text')
		.data(x.ticks(10))
		.enter().append('text')
		.attr('x', x)
		.attr('text-anchor', 'middle')
		.text(function (d) { return d + '°'; });

	// add handle to slider
	var handle = slider.insert('circle', '.track-overlay')
		.attr('class', 'handle')
		.attr('r', 9);

	// function to move handle and color background for a given h(ue)
	var hue = function (h) {
		handle.attr('cx', x(h));
		svg.style('background-color', d3.hsl(h, 0.8, 0.8));
	};

	// function to sync js value to model
	var sync_value = function (h) {
		that.model.set({ 'value': h });
		that.model.save_changes();
	};

	// init values
	var h = that.model.get('value');

	// direct set
	hue(h);

	// // tweened intro
	// slider.transition()
	// 	.duration(750)
	// 	.tween('hue', function () {
	// 		var i = d3.interpolate(0, h);
	// 		return function (t) { hue(i(t)); };
	// 	});

	// store for value_changed

};


var value_changed = function (that) {

	var prev_h = that.model.previous('value');
	var new_h = that.model.get('value');

	// debug
	window.prev_h = prev_h;
	window.new_h = new_h;


	// REPEAT RENDER - VERY INEFFICIENT
	var handle = d3.selectAll('.handle'); // selectAll is key
	var svg = d3.selectAll('.area'); // selectAll is key

	var margin = { right: 40, left: 40 };
	var width = +svg.attr('width') - margin.left - margin.right;

	var x = d3.scaleLinear()
		.domain([0, 180])
		.range([0, width])
		.clamp(true);

	var hue = function (h) {
		handle.attr('cx', x(h));
		svg.style('background-color', d3.hsl(h, 0.8, 0.8));
	};
	// END REPEAT

	// direct set
	hue(new_h);

	// // tweened intro
	// var slider = d3.select('.slider');
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

