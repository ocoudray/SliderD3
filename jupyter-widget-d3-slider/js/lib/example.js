var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var d3_slider = require('./slider');


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.


var HelloModel = widgets.DOMWidgetModel.extend({
	defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
		_model_name: 'HelloModel',
		_view_name: 'HelloView',
		_model_module: 'jupyter-widget-d3-slider',
		_view_module: 'jupyter-widget-d3-slider',
		_model_module_version: '0.1.0',
		_view_module_version: '0.1.0',
		value: 'Hello World'
	})
});


// Custom View. Renders the widget model.
var HelloView = widgets.DOMWidgetView.extend({
	render: function () {
		this.value_changed();
		this.model.on('change:value', this.value_changed, this);
	},

	value_changed: function () {
		this.el.textContent = this.model.get('value');
	}
});


var SliderModel = widgets.DOMWidgetModel.extend({
	defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
		_model_name: 'SliderModel',
		_view_name: 'SliderView',
		_model_module: 'jupyter-widget-d3-slider',
		_view_module: 'jupyter-widget-d3-slider',
		_model_module_version: '0.1.0',
		_view_module_version: '0.1.0',
		value: 1.0
	})
});

// derived from https://bl.ocks.org/mbostock/6452972
var SliderView = widgets.DOMWidgetView.extend({
	render: function () {

		console.log('start render');

		// explicit
		var that = this;

		// build svg and append it to dom
		d3_slider.create(that);

		// event listener
		that.model.on('change:value', that.value_changed, that);

		// debug
		window.dom = that.el;
	},

	value_changed: function () {

		console.log('start value_changed');

		// explicit
		var that = this;

		// update
		d3_slider.value_changed(that);
	}
});

module.exports = {
	HelloModel: HelloModel,
	HelloView: HelloView,
	SliderModel: SliderModel,
	SliderView: SliderView
};

