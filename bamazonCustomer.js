var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1511",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) { console.log(err) };
  console.log("connected as id " + connection.threadId + "\n");
  ;
  runApp();

});
//Display all the items available for sale



function displayItems() {
  var query = 'SELECT * FROM products'
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Item_ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: $" + res[i].price + " || Stock Quantity: " + res[i].stock_quantity + " || Sales: " + res[i].sales );
    }
  
  })
  placeOrder()
}



//Ask for user input
//  * ID of the product user would like to buy.
//  * how many units of the product user would like to buy

function placeOrder() {

  inquirer.prompt([
    {
      type: "input",
      message: "Please enter item_id of the product you would like to purchase",
      name: "item_id"
    },
    {
      type: "input",
      message: "Please enter the quantity of the product you would like to purchase",
      name: "order_quantity"
    }


  ]).then(function (inquirerResponse) {
    console.log(inquirerResponse);
    var order = parseFloat(inquirerResponse.order_quantity);
    var item = inquirerResponse.item_id
    console.log("checking the inventory for the Item ID " + inquirerResponse.item_id + "|| order qunatity: "+ order + "\n");

  //read stock_quantity from products mysql data table
    var query = "SELECT stock_quantity, price FROM products WHERE ? "
    connection.query(query, { item_id: item }, function (err, res) {
      if (err) { console.log(err) };
      // console.log("current quantity in stock: " + res[0].stock_quantity);
      var stock = parseFloat(res[0].stock_quantity);
      var price = parseFloat(res[0].price);
      var addSales = order * price;
      // console.log(addSales);
      // console.log(stock - order);
     
      checkQuantity(order, stock, item, addSales);

    });

  });
}


function checkQuantity(order, stock, item, addSales) {
  if (order > stock) {
    console.log("Insufficient stock. we currently have only " + stock + " in stock");
    placeOrder();
  }

  else {
    console.log("Your order has been successfully placed");

    var newStock = stock - order;
    // console.log(newStock);
    updateStock(newStock, item);
    updateSales(addSales, item);
  }
}

function updateStock(newStock, item) {
  
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newStock
      },
      {
        item_id: item
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " products updated!\n");
      
    }
    
  );
  console.log(query.sql);
  

  
}

function updateSales(addSales, item){
  var query =connection.query( 
    "UPDATE products SET sales = sales +? WHERE ? ",
  [addSales, {item_id: item}], function(err, res){
    if (err) {console.log(err)};
    console.log(query.sql)
    displayUpdate();
    // runApp();
  })
  

}

function runApp(){
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "what would you like to do",
      choices:[
        "Buy something",
        "Exit"
      ]
    }
  ])
    .then(function (answer) {

      switch (answer.action) {
        case "Buy something":
          displayItems();
          break;

        case "Exit":
        connection.end();
        break;
      }

    })
}



function displayUpdate() {
  var query = 'SELECT * FROM products'
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
    console.log("Item_ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: $" + res[i].price + " || Stock Quantity: " + res[i].stock_quantity + " || Sales: " + res[i].sales);
    }  
  })
  runApp();
   
  }

  



  

