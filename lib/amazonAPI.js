var fs = require('fs');

var OperationHelper = require('apac').OperationHelper,
    opHelper = new OperationHelper({
        awsId: 'AKIAJ2633FPJBILFYTXA',
        awsSecret: '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',
        assocId: 'r0b680-20',
        xml2jsOptions: {
            explicitArray: false
        }
    });

var ApiHelper = function () {};

ApiHelper.defaultSearchIndex = 'All';
ApiHelper.defaultResponseGroupSmall = 'Small';
ApiHelper.defaultResponseGroupLarge = 'ItemAttributes,Offers,EditorialReview';

/*
 * Queries the Amazon Service and gives back a minimal
 * representation of a Product consisting of Title and ASIN
 *
 * We allow two ways to pass parameters to the function
 * one way is to define multiple parameters and the other
 * is an object array
 */
ApiHelper.queryProducts = function (options, onSuccess, onError) {
    options = options || {};
    if (typeof (options) === 'string') {
        options = {
            searchterm: options,
            onSuccess: onSuccess,
            onError: onError
        };
    }

    checkParameters(options, 'searchterm');

    options.searchIndex = options.searchIndex || ApiHelper.defaultSearchIndex;
    options.page = options.page || 1;

    if (!options.searchterm) {
        options.onError('You have to specify a searchterm');
        return;
    }

    //Execute the query
    opHelper.execute('ItemSearch', {
            'SearchIndex': options.searchIndex,
            'Keywords': options.searchterm,
            'ResponseGroup': ApiHelper.defaultResponseGroupSmall,
            'ItemPage': options.page
        },
        function (result) {
            var error = checkError(result.ItemSearchResponse);
            if (error !== false) {
                options.onError(error);
            } else {
                //were only interested in title and asin so far...
                var products = new ApiHelper.ProductsList();

                var items = result.ItemSearchResponse.Items.Item;
                var totalPages = result.ItemSearchResponse.Items.TotalPages;
                if (items != null) {
                    items.forEach(function (entry) {
                        var asin = entry.ASIN,
                            title = entry.ItemAttributes.Title,
                            product = new ApiHelper.Product(asin, title);

                        products.push(product);
                    });
                    options.onSuccess(products, totalPages);
                } else {
                    options.onError('No Results found for your searchterm: ' + options.searchterm);
                }
            }

        });
};

/*
 * loads the full information of a Product
 * determined by a ASIN
 */
ApiHelper.loadProduct = function (options, onSuccess, onError) {
    options = options || {};
    if (options instanceof ApiHelper.Product) {
        options = {
            product: options,
            onSuccess: onSuccess,
            onError: onError
        };
    } else if (typeof (options) === 'number') {
        var product = new ApiHelper.Product(options, '');
        options = {
            product: product,
            onSuccess: onSuccess,
            onError: onError
        };
    }
    if (!(options.product) && options.asin) {
        options.product = new ApiHelper.Product(options.asin, '');
    }

    checkParameters(options, 'product');

    //Execute the query
    opHelper.execute('ItemLookup', {
            'IdType': 'ASIN',
            'ItemId': options.product.ASIN,
            'ResponseGroup': ApiHelper.defaultResponseGroupLarge,
        },
        function (result) {
            fs.writeFile('apapi.txt', JSON.stringify(result));
            var error = checkError(result.ItemLookupResponse);
            if (error !== false) {
                options.onError(error);
            } else {
                var productInfo = result.ItemLookupResponse.Items.Item;
                options.product = filterProductInfo(productInfo, options.product);
                options.product.fullyLoaded = true;
                options.onSuccess(options.product);
            }
        }
    );
}

/*
 * Small Container for Product Data
 */
ApiHelper.Product = function (asin, title) {
    this.ASIN = asin;
    this.Title = title;
    this.fullyLoaded = false;
}

ApiHelper.Product.prototype.loadProduct = function (options, onError) {
    options = options || {};
    if (typeof (options) !== 'object') {
        options = {
            onSuccess: options,
            onError: onError
        };
    }
    //We need at least a callback on success
    if (typeof (options.onSuccess) === 'undefined') {
        throw new Error('No Callback specified');
    }
    if (typeof (options.onError) === 'undefined') {
        options.onError = function () {}
    }
    ApiHelper.loadProduct({
        product: this,
        onSuccess: options.onSuccess,
        onError: options.onError
    });
}

