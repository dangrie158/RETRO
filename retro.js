var retro = require('./lib/retro'),
    widgets = retro.Widgets,
    amazon = retro.API,
    RouteProvider = retro.MVC.RouteProvider,
    fs = require('fs'),
    Route,
    cart = [];

var startpageCntl = function ($scope, $screen) {
    fs.readFile(require('path').resolve(__dirname, './amazonAscii'), function (err, data) {
        $scope.content.setContent(String(data));
        $screen.render();
    });

    widgets.screen.key(['s'], function () {
        $screen.showPopup();
        $scope.popup.input.focus();
        widgets.screen.onceKey(['escape'], function () {
            $scope.popup.input.clearValue();
            $screen.hidePopup();
        });
    });

    $scope.popup.once('submit', function () {
        RouteProvider.navigateTo('search/searchterm=' + $scope.popup.input.value);
    });

    widgets.screen.key(['c'], function () {
        RouteProvider.navigateTo('cart');
    });

    widgets.screen.key(['b'], function () {
        RouteProvider.navigateTo('browse');
    });

    widgets.screen.key(['q'], function (ch, key) {
        $screen.popup = $scope.closePopup;
        $screen.showPopup();
        $scope.closePopup.once('submit', process.exit);
        $scope.closePopup.once('cancel', function () {
            $screen.hidePopup();
            $screen.popup = $scope.searchPopup;
        });
    });
}

var browseCntl = function ($scope, $screen, routeParams) {
    var entriesPerPage = 20;

    var page = (~~routeParams.page) || 1;
    var allIndices = amazon.AmazonSearchIndices;

    //we can show 20 items per page
    var totalPages = Math.ceil(allIndices.length / entriesPerPage);
    var firstEntry = entriesPerPage * (page - 1);
    var lastEntry = firstEntry + entriesPerPage;

    //calculate all our items
    var pageItems = allIndices.slice(firstEntry, lastEntry);

    $scope.content.setItems(pageItems);
    $scope.content.focus();

    if (page >= totalPages) {
        $scope.hideNext();
    } else {
        //map or navigation key
        widgets.screen.key(['n', 'space'], function () {
            var nextPage = 'browse' +
                '/page=' + (~~page + 1);
            RouteProvider.navigateTo(nextPage);
        });
    }

    if (page <= 1) {
        $scope.hidePrevious();
    } else {
        widgets.screen.key(['p'], function () {
            var previousPage = 'browse' +
                '/page=' + (~~page - 1);
            RouteProvider.navigateTo(previousPage);
        });
    }

    if(totalPages == 1){
        $scope.hideNextAndPrevious();
    }

    $screen.render();

    widgets.screen.key(['b'], RouteProvider.goBack);

    widgets.screen.key(['h'], function () {
        RouteProvider.navigateTo('start');
    });

    $scope.content.on('select', function (data, index) {
        var searchIndex = allIndices[index];
        $screen.showPopup();
        $scope.popup.input.focus();
        $scope.popup.key(['escape'], function () {
            $scope.popup.input.clearValue();
            $screen.hidePopup();
            $scope.content.focus();
        });
        $scope.popup.once('submit', function () {
            var searchterm = $scope.popup.input.getContent();
            RouteProvider.navigateTo('search/searchterm=' + searchterm + '/searchIndex=' + searchIndex);
        });
    });
}

