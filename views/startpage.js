var blessed = require('blessed'),
    retro = require('../lib/retro'),
    widgets = retro.Widgets;

//This is the Object that holds all emenets we want
//to access in our controller
scope = {};

scope.title = widgets.title({
    content: 'AMAZON - SHOPPING CLIENT'
});
scope.commandbar = widgets.commandbar({
    commands: ['{S}earch', '{B}rowse', '{C}art', '{Q}uit']
});

scope.content = blessed.box({
    top: 'center',
    left: 'center',
    style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    width: 31,
    height: 20
});

/*
 * POPUP STUFF
 */
scope.searchPopup = retro.Widgets.Popups.InputPopup({
    label: 'ITEM SEARCH',
    action: 'search'
});
scope.closePopup = retro.Widgets.Popups.ConfirmPopup({
    label: 'ARE YOU SURE',
    content: 'You have items in your cart. If you exit now all Items will be lost'
});

scope.popup = scope.searchPopup;

module.exports = scope;