/*
 * Products WrapperClass for a List of Products
 * prototyped by Array
 */
ApiHelper.ProductsList = function () {}

ApiHelper.ProductsList.prototype = Array();

ApiHelper.ProductsList.prototype.getProductInfo = function (field) {
    var productInfos = [];
    this.forEach(function (entry) {
        productInfos.push(entry[field]);
    });
    return productInfos;
}

ApiHelper.ProductsList.prototype.__defineGetter__('Titles', function () {
    return this.getProductInfo('Title');
});

ApiHelper.ProductsList.prototype.__defineGetter__('ASINs', function () {
    return this.getProductInfo('ASIN');
});

module.exports = ApiHelper;

/*
 * Some Helper Functions for misc stuff
 */
function checkError(response) {
    //check if an error occurred
    //we do this in a exception save environment
    //because amazon fails sometimes
    try {
        if (response.Items.Request.IsValid !== 'True') {
            var errors = response.Items.Request.Errors.Error,
                errorMessage;
            if (errors instanceof Array) {
                errors.forEach(function (error) {
                    errorMessage += error.Message + '\n';
                });
            } else {
                errorMessage = errors.Message;
            }

            return errorMessage;
        }
    } catch (e) {
        return e.message;
    }
    return false;
}

function checkParameters(options, firstParameterName) {
    //We need at least those two parameters
    if (typeof (options[firstParameterName]) === 'undefined') {
        throw new Error('No ' + firstParameterName + ' specified');
    }
    if (typeof (options.onSuccess) === 'undefined') {
        throw new Error('No Callback specified');
    }

    //Error handlng is good, but we not alway want this
    if (typeof (options.onError) === 'undefined') {
        options.onError = function () {}
    }
}

function filterProductInfo(productInfo, product) {
    product.Title = productInfo.ItemAttributes.Title;
    //Misc. Product Info
    if (productInfo.ItemAttributes) {
        if (productInfo.ItemAttributes.Brand || productInfo.ItemAttributes.Manufacturer) {
            product.Manufacturer = productInfo.ItemAttributes.Brand || productInfo.ItemAttributes.Manufacturer;

        }

        if (productInfo.ItemAttributes.ReleaseDate) {
            product.ReleaseDate = productInfo.ItemAttributes.ReleaseDate;

        }
        if (productInfo.ItemAttributes.ProductGroup) {
            product.ProductGroup = productInfo.ItemAttributes.ProductGroup;

        }
        if (productInfo.ItemAttributes.Creator) {
            product.Creator = [];

            if (productInfo.ItemAttributes.Creator instanceof Array) {
                productInfo.ItemAttributes.Creator.forEach(function (creator) {
                    product.Creator.push({role:creator.$.Role, name:creator._});
                });
            } else {
                product.Creator.push({role:productInfo.ItemAttributes.Creator.$.Role, name:productInfo.ItemAttributes.Creator._});
            }

        }
        if (productInfo.ItemAttributes.Author) {
            if (!product.Creator) {
                product.Creator = [];
            }
            product.Creator.push({role: 'Autor', name: productInfo.ItemAttributes.Author});
        }
        if (productInfo.ItemAttributes.Feature) {
            product.Feature = [];
            if (productInfo.ItemAttributes.Feature instanceof Array) {
                productInfo.ItemAttributes.Feature.forEach(function (creator) {
                    product.Feature.push(creator)
                });
            } else {
                product.Feature.push(productInfo.ItemAttributes.Feature);
            }

        }
    }

    //We just need the cheapest Price here
    if (productInfo.OfferSummary) {
        if (productInfo.OfferSummary.LowestNewPrice) {
            product.Price = productInfo.OfferSummary.LowestNewPrice.FormattedPrice;
        }
    }

    //All public accessible product Reviews
    if (productInfo.EditorialReviews) {
        product.EditorialReviews = [];
        var reviews = productInfo.EditorialReviews.EditorialReview;
        if (reviews instanceof Array) {
            reviews.forEach(function (review) {
                //remove that HTML stuff....
                var content = review.Content.replace(/<\/?[^>]+(>|$)/g, "");
                product.EditorialReviews.push({
                    Source: review.Source,
                    Content: content
                });
            });
        } else {
            var content = reviews.Content.replace(/<\/?[^>]+(>|$)/g, "");
            product.EditorialReviews.push({
                Source: reviews.Source,
                Content: content
            });
        }
    }

    return product;
};