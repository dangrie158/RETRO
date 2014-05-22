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
    commands: ['{A}dd to Cart', '', '', '{B}ack']
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

/*
 * POPUP STUFF
 */
scope.popup = retro.Widgets.Popups.InputPopup({
    label: 'QUANTITY',
    action: 'Add to cart'
});

module.exports = scope;