var blessed = require('blessed'),
	retro = require('./lib/retro'),
	widgets = retro.Widgets,
	amazon = retro.API;


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

var test = blessed.box({
    top: 1,
    left: 0,
    width: '100%',
    height: '100%',
    content: 'TEST CONTENT'
})

// TODO: lists still throw an error, even if a blessed.line() is appended under screen.js
// var list = blessed.list({
//     top: 1,
//     left: 0,
//     align: 'center',
//     fg: 'blue',
//     bg: 'default',
//     keys: true,
//     border: {
//         type: 'ascii',
//         fg: 'default',
//         bg: 'default'
//     },
//     width: '50%',
//     height: '50%',
//     top: 'center',
//     left: 'center',
//     items: ['hallo'],
//     selectedBg: 'green',
//     scrollbar: {
//         ch: ' ',
//         track: {
//             bg: 'yellow'
//         },
//         style: {
//             inverse: true
//         }
//     }
// });

var input = blessed.textarea({
  parent: screen,
  // Possibly support:
  // align: 'center',
  bg: 'blue',
  fg: 'red',
  height: '50%',
  width: '50%',
  top: 'center',
  left: 'center',
  content:'enter text',
});

var screen = new widgets.screen();

screen.title = title;
screen.content = test;
screen.commandbar = commandbar;

widgets.screen.switchScreen(screen);

widgets.screen.key(['o'], function(){
	screen.showPopup();
});