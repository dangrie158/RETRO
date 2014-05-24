var blessed = require('blessed'),
    commandbar = require('./commandbar'),
    title = require('./title'),
    Color = require('./const').Colors,
    blessedScreen = blessed.screen();

blessed.screen.prototype.retroScreen;
blessed.screen.prototype.setRetroScreen = function (screen) {
    this.retroScreen = screen;
};

//We need to stora all registered keyevents so we can unregister them if we switch the screen
var registeredKeyEvents = [];

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
    this.__defineGetter__('width', function(){
        return blessedScreen.width;
    });
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
 * returns the current title
 */
Screen.prototype.getTitle = function () {
    return this.title.content;
};
/*
 * Renders the Screen
 * TODO: Maybe we should prototype
 * from Blessed.Screen so we can avoid those
 * nasty wrapper stuff....
 */
Screen.prototype.render = function () {
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
        //Close all Popups by default
        //TODO: Should we allow standart Open popups?
        if(blessedScreen.retroScreen.popup !== undefined){
            blessedScreen.retroScreen.hidePopup();
            blessedScreen.remove(blessedScreen.retroScreen.popup);
        }
    }

    //Remove all previously registered Key Events
    registeredKeyEvents.forEach(function (keyList) {
        if(keyList instanceof Array){
            keyList.forEach(function(key){
                blessedScreen.removeAllListeners(['key ' + key]); 
            });
        }
        else{
            blessedScreen.removeAllListeners(['key ' + keyList]); 
        }

    });

    registeredKeyEvents = [];

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

    blessedScreen.retroScreen = newScreen;

    blessedScreen.render();
};

/*
 * Defines shortcut-keys for the screen
 */
Screen.key = function (keylist, callback) {
    blessedScreen.key(keylist, callback);
    registeredKeyEvents.push(keylist);
}

Screen.onceKey = function (keylist, callback) {
    blessedScreen.onceKey(keylist, callback);
}

blessedScreen.key(['C-c'], function (ch, key) {
        process.exit(1);
    });

module.exports = Screen;