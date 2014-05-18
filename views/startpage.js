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
scope.popup = blessed.form({
    top: 'center',
    left: 'center',
    width: '50%',
    height: 6,
    label: 'ITEM SEARCH',
    align: 'center',
    keys: true,
    content: '',
    border: {
        type: 'line',
        fg: 'lightgreen'
    },
    style: {
        fg: 'lightgreen',
        bg: 'black'
    },

});

scope.input = blessed.textbox({
    parent: scope.popup,
    top: 2,
    inputOnFocus: true,
    left: 'center',
    width: '80%',
    label: 'Searchterm',
    height: 1,
    keys: true,
    style: {
        fg: 'black',
        bg: 'white',
        focus: {
            bg: 'lightgreen'
        }
    }
});

blessed.button({
    parent: scope.popup,
    top: 4,
    left: 'center',
    shrink: false,
    content: 'submit',
    height: 1,
    keys: true,
    style: {
        fg: 'black',
        bg: 'white',
        focus: {
            bg: 'lightgreen'
        }
    }
});

module.exports = scope;