/**
 * @license
 * Copyright 2015 Petr Shevtsov (petr.shevtsov@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 * 
 * Original modified in 2020-04 by Tom Humphries (tom.humph@gmail.com)
 */

/*global Dygraph:false */
/*jshint globalstrict: true */
Dygraph.Plugins.CrosshairFixed = (function() {
  "use strict";

  /**
   * Creates the crosshair
   *
   * @constructor
   */

  var crosshair = function(opt_options) {
    this.canvas_ = document.createElement("canvas");
    opt_options = opt_options || {};
    this.direction_ = opt_options.direction || null;
  };

  crosshair.prototype.toString = function() {
    return "Crosshair Fixed Plugin";
  };

  /**
   * @param {Dygraph} g Graph instance.
   * @return {object.<string, function(ev)>} Mapping of event names to callbacks.
   */
  crosshair.prototype.activate = function(g) {
    this.dygraph_ = g;
    g.graphDiv.appendChild(this.canvas_);
    // mouseout causes the placed crosshair to be removed when moving the cursor off the chart
    // we want the crosshairs to be placed with a click, and stay on the chart
    removeEvent(window, 'mouseout', this.dygraph_.mouseOutHandler_)
    // moving the cursor across the chart caused the selected point to change and updated the crosshairs
    // we want to update the selected point with a click instead
    removeEvent(this.dygraph_.mouseEventElement_, 'mousemove', this.dygraph_.mouseMoveHandler_)
    // add a replacement event 'click' and have it act the same way as 'mousemove'
    this.dygraph_.addAndTrackEvent(this.dygraph_.mouseEventElement_, 'click', this.dygraph_.mouseMoveHandler_); // Don't recreate and register the resize handler on subsequent calls.
    return {
      select: this.select,
      deselect: this.deselect
    };
  };

  function removeEvent(elem, type, fn) {
    elem.removeEventListener(type, fn, false);
  }

  crosshair.prototype.select = function(e) {
    if (this.direction_ === null) {
      return;
    }

    var width = e.dygraph.width_;
    var height = e.dygraph.height_;
    this.canvas_.width = width;
    this.canvas_.height = height;
    this.canvas_.style.width = width + "px";    // for IE
    this.canvas_.style.height = height + "px";  // for IE

    var ctx = this.canvas_.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(125, 125, 125,1)";
    ctx.beginPath();

    var canvasx = Math.floor(e.dygraph.selPoints_[0].canvasx) + 0.5; // crisper rendering

    if (this.direction_ === "vertical" || this.direction_ === "both") {
      ctx.moveTo(canvasx, 0);
      ctx.lineTo(canvasx, height);
    }

    if (this.direction_ === "horizontal" || this.direction_ === "both") {
      for (var i = 0; i < e.dygraph.selPoints_.length; i++) {
        var canvasy = Math.floor(e.dygraph.selPoints_[i].canvasy) + 0.5; // crisper rendering
        ctx.moveTo(0, canvasy);
        ctx.lineTo(width, canvasy);
      }
    }

    ctx.stroke();
    ctx.closePath();
  };

  crosshair.prototype.deselect = function(e) {
    var ctx = this.canvas_.getContext("2d");
    ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
  };

  crosshair.prototype.destroy = function() {
    this.canvas_ = null;
  };

  return crosshair;
})();
