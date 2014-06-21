var blessed = require('blessed'),
    retro = require('../lib/retro'),
    widgets = retro.Widgets;

//This is the Object that holds all emenets we want
//to access in our controller
scope = {};

scope.title = widgets.title({
    content: 'AMAZON - ORDER PRODUCTS'
});

scope.commandbar = widgets.commandbar({
    commands: ['{S}end Order', '', '{H}ome', '{B}ack']
});


scope.content = blessed.box({
    top: 1,
    bottom: 0,
    left: 0,
    style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    width: '100%'
});

scope.form = blessed.form({
	parent: scope.content,
	align: 'center',
	keys: true,
	style: {
        bg: 'black',
        fg: 'lightgreen'
    },
    border: {
        type: 'ascii',
        bg: 'black',
        fg: 'lightgreen'
    },
    bottom: 1,
    left: 0,
    right: 30
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

scope.lastname = blessed.textbox({
	parent: scope.form,
    inputOnFocus: true,
    label: 'Last Name',
    top: 2,
    left: 2,
    right: 2,
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

scope.firstname = blessed.textbox({
	parent: scope.form,
    inputOnFocus: true,
    label: 'First Name',
    top: 5,
    left: 2,
    right: 2,
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

var focusNext = function(){
	scope.form.focusNext();
};

scope.lastname.key('enter', focusNext);
scope.firstname.key('enter', focusNext);

scope.shipping = blessed.button({
	parent: scope.form,
    label: 'Shipping Method',
    content: 'carrier pidgeon',
    top: 8,
    left: 2,
    right: 2,
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

scope.shippingImage = blessed.box({
	parent: scope.form,
	height: 9,
	align: 'center',
	top: 11,
	left:1,
	right: 1,
	style: {
    	fg: 'lightgreen',
    	bg: 'black'
    }
});


scope.shippingMethods = ['pidgeon', 'train', 'tube'];

scope.popup = blessed.list({
	keys: true,
	style: {
        bg: 'black',
        fg: 'lightgreen',
        selected: {
            bg: 'lightgreen',
            fg: 'black'
        }
    },
    top: 'center',
    left: 'center',
    width: '50%',
    height: 5,
    align: 'center',
    border: {
        type: 'line',
        fg: 'lightgreen'
    },
	items: scope.shippingMethods
});

scope.orderok = retro.Widgets.Popups.ErrorPopup({
    label: 'Your Order has been received',
    content: 'Your Order has been received and will be processed in the next few weeks'
});

module.exports = scope;