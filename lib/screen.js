var blessed = require('blessed'),
    commandbar = require('./commandbar'),
    title = require('./title'),
    Color = require('./const').Colors,
    blessedScreen = blessed.screen();

blessed.screen.prototype.retroScreen;
blessed.screen.prototype.setRetroScreen = function (screen) {
    this.retroScreen = screen;
};

/*
 * If no content is set a box is displayed that tells you that there is no content to display
 */
var Screen = function () {
    this.title = new title();
    this.content = blessed.box({
        top: 'center',
        left: 'center',
        width: '50%',
        height: '50%',
        align: 'center',
        content: 'No content set!',
        style: {
            fg: Color.warningFg,
            bg: Color.warningBg
        }
    });
    this.commandbar = new commandbar();
};

/*
 * Sets a new popup
 */
Screen.prototype.setPopup = function (popup) {
    this.popup = popup;
}

/*
 * Shows the set popup and grays out the elements in the background
 */
Screen.prototype.showPopup = function () {
    this.title.style.bg = Color.barInactiveBg;
    this.title.style.fg = Color.barInactiveFg;
    // blessedScreen.append(this.popup);
    // this.popup.focus();
    blessedScreen.render();
}

/*
 * Hides the popup and colors the content elements again
 */
Screen.prototype.hidePopup = function () {
    this.title.style.bg = Color.barActiveBg;
    this.title.style.fg = Color.barActiveFg;
}

/*
 * Sets the title of the titlebar
 */
Screen.prototype.setTitle = function (title) {
    this.title.setContent(title);
};

/*
 * This sets the default background color of our terminal application
 */
Screen.background = blessed.box({
    top: 1,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
        bg: Color.background
    }
});

/*
 * Removes all content from the blessed screen if there was some previously set,
 * then appends all elements of the new Screen
 */
Screen.switchScreen = function (newScreen) {
    if (blessedScreen.retroScreen !== undefined) {
        blessedScreen.remove(blessedScreen.retroScreen.title);
        blessedScreen.remove(blessedScreen.retroScreen.content);
        blessedScreen.remove(blessedScreen.retroScreen.commandbar);
    }

    // TODO: does the background have to be removed too?
    blessedScreen.append(Screen.background);

    /*
     * By default a blessed.box has a white background and black text, 
     * this has to be overwritten
     */
    // TODO: a blessed.box() makes the background white, so we overwrite it. But than an input would also be in the color of the background.
    newScreen.content.style.fg = Color.contentActiveFg;
    newScreen.content.style.bg = Color.contentActiveBg;

    blessedScreen.append(blessed.line());

    blessedScreen.append(newScreen.title);
    blessedScreen.append(newScreen.content);
    blessedScreen.append(newScreen.commandbar);
    blessedScreen.render();
};

/*
 * Defines shortcut-keys for the screen
 */
Screen.key = function (keylist, callback) {
    blessedScreen.key(keylist, callback);
}

blessedScreen.key(['escape', 'C-c'], function (ch, key) {
    return process.exit(0);
});

module.exports = Screen;