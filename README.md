# dygraphs "FixedCrosshairs" Plugin

This is a plugin for [dygraphs](http://dygraphs.com/) that places crosshairs when the chart is clicked.

It is a modification to the [original crosshairs plugin](https://github.com/danvk/dygraphs/blob/master/src/extras/crosshair.js) that updated the crosshair location when the cursor was moved over the chart.

## Usage

Import the file and use it like any other. It takes the same constructor as the original crosshairs Plugin.

```
plugins: [
    new Dygraph.Plugins.FixedCrosshair({
        direction: "both"
    })
]
```

## About

The modification itself is small: in the `activate()` call we remove the `'mousemove'` event and replace it with a `'click'` event. The stops points being selected when the cursor is moved over the chart. We also remove the ```'mouseout'``` event stop the crosshairs being removed when the cursor is moved off the chart.

```
crosshair.prototype.activate = function(g) {
    this.dygraph_ = g;
    g.graphDiv.appendChild(this.canvas_);
    removeEvent(window, 'mouseout', this.dygraph_.mouseOutHandler_)
    removeEvent(this.dygraph_.mouseEventElement_, 'mousemove', this.dygraph_.mouseMoveHandler_)
    this.dygraph_.addAndTrackEvent(this.dygraph_.mouseEventElement_, 'click', this.dygraph_.mouseMoveHandler_);
    return {
        select: this.select,
        deselect: this.deselect
    };
  };

function removeEvent(elem, type, fn) {
    elem.removeEventListener(type, fn, false);
}
```