var productDetailCntl = function ($scope, $screen, routeParams) {
    amazon.loadProduct({
        asin: routeParams.asin,
        onSuccess: function (productDetail) {
            var setTitle = function () {
                var title = productDetail.Title.substr(0, ($screen.width - 6));
                if (productDetail.Title.length > ($screen.width - 6)) {
                    title += '...';
                }
                $screen.setTitle(title);
            };

            var setDescription = function () {
                $screen.render();
                var obj = $scope.description;
                if (productDetail.Feature) {
                    productDetail.Feature.forEach(function (entry) {
                        obj.setContent(obj.getContent() + '- ' + entry + '\n');
                    })
                    obj.setContent(obj.getContent() + '\n' + '---------------------' + '\n\n');
                }
                if (productDetail.EditorialReviews) {
                    productDetail.EditorialReviews.forEach(function (entry) {
                        obj.setContent(obj.getContent() + entry.Source + '\n');
                        obj.setContent(obj.getContent() + entry.Content + '\n');
                    })
                }
                if (obj.getContent() == '') {
                    obj.setContent('No description found.');
                }

                widgets.screen.key('down', function (ch, key) {
                    obj.scroll(1);
                    $screen.render();

                });
                widgets.screen.key('up', function (ch, key) {
                    obj.scroll(-1);
                    $screen.render();

                });
                obj.focus();
            }

            var setInfo = function () {
                var creator = '',
                    price = '',
                    release = '',
                    group = '';
                if (productDetail.Price) {
                    price = 'Preis: ' + productDetail.Price + '\n';
                }
                if (productDetail.Creator) {
                    productDetail.Creator.forEach(function (entry) {
                        creator += entry.role + ': ' + entry.name + '\n';
                    });
                }
                if (productDetail.ReleaseDate) {
                    var dateFormat = function(date) {
                       var yyyy = date.getFullYear().toString();
                       var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
                       var dd  = date.getDate().toString();
                       return (dd[1]?dd:"0"+dd[0]) + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + yyyy; // padding
                    };
                    var releaseDate = new Date(productDetail.ReleaseDate);
                    // releaseDate = releaseDate.format('%d.%m.%Y');
                    release += 'Erscheinungsdatum: ' + dateFormat(releaseDate) + '\n';
                }
                if (productDetail.ProductGroup) {
                    group = 'Kategorie: ' + productDetail.ProductGroup + '\n';
                }

                var content = price + '\n' + creator + '\n' + release + '\n' + group;
                $scope.info.setContent(content);
            }

            setTitle();
            setDescription();
            setInfo();

            $screen.render();
            widgets.screen.key(['b'], RouteProvider.goBack);
            widgets.screen.key(['h'], function () {
                RouteProvider.navigateTo('start');
            });
            widgets.screen.key(['a'], function () {
                $screen.showPopup();
                $scope.popup.input.focus();
                widgets.screen.onceKey(['escape'], function () {
                    $screen.hidePopup();
                });
                $scope.popup.on('submit', function () {
                    if (isNaN($scope.popup.input.getContent()) || $scope.popup.input.getContent() == '') {
                        $scope.popup.input.setContent('PLEASE ENTER A NUMBER');
                        $scope.popup.input.focus();
                        $screen.render();
                        $scope.popup.input.clearValue();
                    } else {
                        var productExists = false,
                            quantity = parseInt($scope.popup.input.getContent(), 10);
                        cart.forEach(function (product, index) {
                            if (product.ASIN == productDetail.ASIN) {
                                cart[index].Quantity += quantity;
                                productExists = true;
                                return true;
                            }
                        });
                        if (!productExists) {
                            cart.push({
                                Title: productDetail.Title,
                                ASIN: productDetail.ASIN,
                                Price: productDetail.Price,
                                Quantity: quantity
                            });
                        }
                        $scope.popup.input.clearValue();
                        $screen.hidePopup();
                        $scope.popup.removeAllListeners('submit');
                    }
                })
            });
            $scope.title.on('resize', setTitle);

            

        },
        onError: function (errorMessage) {
            $scope.popup = $scope.error;
            $screen.showPopup();
            $scope.popup.content = errorMessage || 'An onknown error occured!';
            $screen.render();
            $scope.popup.on('submit', function(){
                RouteProvider.goBack();
            })
        }
    });
}

var searchResultCntl = function ($scope, $screen, routeParams) {
    var page = (~~routeParams.page) || 1;

    var searchIndex = routeParams.searchIndex;

    //we only can get 5 pages if we search in the 'all' category
    var maxpages = searchIndex ? searchIndex == 'All' ? 5 : 10 : 5;

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
                widgets.screen.key(['n', 'space'], function () {
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

            if(totalPages == 1){
                $scope.hideNextAndPrevious();
            }

            var formatTitle = function (title, price) {

                //Limit title lenght to one line
                var titleLenght = title.length;
                title = title.substr(0, ($screen.width - 19));
                if (titleLenght > ($screen.width - 19)) {
                    title += '...';
                }

                //add new line
                title += '\n';

                //add price
                if (price) {
                    title += '{right}' + price + '{/right}';
                }

                return title;
            };

            products = result;
            var formatAllTitles = function (products) {
                var formattedTitles = [];
                products.forEach(function (product) {
                    formattedTitles.push(formatTitle(product.Title, product.Price));
                });
                return formattedTitles;
            };

            $scope.content.on('resize', function () {
                $scope.content.setItems(formatAllTitles(products));
                $screen.render();
            });

            $scope.content.setItems(formatAllTitles(products));
            $screen.render();

            //Register this here so we cant go back and then the result comes in
            widgets.screen.key(['b'], RouteProvider.goBack);
            widgets.screen.key(['h'], function () {
                RouteProvider.navigateTo('start');
            });
            $scope.content.on('select', function (data, index) {
                RouteProvider.navigateTo('detail/asin=' + result.ASINs[index]);
            });
        },
        onError: function (errorMessage) {
            $screen.showPopup();
            $scope.popup.content = errorMessage;
            $screen.render();
            widgets.screen.key(['b'], RouteProvider.goBack);
        }
    });

    $screen.render();

    $scope.popup.on('submit', RouteProvider.goBack);
}

