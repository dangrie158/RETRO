/*
 * Route Provider for navigating
 * This allows passing parameters in the form of /key=value/key2=value2 ...
 */
var RouteProvider = function () {
}

//Holds all Routes we navigated to...
RouteProvider.history = [];

//This always has to be overwritten!
RouteProvider.loadPage = function(){};

//This extracts parameter information form the Route and
//passes it as a routeParams Array
RouteProvider.navigateTo = function(newRoute){
    var routeParts = newRoute.split('/');
    var route;
    var routeParams = {};
    routeParts.forEach(function(part, key){
        if(key==0){
            //First Part is always our route
            route = part;
        }else{
            //other parts are params
            var param = part.split('=');
            routeParams[param[0]] = param[1];
        }
    });
    
    RouteProvider.loadPage(route, routeParams);
    RouteProvider.history.push(newRoute);
};

RouteProvider.goBack = function(){
    //This is the current entry...
    //Throw it away
    RouteProvider.history.pop();

    //Go to the next one
    RouteProvider.navigateTo(RouteProvider.history.pop());
}

module.exports = RouteProvider;