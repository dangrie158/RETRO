var blessed = require('blessed'),
    retro = require('../lib/retro'),
    widgets = retro.Widgets;

//This is the Object that holds all emenets we want
//to access in our controller
scope = {};

scope.title = widgets.title({
    content: 'AMAZON - PRODUCT DETAIL'
});
scope.commandbar = widgets.commandbar({
    commands: ['{A}dd to Cart', '', '{H}ome', '{B}ack']
});

scope.content = blessed.box({
    top: 1,
    bottom: 1,
    left: 0,
    style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    width: '100%'
});

scope.description = blessed.box({
    parent: scope.content,
    scrollable: true,
    alwaysScroll: true,
    top: 1,
    bottom: 1,
    left: 0,
    width: '65%',
    style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    scrollbar: {
        ch: ' ',
        track: {
          bg: 'black'
        },
        style: {
          inverse: true
        }
    },
    border: {
        type: 'ascii',
        fg: 'lightgreen',
        bg: 'black'
    }
});

scope.info = blessed.box({
    parent: scope.content,
    top: 1,
    bottom: 1,
    right: 0,
    width: '34%',
    style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    border: {
        type: 'ascii',
        fg: 'lightgreen',
        bg: 'black'
    }
});

/*
 * POPUP STUFF
 */
scope.popup = retro.Widgets.Popups.InputPopup({
    label: 'ADD TO CART',
    action: 'Add to cart',
    inputTitle: 'Enter the quantity'
});

scope.error = retro.Widgets.Popups.ErrorPopup({
    label: 'ERROR'
});

module.exports = scope;