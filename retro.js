var blessed = require('blessed'),
	retro = require('./lib/retro'),
	widgets = retro.Widgets,
	amazon = retro.API;

// screen.append(blessed.line());


var array = ['{Q}uit', '{N}ext', '{ESC} Cancel', '{RET} Quantity'];
var title = widgets.title({
	content: 'Hallo du da'
});
var commandbar = widgets.commandbar({
    commands: array
});

var content = blessed.box({
    top: 1,
    left: 0,
    width: '100%',
    height: '100%',
    content: 'test',
    style: {
        fg: 'green',
        bg: 'black'
    }
});
var screen = new widgets.screen();
screen.title = title;

screen.commandbar = commandbar;

widgets.screen.switchScreen(screen);

widgets.screen.key(['o'], function(){
	screen.showPopup();
});