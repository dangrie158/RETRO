var blessed = require('blessed'),
    Color = require('./const').Colors;

function Commandbar(options) {
    if (!(this instanceof blessed.node)) {
        return new Commandbar(options);
    }
    options = options || {};
    options.bottom = options.bottom || 0;
    options.width = options.width || '100%';
    options.height = options.height || 1;
    options.tags = options.tags || true;
    options.style = options.style || {
        fg: Color.barActiveFg,
        bg: Color.barActiveBg
    };
    blessed.box.call(this, options);

    this.options = options;

    this.on('resize', this.drawCommands);
    this.on('attach', this.drawCommands);

}

Commandbar.prototype.__proto__ = blessed.box.prototype;

Commandbar.prototype.type = 'Commandbar';

/*
 * Expects an String Array which contains the possible commands
 * as Strings
 */
Commandbar.prototype.setCommands = function (commands) {
    this.options.commands = commands;
    this.drawCommands();
}

/*
 * Draws the possible commands onto the Commandbar
 */
Commandbar.prototype.drawCommands = function () {
    var self = this,
    commands = this.options.commands;
    if (commands instanceof Array) {
        var length = commands.length,
            finalString = '';
        commands.forEach(function (entry) {
            var space = ((self.screen.width) / length) - entry.length, 
            gapFiller = '',
            parsedEntry = entry.replace(/{(.*)}/g, '{black-fg}{white-bg}($1){/white-bg}{/black-fg}');
            for (var i = 0; i < space; i++) {
                gapFiller += ' ';
            }
            finalString += parsedEntry + gapFiller;
        });
        this.content = finalString;
    } else {
    	throw new Error('Commandbar expects a String Array.');
    }
}

module.exports = Commandbar;