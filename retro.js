var retro = require('./lib/retro'),
    widgets = retro.Widgets,
    amazon = retro.API,
    RouteProvider = retro.MVC.RouteProvider,
    fs = require('fs'),
    Route;

var startpageCntl = function ($scope, $screen) {
    fs.readFile('./amazonAscii', function (err, data) {
        scope.content.setContent(String(data));
        widgets.screen.render();
    });

    widgets.screen.key(['s'], function () {
        $screen.showPopup();
        $scope.input.focus();
        widgets.screen.onceKey(['escape'], function () {
            $screen.hidePopup();
        })
    });

    widgets.screen.key(['k'], function () {
        RouteProvider.navigateTo('erroras');
    });
}

var errorCntrl = function ($scope, $screen) {
    widgets.screen.key(['b'], function () {
        RouteProvider.goBack();
    });
}


//We extend the genearl Route Provider to navigate to where we want it
RouteProvider.loadPage = function (newPath, routeParams) {
    var config;
    switch (newPath) {
        //The startPage
    case 'start':
        config = {
            controller: startpageCntl,
            view: require('./views/startpage')
        }
        break;
    default:
        config = {
            controller: errorCntrl,
            view: require('./views/error')
        }
        break;
    }
    var screen = new widgets.screen();
    screen.title = config.view.title;
    screen.content = config.view.content;
    screen.commandbar = config.view.commandbar;
    screen.popup = config.view.popup;

    widgets.screen.switchScreen(screen);

    config.controller(config.view, screen);

    return newPath;
}

RouteProvider.navigateTo('start');