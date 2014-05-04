var blessed = require('blessed'),
	retro = require('./lib/retro'),
	widgets = retro.Widgets,
	amazon = retro.API,
	screen = blessed.screen();

screen.append(blessed.line());

var array = ['{Q}uit', '{N}ext', '{ESC} Cancel', '{RET} Quantity'];
var commandbar = widgets.commandbar({
    commands: array
});

var content = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    content: 'test',
    style: {
        fg: 'green',
        bg: 'black'
    }
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'C-c'], function (ch, key) {
    return process.exit(0);
});

// commandbar.setCommands(array);
screen.append(content);
screen.append(commandbar);

screen.render();