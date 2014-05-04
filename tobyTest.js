var blessed = require('blessed');
var api = require("./apaapi");
var searchterm = "superman";
// Create a screen object.
var screen = blessed.screen();

screen.append(blessed.line());

// Create content boxes

function DataObject(options){
  this.getItemAt =function(index){
    return  items[index];
  }
  this.getItemLabels = function(){
    labels = [];
    items.forEach(function(item){
      labels.push(item.name);
    });
    return labels;
  };


  var items = options.items || [];
};

var testData = new DataObject({
  items: [
    {id: 1124245345, name:'test'},
    {id: 223446345, name: 'test2'}
  ]
});

var commandbar = blessed.box({
    bottom: 0,
    width: '100%',
    height: 1,
    content: '(N)ext (P)revious (Q)uit',
    tags: true,
    style: {
        fg: 'white',
        bg: 'magenta',
        hover: {
            bg: 'green'
        }
    }
});
var content = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '95%',
    content: 'test',
    style: {
        fg: 'green'
    }
});
var list = blessed.list({
    align: 'center',
    fg: 'blue',
    bg: 'default',
    keys: true,
    border: {
        type: 'ascii',
        fg: 'default',
        bg: 'default'
    },
    width: '50%',
    height: '50%',
    top: 'center',
    left: 'center',
    items: testData.getItemLabels(),
    selectedBg: 'green',
    scrollbar: {
        ch: ' ',
        track: {
            bg: 'yellow'
        },
        style: {
            inverse: true
        }
    }
});
// Append our elements to the screen.
screen.append(commandbar);
list.addItem("Test");
list.addItem("Test");
list.addItem("Test");
list.addItem("Test");
screen.append(list);
list.prepend(blessed.text({
  left: 2,
  content: 'My List'
}));
list.focus();


list.on('select', function(data, index){
  // commandbar.setContent(testData.getItemAt(this.selected).id.toString());
  commandbar.setContent(testData.getItemAt(index).id.toString());
  screen.render();
})

screen.key(['n'], function(ch, key) {
    content.setContent('you have just pressed n! \n newline-test');
    screen.render();
});
screen.key(['p'], function(ch, key) {
    content.setContent('you have just pressed p!');
    screen.render();
});
screen.key(['o'], function(ch, key) {
    api.queryProducts({
    searchterm: searchterm,
    onSuccess: function (results) {
        results.forEach(function (entry) {
            entry.loadProduct(function (result) {
                    // console.log(JSON.stringify(result, null, '\t'))
                    list.addItem(result.ASIN);
                    screen.render();
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
});
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'C-c'], function(ch, key) {
    return process.exit(0);
});
// Focus our element.
// Render the screen.
screen.render();