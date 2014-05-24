var blessed = require('blessed');

/*
 * An popup containing only one accept button
 */
var ErrorPopup = function (options) {
    //Alsways instanciate this
    if (!(this instanceof blessed.node)) {
        return new ErrorPopup(options);
    }

    var self = this;

    options = options || {};

    var defaultOptions = {
        top: 'center',
        left: 'center',
        width: '80%',
        height: '50%',
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
    };

    //merge the two options
    for (var attrname in defaultOptions) {
        options[attrname] = options[attrname] || defaultOptions[attrname];
    }

    blessed.form.call(this, options);

    this.okButton = blessed.button({
        parent: self,
        bottom: 2,
        left: 'center',
        shrink: false,
        content: options.acceptLabel || 'ok',
        height: 1,
        keys: true,
        align: 'center',
        style: {
            fg: 'black',
            bg: 'white',
            focus: {
                bg: 'lightgreen'
            }
        }
    });

    this.okButton.on('press', function () {
        self.submit();
    });
    this.on('focus', function () {
        self.okButton.focus();
    });
}
ErrorPopup.prototype.__proto__ = blessed.form.prototype;
ErrorPopup.prototype.type = 'ErrorPopup';
module.exports.ErrorPopup = ErrorPopup;

/*
 * An popup containing two buttons. one submits the dialog and one dismisses it
 */
var ConfirmPopup = function (options) {
    //Alsways instanciate this
    if (!(this instanceof blessed.node)) {
        return new ConfirmPopup(options);
    }

    var self = this;

    options = options || {};

    var defaultOptions = {
        top: 'center',
        left: 'center',
        width: '80%',
        height: '50%',
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
    };

    //merge the two options
    for (var attrname in defaultOptions) {
        options[attrname] = options[attrname] || defaultOptions[attrname];
    }

    blessed.form.call(this, options);

    this.okButton = blessed.button({
        parent: self,
        bottom: 2,
        left: 1,
        content: options.acceptLabel || 'ok',
        height: 1,
        width: '40%',
        keys: true,
        align: 'center',
        style: {
            fg: 'black',
            bg: 'white',
            focus: {
                bg: 'lightgreen'
            }
        }
    });

    this.dismissButton = blessed.button({
        parent: self,
        bottom: 2,
        right: 1,
        content: options.dismissLabel || 'cancel',
        height: 1,
        width: '40%',
        keys: true,
        align: 'center',
        style: {
            fg: 'black',
            bg: 'white',
            focus: {
                bg: 'lightgreen'
            }
        }
    });

    this.okButton.on('press', function () {
        self.submit();
    });

    this.dismissButton.on('press', function () {
        self.cancel();
    });

    this.on('focus', function () {
        self.dismissButton.focus();
    });

    //TODO: export function to controler, don't forget screen.render()!
    this.key('left', function () {
        self.focusPrevious();
        self.render();
    });
    this.key('right', function () {
        self.focusNext();
        self.render();
    });
}
ConfirmPopup.prototype.__proto__ = blessed.form.prototype;
ConfirmPopup.prototype.type = 'ConfirmPopup';
module.exports.ConfirmPopup = ConfirmPopup;

/*
 * An single input popup with a submit button
 */
var InputPopup = function (options) {
    //Alsways instanciate this
    if (!(this instanceof blessed.node)) {
        return new InputPopup(options);
    }

    var self = this;

    options = options || {};

    var defaultOptions = {
        top: 'center',
        left: 'center',
        width: '50%',
        height: 6,
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
        action: 'submit',
        inputTitle: ''
    };

    //merge the two options
    for (var attrname in defaultOptions) {
        options[attrname] = options[attrname] || defaultOptions[attrname];
    }

    blessed.form.call(this, options);

    this.input = blessed.textbox({
        parent: self,
        top: 2,
        inputOnFocus: true,
        left: 'center',
        width: '80%',
        label: options.inputTitle,
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

    this.submitButton = blessed.button({
        parent: self,
        top: 4,
        left: 'center',
        shrink: false,
        content: options.action,
        height: 1,
        keys: true,
        align: 'center',
        style: {
            fg: 'black',
            bg: 'white',
            focus: {
                bg: 'lightgreen'
            }
        }
    });

    //we only need this once
    //hopfully...
    this.submitButton.on('press', function () {
        self.submit();
    });

    //On enter we want to focus out button
    this.input.key('enter', function () {
        self.focusNext();
    });
}
InputPopup.prototype.__proto__ = blessed.form.prototype;
InputPopup.prototype.type = 'InputPopup';
module.exports.InputPopup = InputPopup;