var blessed = require('blessed'),
    Color = require('./const').Colors;

function Title(options) {
    if (!(this instanceof blessed.node)) {
        return new Title(options);
    }
    options = options || {};
    options.top = options.top || 0;
    options.width = options.width || '100%';
    options.height = options.height || 1;
    options.align = options.align || 'center';
    options.content = options.content || '';
    options.style = options.style || {
        fg: Color.barActiveFg,
        bg: Color.barActiveBg
    };
    blessed.box.call(this, options);

    this.options = options;

}

Title.prototype.__proto__ = blessed.box.prototype;

Title.prototype.type = 'Title';

module.exports = Title;