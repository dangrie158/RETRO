var retro = require('./lib/retro'),
    widgets = retro.Widgets,
    amazon = retro.API,
    RouteProvider = retro.MVC.RouteProvider,
    fs = require('fs'),
    Route;

var startpageCntl = function ($scope, $screen) {
    fs.readFile('./amazonAscii', function (err, data) {
        scope.content.setContent(String(data));
        $screen.render();
    });

    widgets.screen.key(['s'], function () {
        $screen.showPopup();
        $scope.input.focus();
        widgets.screen.onceKey(['escape'], function () {
            $screen.hidePopup();
        })
    });

    $scope.submitButton.on('press', function () {
        $scope.popup.submit();
    });

    $scope.popup.on('submit', function () {
        $scope.popup.removeAllListeners(['submit']);
        RouteProvider.navigateTo('search/searchTerm=' + $scope.input.value);
    });

    widgets.screen.key(['k'], function () {
        RouteProvider.navigateTo('errorPageDiesNichGibt');
    });
}

var serchResultCntl = function ($scope, $screen, routeParams) {
    $screen.setTitle('AMAZON - SEARCH RESULTS - ' + routeParams.searchTerm);
    $screen.render();

    widgets.screen.key(['n'], function () {

    });

    widgets.screen.key(['p'], function () {

    });

    widgets.screen.key(['b'], function () {
        RouteProvider.goBack();
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
            view: './views/startpage'
        }
        break;
    case 'search':
        config = {
            controller: serchResultCntl,
            view: './views/productSearch'
        }
        break;
    default:
        config = {
            controller: errorCntrl,
            view: './views/error'
        }
        break;
    }
    
    //We do not want caching in the views so we delete 
    //Any cached entry
    delete require.cache[require.resolve(config.view)];
    view = require(config.view);

    var screen = new widgets.screen();
    screen.title = view.title;
    screen.content = view.content;
    screen.commandbar = view.commandbar;
    screen.popup = view.popup;

    widgets.screen.switchScreen(screen);

    config.controller(view, screen, routeParams);

    return newPath;
}

RouteProvider.navigateTo('start');