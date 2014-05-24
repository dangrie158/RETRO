var retro = require('./lib/retro'),
    widgets = retro.Widgets,
    amazon = retro.API,
    RouteProvider = retro.MVC.RouteProvider,
    fs = require('fs'),
    Route,
    cart = [];

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

    widgets.screen.key(['c'], function () {
        RouteProvider.navigateTo('cart');
    });

    widgets.screen.key(['q'], function (ch, key) {
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

            var setDescription = function(){
                $screen.render();
                var obj = $scope.description;
                if(productDetail.Feature){
                    productDetail.Feature.forEach(function(entry){
                        obj.setContent(obj.getContent() + '- ' + entry + '\n');
                    })
                    obj.setContent(obj.getContent() + '\n' + '---------------------' + '\n\n');
                }
                if(productDetail.EditorialReviews){
                    productDetail.EditorialReviews.forEach(function(entry){
                        obj.setContent(obj.getContent() + entry.Source + '\n');
                        obj.setContent(obj.getContent() + entry.Content + '\n');
                    })
                }
                if(obj.getContent() == ''){
                    obj.setContent('No description found.');
                }

                widgets.screen.key('down', function(ch, key){
                        obj.scroll(1);
                        $screen.render();

                });
                widgets.screen.key('up', function(ch, key){
                        obj.scroll(-1);
                        $screen.render();

                });
                obj.focus();
            }

            var setInfo = function(){
                    var creator = '',
                    price = '',
                    release = '',
                    group = '';
                if(productDetail.Price){
                    price = 'Preis: ' + productDetail.Price + '\n';
                }
                if(productDetail.Creator){
                    productDetail.Creator.forEach(function(entry){
                        creator += entry.role + ': ' + entry.name + '\n';
                    });
                }
                if(productDetail.ReleaseDate){
                    // TODO: format date
                    var releaseDate = new Date(productDetail.ReleaseDate);
                    // releaseDate = releaseDate.format('%d.%m.%Y');
                    release += 'Erscheinungsdatum: ' + releaseDate + '\n';
                }
                if(productDetail.ProductGroup){
                    group = 'Kategorie: ' +productDetail.ProductGroup + '\n';
                }


                var content = price + '\n' + creator + '\n' + release + '\n' + group;
                $scope.info.setContent(content);
            }

            setTitle();
            setDescription();
            setInfo();

            $screen.render();
            widgets.screen.onceKey(['b'], RouteProvider.goBack);
            widgets.screen.key(['a'], function () {
                // TODO: when to popup was closed and is reopened again the focus is missing
                $screen.showPopup();
                $scope.popup.once('focus', function () {
                    $scope.popup.input.focus();
                });
                widgets.screen.onceKey(['escape'], function () {
                    $screen.hidePopup();
                })
                $scope.popup.on('submit', function(){
                    // TODO: add to cart & hide popup
                    if(isNaN($scope.popup.input.getContent())){
                        // TODO: if not a number: error popup or new text in the label? the text is even with screen.render() not displayed
                        $scope.popup.input.label = 'PLEASE ENTER A NUMBER';
                        console.log($scope.popup.input.label);
                        $screen.render();
                    }
                    else{
                        cart.push({
                            title: productDetail.Title,
                            asin: productDetail.ASIN,
                            price: productDetail.Price,
                            quantity: $scope.popup.input.getContent()
                        });
                        $screen.hidePopup();
                        $scope.popup.input.setContent('');
                    }
                })
            });
            $scope.title.on('resize', setTitle);


            // TODO: onError einbauen
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

var cartCntl = function ($scope, $screen, routeParams){
    widgets.screen.onceKey(['b'], RouteProvider.goBack);
    $scope.content.focus();

    // array tests
    var test = [{name: 'toby', alter: 12}, {name: 'dani', alter: 13}];
    var test2 = ['hi', 'jo'];

    if(test.length > 0){
        test.forEach(function(test){
            $scope.content.addItem(test.name + '\n' + test.alter);
        })
        $screen.render();
    }
    else{
        // no list items to set
    }
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
    case 'cart':
        config = {
            controller: cartCntl,
            view: './views/cart'
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