var cartCntl = function ($scope, $screen, routeParams) {
    $scope.list.focus();

    var formatTitle = function (title, price, quantity) {

        //Limit title lenght to one line
        var titleLenght = title.length;
        title = title.substr(0, ($scope.list.width - 10));
        if (titleLenght > ($scope.list.width - 10)) {
            title += '...';
        }

        //add new line
        title += '\n';

        //add price and quantity
        if (price) {
            title += '{right} Quantity: ' + quantity + ' ' + price + '{/right}';
        } else {
            title += '{right} Quantity: ' + quantity;
        }

        return title;
    };

    var formatAllTitles = function (products) {
        var formattedTitles = [];
        products.forEach(function (product) {
            formattedTitles.push(formatTitle(product.Title, product.Price, product.Quantity));
        });
        return formattedTitles;
    };

    fs.readFile(require('path').resolve(__dirname, './cart'), function (err, data) {
        $scope.cart.setContent(String(data));
        $screen.render();
    });

    widgets.screen.key(['b'], RouteProvider.goBack);

    widgets.screen.key(['h'], function () {
        RouteProvider.navigateTo('start');
    });

    if (cart.length > 0) {

        /*
         * Pagination
         */
        var entriesPerPage = 10;

        var page = (~~routeParams.page) || 1;
        var products = cart;

        //we can show 20 items per page
        var totalPages = Math.ceil(products.length / entriesPerPage);
        var firstEntry = entriesPerPage * (page - 1);
        var lastEntry = firstEntry + entriesPerPage;

        //calculate all our items
        var pageItems = products.slice(firstEntry, lastEntry);

        if (page >= totalPages) {
            $scope.hideNext();
        } else {
            //map or navigation key
            widgets.screen.key(['n', 'space'], function () {
                var nextPage = 'cart' +
                    '/page=' + (~~page + 1);
                RouteProvider.navigateTo(nextPage);
            });
        }

        if (page <= 1) {
            $scope.hidePrevious();
        } else {
            widgets.screen.key(['p'], function () {
                var previousPage = 'cart' +
                    '/page=' + (~~page - 1);
                RouteProvider.navigateTo(previousPage);
            });
        }

        if(totalPages == 1){
            $scope.hideNextAndPrevious();
        }

        /*
         * Content stuff
         */
        var setContent = function () {
            $scope.content.on('resize', function () {
                $scope.list.setItems(formatAllTitles(pageItems));
                $screen.render();
            });

            $scope.list.setItems(formatAllTitles(pageItems));
        }

        var setInfo = function () {
            var info = '',
                totalQuantity = 0,
                totalPrice = 0,
                parsePrice = function (priceString) {
                    if (priceString) {
                        var priceParts = priceString.split(' ');
                        var parsableString = priceParts[1].replace(',', '.');
                        return parseFloat(parsableString, 10);
                    } else {
                        //We have no Price
                        return 0;
                    }

                },
                parseQuantity = function (quantityString) {
                    return parseInt(quantityString, 10);
                }

            cart.forEach(function (product) {
                var quantity = parseQuantity(product.Quantity),
                    price = parsePrice(product.Price);
                totalQuantity += quantity;
                totalPrice += price * quantity;
            });

            $scope.info.setContent('Total quantity: ' + totalQuantity + '\n\nTotal Price: ' + totalPrice.toFixed(2) + '€');

        }

        setContent();
        setInfo();

        $screen.render();


        $scope.list.on('select', function (data, index) {
            $screen.showPopup();
            $scope.popup.input.focus();
            $scope.popup.key(['escape'], function () {
                $screen.hidePopup();
                $scope.list.focus();
            });
            $scope.popup.input.setContent(new String(cart[index + ((page - 1) * entriesPerPage)].Quantity));
            $screen.render();
            $scope.popup.on('submit', function () {
                if (isNaN($scope.popup.input.getContent()) || $scope.popup.input.getContent() == '') {
                    $scope.popup.input.setContent('PLEASE ENTER A NUMBER');
                    $scope.popup.input.focus();
                    $screen.render();
                    $scope.popup.input.clearValue();
                } else {
                    cart[index].Quantity = $scope.popup.input.getContent();
                    $scope.popup.input.clearValue();
                    $screen.hidePopup();
                    $scope.list.focus();
                    setContent();
                    setInfo();
                    $screen.render();
                    $scope.popup.removeAllListeners('submit');
                }
            })
        });

        widgets.screen.key(['d'], function () {
            cart.splice($scope.list.selected + ((page - 1) * entriesPerPage), 1);
            if(cart.length <= ((page - 1) * entriesPerPage)){
                if(page > 1){
                    page -= 1;
                }
            }
            RouteProvider.navigateTo('cart' + 
                '/page=' + page );
        });
    } else {
        // no list items to set
        $scope.list.append($scope.placeholder);
        $screen.render();
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
    case 'browse':
        config = {
            controller: browseCntl,
            view: './views/categoryBrowser'
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