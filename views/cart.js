var blessed = require('blessed'),
    retro = require('../lib/retro'),
    widgets = retro.Widgets;

//This is the Object that holds all emenets we want
//to access in our controller
scope = {};

scope.title = widgets.title({
    content: 'AMAZON - CART'
});
scope.commandbar = widgets.commandbar({
    commands: ['{O}rder', '{RET}Edit quantity', '{C}lear', '{B}ack']
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

scope.content = blessed.list({
    keys: true,
    label: 'Search Results',
    style: {
        item: {
            //TODO: This simple fix wont work with scrolling lists, but we dont need them for now
            height: 2
        },
        selected: {
            bg: 'lightgreen',
            fg: 'black'
        }
    },
    border: {
        type: 'ascii',
        bg: 'black',
        fg: 'lightgreen'
    },
    width: '100%',
    bottom: 1,
    top: 1,
    left: 0,
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'lightgreen'
        },
        style: {
            inverse: true
        }
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

module.exports = scope;