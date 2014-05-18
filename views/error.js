var blessed = require('blessed'),
    retro = require('../lib/retro'),
    widgets = retro.Widgets;

//This is the Object that holds all emenets we want
//to access in our controller
scope = {};

scope.title = widgets.title({
    content: 'ERROR - Route not found'
});
scope.commandbar = widgets.commandbar({
    commands: ['{B}ack']
});

scope.content = blessed.box({
    top: 'center',
    left: 'center',
    style: {
        bg: 'red',
        fg: 'black'
    },
    content: 'Route not found',
    width: '100%',
    height: 20
});

module.exports = scope;