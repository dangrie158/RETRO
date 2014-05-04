#R.E.T.R.O.

##Widgets

###Commandbar
`setCommands()` blabla

`drawCommands()` test  

- hallo

##Amazon API
```
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
- Function `onSuccess`: callback with a `ProductsList` object as first paremeter 
- Function `[onError]`: callback with an error message String as first parameter
- String `[searchIndex]`: the Amazon [search index](http://docs.aws.amazon.com/AWSECommerceService/latest/DG/DESearchIndexParamForItemsearch.html) to query 