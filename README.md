# R.E.T.R.O.

## Widgets

### Screen Class

The Screen class creates the visuals of our terminal application.

For every Screen object the `title`, `content` and `commandbar` objects have to be set.


#### Constructors

```
screen();
```
Creates a new screen object.

#### Methods

```
setTitle(title);
```
Sets the title of the titlebar.

**Parameters**

- String `title`

____

```
switchScreen(newScreen)
```
Removes every element from the screen and appends the elements of a new Screen to it.

Before this method can be called the `title`, `content` and `commandbar` of the new screen have to be set.

If you create your first screen you also have to call this method.

**Parameters**

- Screen `newScreen`

____

```
key(keylist, callback)
```
Creates a keyboard shortcut for the screen.

**Parameters**

- String-Array `keylist`
- Function `callback`

____


```
setPopup(popup)
```
Sets the popup

**Parameters**

- Object `popup`

____

```
showPopup()
```
Displays the set popup and sets the focus to it. It also grays out the elements in the background.

____

```
hidePopup()
```
Hides the set popup and colors the content elements again.

####Examples####

```
var screen = new screen(),
	commandbar = new commandbar();

screen.title = 'Hello title';
screen.commandbar = commandbar;

// initially draw the screen
screen.switchScreen(screen);

screen.key(['o'], function(){
	screen.showPopup();
})

```


### Title Class

#### Prototypes: `blessed.box`

#### Constructors

```
Title([options])
```
Creates a new title object

- Object `[options]`: Every option for a blessed.box can still be set. By default the title has a height of 1 line, width of 100% and is pinned to the top.

#### Examples

```
var title = title({
	content: 'Sample String'
});
title = 'New String';
```

### Commandbar Class


#### Prototypes: `blessed.box`

#### Constructors

```
commandbar([options])
``` 
Creates a new commandbar object

- Object `[options]`: Every option for a blessed.box can still be set. By default the commandbar has a height of 1 line, width of 100% and is pinned to the bottom.

#### Methods

```
setCommands(commands)
``` 
sets the `options.commands` variable

**Parameters**

- String-Array `commands`

____

```
drawCommands()
``` 
draws the String-Array `options.commands` onto the commandbar

**Parameters**

- String Array `commands`: the commands to be set



#### Examples


This class uses a special syntax for elements to illustrate the shortcut to be used for the command.

To highlight a substring put it in between curly brackets.

```
var commandsArray = ['{N}ext', '{ESC} Cancel'];  
	
var commandbar = commandbar({
	commands:commandsArray
	
commandbar.drawCommands();

commandbar.setCommands(['{N}ext', '{ESC} Cancel', '{E}dit']);
commandbar.drawCommands();
});
```

If the commandbar isn't drawn initially or the screen is not being resized, the screen has to be rendered again to make the changes to the commandbar visible.
This is done by the `screen.render()` method of [blessed](https://github.com/chjj/blessed).


## Amazon API

### Static Methods
 
```
queryProducts(searchterm, onSuccess[, onError]);
queryProducts(options);
```
Queries the Amazon Service and returns a minimal
representation of a `Product` consisting of Title and ASIN.

We allow two ways to pass parameters to the function,
one way is to define multiple parameters and the other
is an object array.

**Parameters**

- String `searchterm`: the string to search for
- Function `onSuccess`: callback with a `ProductsList` object as first parameter and the Number of total Pages as second Argument. **NOTE**: As specified by Amazon you can only get the first 10 Pages.
- Function `[onError]`: callback with an error message String as first parameter
- Number `[page]`: The Page to query **NOTE** if no `searchIndex` is specified amazon will not allow queries for pages > 5 and if a `searchIndex` is specified, amazon will respond to no higher than 10
- String `[searchIndex]`: the Amazon [search index](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/DESearchIndexParamForItemsearch.html) to query.
- `return`: `undefined`

This will only give you `Product`s with `Title`and `ASIN` attributes set. To get a fully loaded product, call `Product.loadProduct()`. To check wether or not a product is already loaded, check the attribute `Product.fullyLoaded`.

---

```
loadProduct(product, onSuccess[, onError]);
loadProduct(asin, onSuccess[, onError]);
loadProduct(options);
```

Queries for all available information on Amazon.

**Parameters**

- Product `product`: an instance of Product with the ASIN set
- String `asin`: the ASIN to query
- Function `onSuccess`: callback with a fully loaded `Product` object as first parameter 
- Function `[onError]`: callback with an error message String as first parameter
- `return`: `undefined`

### Product Class

Class to store product information

#### Constructors

```
Product(asin, title);
```

- String `asin`: The ASIN of the product
- String `title`:The Title of the product

#### Methods

```
loadProduct(onSuccess[, onError]);
loadProduct(options);
```

Queries the full Information of the product

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
- Array `[Creator]`: All Creators of the Product
- String `[Feature]`: The Feature of the Product
- Array `[Feature]`: All Features of the Product
- String `[Price]`: The Price of the Product
- Array `[EditorialReviews]`: All EditorialReviews of the Product

### ProductsList Class

Class to store multiple products and allow easy access to the attributes

#### Prototypes: `Array`

#### Constructors

```
ProductList();
```

#### Methods
```
getProductInfo(fieldName);
```
Returns an Array only containing the specified attribute of all products

**Parameters**

- String `fieldName`: The `Product` field name to get
- `return`: `Array`

#### Getters
- `Titles`: returns an Array of all product titles
- `ASINs`: returns an Array of all product ASINs
