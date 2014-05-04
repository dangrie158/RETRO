// var util = require('util'),
//     OperationHelper = require('apac').OperationHelper;
// var opHelper = new OperationHelper({
//     awsId: 'AKIAJ2633FPJBILFYTXA',
//     awsSecret: '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',
//     assocId: 'r0b680-20'
//     // xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options)
// });
// // execute(operation, params, callback, onError)
// // operation: select from http://docs.aws.amazon.com/AWSECommerceService/latest/DG/SummaryofA2SOperations.html
// // params: parameters for operation (optional)
// // callback(parsed, raw): callback function handling results. parsed = xml2js parsed response. raw = raw xml response
// // onError: function handling errors, otherwise all error messages are printed with console.log()
// opHelper.execute('ItemSearch', {
//     'SearchIndex': 'MP3Downloads',
//     'Keywords': 'lose yourself',
//     'ResponseGroup': 'ItemAttributes,Offers'
// }, function (results) {
//     // results.ItemSearchResponse.Items[0].Item.forEach(function (entry) {
//     //     console.log("ASIN: " + entry.ASIN[0] + " Name: " +entry.ItemAttributes[0].Title[0]);
//     // });
//     console.log(JSON.stringify(results.ItemSearchResponse.Items[0].Item[0], null, '\t'));
// });

var api = require("./apaapi");
// console.dir(api);
api.queryProducts({
    searchterm: "how i met your mother",
    onSuccess: function (results) {
        results.forEach(function (entry) {
            entry.loadProduct(function (result) {
                    console.log(JSON.stringify(result, null, '\t'))
                },
                function (message) {
                    console.error(message)
                });
        });
    },
    onError: function (message) {
        console.error(message);
    }
});