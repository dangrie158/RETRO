var retro = require('./lib/retro'),
    widgets = retro.Widgets,
    amazon = retro.API,
    RouteProvider = retro.MVC.RouteProvider,
    fs = require('fs'),
    Route;

var startpageCntl = function ($scope, $screen) {
    fs.readFile(require('path').resolve(__dirname, './amazonAscii'), function (err, data) {
        scope.content.setContent(String(data));
        $screen.render();
    });

    widgets.screen.key(['s'], function () {
        $screen.showPopup();
        widgets.screen.onceKey(['escape'], function () {
            $screen.hidePopup();
        })
    });

    $scope.popup.once('submit', function () {
        RouteProvider.navigateTo('search/searchterm=' + $scope.popup.input.value);
    });

    widgets.screen.key(['k'], function () {
        RouteProvider.navigateTo('errorPageDiesNichGibt');
    });

    widgets.screen.key(['C-c', 'q'], function (ch, key) {
        $screen.popup = $scope.closePopup;
        $screen.showPopup();
        $scope.closePopup.once('submit', process.exit);
        $scope.closePopup.once('cancel', function(){
            $screen.hidePopup();
            $screen.popup = $scope.searchPopup;
        });
    });
}

var productDetailCntl = function ($scope, $screen, routeParams){
    amazon.loadProduct({
        asin: routeParams.asin,
        onSuccess: function(productDetail){
            var setTitle = function(){
                var title = productDetail.Title.substr(0, ($screen.width - 6));
                if(productDetail.Title.length > ($screen.width-6)){
                    title += '...';
                }
                $screen.setTitle(title);
            };
            setTitle();
            $screen.render();
            widgets.screen.onceKey(['b'], RouteProvider.goBack);
            $scope.title.on('resize', setTitle);
        }
    });
}

var searchResultCntl = function ($scope, $screen, routeParams) {
    var page = (~~routeParams.page) || 1;

    //TODO: for reusability
    var searchIndex = routeParams.searchIndex;

    //we only can get 5 pages if we search in the 'all' category
    var maxpages = searchIndex ? 10 : 5;

    $scope.content.focus();
    amazon.queryProducts({
        searchterm: routeParams.searchterm,
        page: page,
        searchIndex: searchIndex,
        onSuccess: function (result, totalPages) {
            //We cant get any more pages anyway so we clamp
            totalPages = totalPages > maxpages ? maxpages : totalPages;

            $screen.setTitle('AMAZON - SEARCH RESULTS - ' + routeParams.searchterm + ' - PAGE ' + page + '/' + totalPages);

            //check on wich page we are and hide the 
            //commands according 
            if (page >= totalPages) {
                $scope.hideNext();
            } else {
                //map or navigation key
                widgets.screen.key(['n'], function () {
                    var nextPage = 'search' +
                        '/searchterm=' + routeParams.searchterm +
                        '/page=' + (~~page + 1);
                    if (searchIndex) {
                        nextPage += '/searchIndex=' + searchIndex;
                    }
                    RouteProvider.navigateTo(nextPage);
                });
            }

            if (page <= 1) {
                $scope.hidePrevious();
            } else {
                widgets.screen.key(['p'], function () {
                    var previousPage = 'search' +
                        '/searchterm=' + routeParams.searchterm +
                        '/page=' + (~~page - 1);
                    if (searchIndex) {
                        nextPage += '/searchIndex=' + searchIndex;
                    }
                    RouteProvider.navigateTo(previousPage);
                });
            }

            titles = result.Titles;
            $scope.content.setItems(titles);
            $screen.render();

            //Register this here so we cant go back and then the result comes in
            widgets.screen.key(['b'], RouteProvider.goBack);
            $scope.content.on('select', function(data, index){
                RouteProvider.navigateTo('detail/asin=' +result.ASINs[index]);
            });
        },
        onError: function (errorMessage) {

            $screen.showPopup();
            $screen.popup.content = errorMessage;
            $screen.render();
            widgets.screen.onceKey(['b'], RouteProvider.goBack);
        }
    });

    $screen.render();


    $scope.popup.on('submit', RouteProvider.goBack);
}

var errorCntrl = function ($scope, $screen) {
    widgets.screen.key(['b'], RouteProvider.goBack);

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
            controller: searchResultCntl,
            view: './views/productSearch'
        }
        break;
    case 'detail':
        config = {
            controller: productDetailCntl,
            view: './views/productDetail'
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