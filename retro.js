var blessed = require('blessed'),
    retro = require('./lib/retro'),
    widgets = retro.Widgets,
    amazon = retro.API,
    fs = require('fs');

/*
 * DUMMY CONTENT
 */
var array = ['{S}earch', '{B}rowse', '{C}art', '{Q}uit'];
var title = widgets.title({
    content: 'AMAZON - SHOPPING CLIENT'
});
var commandbar = widgets.commandbar({
    commands: array
});

var content = blessed.box({
    top: 'center',
    left: 'center',
    style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    width: 31,
    height: 20
});

fs.readFile('./amazonAscii', function (err, data) {
    content.setContent(String(data));
    widgets.screen.render();

});

/*
 * /DUMMY CONTENT
 */

/*
 * POPUP STUFF
 */
var popup = blessed.form({
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

var input = blessed.textbox({
    parent: popup,
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
    parent: popup,
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

/*
 * /POPUP STUFF
 */

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

var screen = new widgets.screen();

screen.title = title;
screen.content = content;
screen.commandbar = commandbar;
screen.popup = popup;

widgets.screen.switchScreen(screen);

widgets.screen.key(['s'], function () {
    screen.showPopup();
    input.focus();
    widgets.screen.onceKey(['escape'], function() {
        screen.hidePopup();
    })
});