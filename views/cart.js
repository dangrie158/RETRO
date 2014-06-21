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
    commands: ['', '', '{H}ome', '{B}ack']
});

scope.commandbar2 = widgets.commandbar({
    parent: scope.commandbar,
    commands: ['{O}rder', '{RET}Edit quantity', '{D}elete Item', ''],
    bottom: 1
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

scope.list = blessed.list({
    keys: true,
    tags: true,
    label: 'Cart',
    parent: scope.content,
    style: {
        bg: 'black',
        fg: 'lightgreen',
        item: {
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
    bottom: 1,
    left: 0,
    right: 30,
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

scope.placeholder = blessed.box({
    content: "Nothing here yet\nAdd something!",
    align: 'center',
    top: '50%',
    left: 1,
    right: 1,
    height: 2,
    style: {
        bg: 'black',
        fg: 'lightgreen'
    }
});

scope.info = blessed.box({
    parent: scope.content,
    bottom: 1,
    right: 0,
    width: 30,
    style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    border: {
        type: 'ascii',
        fg: 'lightgreen',
        bg: 'black'
    }
});

scope.cart = blessed.box({
    parent : scope.info,
    bottom: 1,
    width: 20,
    left: 5,
    height: 9,
    style: {
        bg: 'black',
        fg: 'lightgreen'
    }
});

/*
 * POPUP STUFF
 */
scope.popup = retro.Widgets.Popups.InputPopup({
    label: 'EDIT QUANTITY',
    action: 'Update',
    inputTitle: 'Enter the quantity'
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

scope.hideOrder = function () {
    scope.commandbar2.setCommands(['', '{RET}Edit quantity', '{D}elete Item', '']);
}

module.exports = scope;