var blessed = require('blessed'),
    retro = require('../lib/retro'),
    widgets = retro.Widgets;

//This is the Object that holds all emenets we want
//to access in our controller
scope = {};

scope.title = widgets.title({
    content: 'AMAZON - BROWSE CATEGORIES'
});
scope.commandbar = widgets.commandbar({
    commands: ['{P}revious', '{N}ext', '{H}ome', '{B}ack']
});

scope.content = blessed.list({
    align: 'center',
    keys: true,
    label: 'Search Results',
    style: {
        bg: 'black',
        fg: 'lightgreen',
        item: {
            height: 1
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

scope.popup = retro.Widgets.Popups.InputPopup({
    label: 'ITEM SEARCH',
    action: 'search',
    inputTitle: 'Searchterm'
});

scope.hidePrevious = function () {
    scope.commandbar.setCommands(['', '{N}ext', '{H}ome', '{B}ack']);
}

scope.hideNext = function () {
    scope.commandbar.setCommands(['{P}revious', '', '{H}ome', '{B}ack']);
}

scope.hideNextAndPrevious = function () {
    scope.commandbar.setCommands(['', '', '{H}ome', '{B}ack']);
}

module.exports = scope;