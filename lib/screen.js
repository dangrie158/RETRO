var blessed = require('blessed'),
    commandbar = require('./commandbar'),
    title = require('./title'),
    Color = require('./const').Colors,
    blessedScreen = blessed.screen();

blessed.screen.prototype.retroScreen;
blessed.screen.prototype.setRetroScreen = function(screen) {
    this.retroScreen = screen;
};

/*
 * If no content is set a box is displayed that tells you that there is no content to display
 */
var Screen = function (controller) {
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

    //This sets the default background color of our terminal application
    //If we do this here, we dont have to manually add and remove it
    blessedScreen.append(blessed.box({
        top: 1,
        left: 0,
        width: '100%',
        height: '100%',
        style: {
            bg: Color.background
        }
    }));
};

/*
 * Shows the set popup and grays out the elements in the background
 */
Screen.prototype.showPopup = function () {
    this.title.style.bg = Color.barInactiveBg;
    this.title.style.fg = Color.barInactiveFg;
    this.content.style.bg = Color.contentInactiveBg;
    this.content.style.fg = Color.contentInactiveFg;
    this.commandbar.style.bg = Color.barInactiveBg;
    this.commandbar.style.fg = Color.barInactiveFg;

    blessedScreen.append(this.popup);
    this.popup.focus();
    blessedScreen.render();
}

/*
 * Hides the popup and colors the content elements again
 */
Screen.prototype.hidePopup = function () {
    blessedScreen.remove(this.popup);

    this.title.style.bg = Color.barActiveBg;
    this.title.style.fg = Color.barActiveFg;
    this.content.style.bg = Color.contentActiveBg;
    this.content.style.fg = Color.contentActiveFg;
    this.commandbar.style.bg = Color.barActiveBg;
    this.commandbar.style.fg = Color.barActiveFg;

    this.content.focus();
    blessedScreen.render();
}

/*
 * Sets the title of the titlebar
 */
Screen.prototype.setTitle = function (title) {
    this.title.setContent(title);
};

/*
 * Renders the Screen
 * TODO: Maybe we should prototype
 * from Blessed.Screen so we can avoid those
 * nasty wrapper stuff....
 */
Screen.render = function () {
    blessedScreen.render();
}

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

    /*
     * By default a blessed.box has a white background and black text,
     * this has to be overwritten
     */
    // TODO: a blessed.box() makes the background white, so we overwrite it. But than an input would also be in the color of the background.
    //TODO: We shouldnt do this and let the view be responsible for the styling
    //newScreen.content.style.fg = Color.contentActiveFg;
    //newScreen.content.style.bg = Color.contentActiveBg;

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

Screen.onceKey = function (keylist, callback) {
    blessedScreen.onceKey(keylist, callback);
}

blessedScreen.key(['C-c', 'q'], function (ch, key) {
    return process.exit(0);
});

module.exports = Screen;