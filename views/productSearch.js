var blessed = require('blessed'),
    retro = require('../lib/retro'),
    widgets = retro.Widgets;

//This is the Object that holds all emenets we want
//to access in our controller
scope = {};

scope.title = widgets.title({
    content: 'AMAZON - SEARCH RESULTS'
});
scope.commandbar = widgets.commandbar({
    commands: ['{P}revious', '{N}ext', '', '{B}ack']
});

scope.content = blessed.list({
    align: 'center',
    fg: 'blue',
    bg: 'default',
    keys: true,
    border: {
        type: 'ascii',
        fg: 'default',
        bg: 'default'
    },
    width: '50%',
    height: '50%',
    top: 'center',
    left: 'center',
    selectedBg: 'green',
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'yellow'
        },
        style: {
            inverse: true
        }
    }
});

module.exports = scope;