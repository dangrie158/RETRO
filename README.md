# R.E.T.R.O.

## Widgets

### Commandbar
`setCommands()` blabla

`drawCommands()` test  

- hallo

## Amazon API

### Static Methods
 
``` js
queryProducts(searchterm, onSuccess[, onError]);
queryProducts(options);
```
Queries the Amazon Service and returns a minimal
representation of a `Product` consisting of Title and ASIN

We allow two ways to pass parameters to the function,
one way is to define multiple parameters and the other
is an object array.

**Parameters**

- String `searchterm`: the string to search for
- Function `onSuccess`: callback with a `ProductsList` object as first parameter 
- Function `[onError]`: callback with an error message String as first parameter
- String `[searchIndex]`: the Amazon [search index](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/DESearchIndexParamForItemsearch.html) to query.
- `return`: `undefined`

This will only give you `Product`s with `Title`and `ASIN` Attributes set. To get a fully loaded Product, call `Product.loadProduct()`. To check wether or not a Product is already loaded, check the attribute `Product.fullyLoaded`.

---

``` js
loadProduct(product, onSuccess[, onError]);
loadProduct(asin, onSuccess[, onError]);
loadProduct(options);
```

Queries for all available Information on Amazon.

**Parameters**

- Product `product`: an instance of Product with the ASIN set
- String `asin`: the ASIN to query
- Function `onSuccess`: callback with a fully loaded `Product` object as first parameter 
- Function `[onError]`: callback with an error message String as first parameter
- `return`: `undefined`

### Product Class

Class to store Product Information

#### Constructors

``` js
Product(asin, title);
```

- String `asin`: The ASIN of the Product
- String `title`:The Title of the Product

#### Methods

``` js
loadProduct(onSuccess[, onError]);
loadProduct(options);
```

Queries the full Information of the Product

**Parameters**

- Function `onSuccess`: callback with a fully loaded `Product` object as first parameter 
- Function `[onError]`: callback with an error message String as first parameter
- `return`: `undefined`

#### Instance Variables

- String `ASIN`: The ASIN of the Product
- String `Title`: The Title of the Product
- Boolean `fullyLoaded`: Whether the Product is fully Loaded by `loadProduct` or not
- String `[Manufacturer]`: The Manufacturer of the Product
- String `[ReleaseDate]`: The ReleaseDate of the Product
- String `[ProductGroup]`: The ProductGroup of the Product
- String `[Creator]`: The Creator of the Product
- Array `[Creator]`: All Creators of the Product
- String `[Feature]`: The Feature of the Product
- Array `[Feature]`: All Features of the Product
- String `[Price]`: The Price of the Product
- String `[EditorialReviews]`: The EditorialReview of the Product
- Array `[EditorialReviews]`: All EditorialReviews of the Product

### ProductsList Class

Class to Store multiple Products and allow easy Access to the Attributes

#### Prototypes: `Array`

#### Constructors

``` js
ProductList();
```

#### Methods
``` js
getProductInfo(fieldName);
```
Returns an Array only containing the specified attribute of all products

**Parameters**

- String `fieldName`: The `Product` field name to get
- `return`: `Array`

---

``` js
getProductTitles();
```
Returns an Array containing all Product Titles

**Parameters**

- `return`: `Array`

---

``` js
getProductAsins();
```
Returns an Array containing all Product ASINs

**Parameters**

- `return`: `Array`