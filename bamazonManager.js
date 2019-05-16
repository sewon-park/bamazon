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
  menuOptions();

});

//menuOptions function that runs when the app launches

function menuOptions(){
  inquirer.prompt([
    {
      name: "menu",
      type: "list",
      message: "what would you like to do?",
      choices:[
        "View products for sale",
        "View low inventory",
        "Add to inventory",
        "Add new product",
        "Exit"
      ]
    }
  ])
    .then(function (answer) {

      switch (answer.menu) {
        case "View products for sale":
        displayItems();
        break;

      
        case "View low inventory":
        displayLowInventory();
        break;    

        case "Add to inventory":
        addInventory();
        break;  
        
        case "Add new product":
        addNewProduct();
        break;  

        case "Exit":
        connection.end();
        break;
      }

    })
}

//displayItem function same as the one in bamazonCustomer.js
function displayItems() {
  var query = "SELECT * FROM products "
  connection.query(query, function (err, res) {
    if (err) {console.log(err)};
    for (var i = 0; i < res.length; i++) {
    console.log("\nItem_ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: $" + res[i].price + " || Stock Quantity: " + res[i].stock_quantity);
   
  }
  menuOptions();
  })
  

}

//displayLowInventory function shows items with fewer than 5 stock quantity
function displayLowInventory() {
  var query = "SELECT * FROM products WHERE stock_quantity < ?  ";
  connection.query(query,5, function (err, res) {
    if (err) { console.log(err) };
    
    for (var i = 0; i < res.length; i++) {
    console.log("Item_ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: $" + res[i].price + " || Stock Quantity: " + res[i].stock_quantity);}
    menuOptions()
  })
  
    
  }


function addInventory(){
  inquirer.prompt([
    {
      type: "list",
      message: "Which item would you like to add inventory to? Select Item ID.",
      name: "addItem",
      choices:[
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ]
    },
    {
      type: "input",
      message: "How many units would you like to add?",
      name: "additionalUnit",
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      }
    }
  
    
  ]).then(function (inquirerResponse) {
  var query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ? ";
  var addQuantity = parseFloat(inquirerResponse.additionalUnit);
  var addItem = inquirerResponse.addItem;
  
  connection.query(query, [addQuantity, {item_id: addItem}],function (err, res) {
    if (err) {console.log(err)};
    console.log(addQuantity +" units of Item ID "+ addItem + " was sucessfully added" );
    displayItems();
    // menuOptions();
    
    
    })
})

}

function addNewProduct(){
  inquirer.prompt([
    {
      type: "input",
      message: "Enter new product's Item ID.",
      name: "newItemId",
    },
    {
      type: "input",
      message: "Enter new product's name.",
      name: "newProductName",
    },
    {
      type: "input",
      message: "Enter new product's department.",
      name: "newProductDept",
    },
    {
      type: "input",
      message: "Enter new product's price.",
      name: "newProductPrice",
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      }
    },
    {
      type: "input",
      message: "Enter new product's stock quantity.",
      name: "newProductStock",
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      }
    }
  ])   
  .then(function(inquirerResponse){
    var query = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)";
    query += "Values ( ? ,  ?  , ?  , ? , ?)";
    var newItemId = parseFloat(inquirerResponse.newItemId);
    var newProductName = inquirerResponse.newProductName;
    var newProductDept = inquirerResponse.newProductDept;
    var newProductPrice = parseFloat(inquirerResponse.newProductPrice);
    var newProductStock = parseFloat(inquirerResponse.newProductStock);
     
    connection.query(query, [newItemId, newProductName, newProductDept, newProductPrice, newProductStock],function (err, res) {
      if (err) {console.log(err)};
      displayItems();
      // menuOptions();
     
      })
    })
    
  }

