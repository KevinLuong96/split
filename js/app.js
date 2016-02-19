//hold a list of the transaction objects
var transactionList= [];
//hold a list of the people objects
var peopleList= [];

// Iterate through the list of people or transactions 
//to find the person with the given name
function getObjectByName(name,type){
  if(type === 'person'){
    for(var i = 0; i < peopleList.length; i++){
      if( name === peopleList[i].name ){
        return peopleList[i];
      }
    }
  } 
  else if(type === 'transaction'){
    for(var i = 0; i < transactionList.length; i++){
      if( name === transactionList[i].name){
      return transactionList[i];
      }
    } 
  }
}

//constructor for a single transaction
function Purchase(name, price){
  this.name = name;
  this.price = price;
  //hold an array of names of people splitting this purchase
  this.buyers = [];
}

Purchase.prototype.removeBalance = function(){
  var buyer;
  for(var i = 0; i < this.buyers.length; i++){
    buyer = getObjectByName(this.buyers[i], 'person');
    buyer.balance -= Math.round (this.price / this.buyers.length * 100) / 100;
  }
}

//Takes the people contained within the buyers array and splits the value of
//price between their balances
Purchase.prototype.addBalance = function(){
  var buyer;
  for(var i = 0; i < this.buyers.length; i++){
    // select the person with the same name as the elements in the buyers list
    buyer = getObjectByName(this.buyers[i], 'person');
    // add to their balance the price of the transaction divided by # of people
    buyer.balance += Math.round (this.price / this.buyers.length * 100) / 100;
    // refresh the ui to show the updated balance
    $('.' + buyer.name).replaceWith(buyer.toHTML());
    }

  /*
    Unecessary code after getObjectByName function is implemented

  //iterate through the list of buyers to find the matching people
  for(var i = 0; i < this.buyers.length; i++){
    for(var j = 0; j < peopleList.length; j++){
      if(this.buyers[i] === peopleList[j].name){
        // Add to the balance of the matching people the price of 
        // transaction divided by buyers
        peopleList[j].balance += 
        Math.round (this.price / this.buyers.length * 100) / 100;

        //refresh the UI with the updated balance
        $('.' + peopleList[j].name ).replaceWith(peopleList[j].toHTML());
      }
    }
  }
  */
}

//when enter button is pressed in transaction, convert input to object
function createTransaction(){
  var $transactionText = $("#item-input");
  var $transactionPrice = $("#price");


  //if price is not empty, allow a purchase object to be created
  if($transactionPrice !== ""){
    //ensure that transaction price is a number
    if(!isNaN( $transactionPrice.val() ) ){
      //create transaction and add to transaction list
      var transaction = new Purchase( $transactionText.val(), 
        Math.round($transactionPrice.val() * 100 ) /100 );

      //append the name of the buyers into the transactions buyer array
      $('.selected').each(function(i, value){
        transaction.buyers[i] = $(this).attr('class').split(' ')[1];
      });

      for(var i = 0; i < transaction.buyers.length; i++){
        getObjectByName(transaction.buyers[i], 'person')
          .transactions.push(transaction);
      }
      // // push the transaction name into the selected persons transaction list
      // for(var i = 0; i < transaction.buyers.length; i++){
      //   for(var j = 0; j < peopleList.length; j++){
      //     if(transaction.buyers[i] === peopleList[j].name){
      //       peopleList[j].transactions.push(transaction);
      //     }
      //   }
      // }
    }
  }
  //add this transaction to the list of transactions
  transactionList.push( transaction );

  //add transaction amount to balance of buyers
  transaction.addBalance();

  $transactionText.val('');
  $transactionPrice.val('');

}
// when transaction button  or enter is pressed, create new transaction
$('#transaction-button').click(createTransaction);
$('#price').keypress(function(e) {
  if(e.which === 13){
    createTransaction();
  }
});



//Person object constructor
//Must hold name, balance
function Person(name){
  this.name = name;
  this.balance = 0;

  //contains a list of the name of transactions the person is involved in
  this.transactions = [];
}

Person.prototype.toHTML = function(){
  //toHTML converts object into HTML to display on screen

  //concatenate the object into an html string which can be displayed
  var htmlString = "<li class='user "
  htmlString += this.name;
  htmlString += "'><h2 class='user-name'>"
  htmlString += this.name;
  htmlString += "</h2><h2 class='user-balance'>"
  htmlString += this.balance;
  htmlString += "</h2>"
  htmlString += "<button type='button' class='view'>View</button>"
  htmlString += "<button type='button' class='edit'>Edit</button>"
  htmlString += "<button type='button' class='delete'>Delete</button>"
  htmlString += "<p class= 'transaction-list'></p>"
  htmlString += "</li>"
  return htmlString;
};

//undo function holds a list of transactions and when called reverses the last 
//transaction 
function undo(){

};


//create user object and return html string
function newUser(event){
  var user = $('#name').val();
  user = new Person(user);
  peopleList.push(user);
  return user.toHTML();
}
//Create a new list item when button or enter key are pressed
$('#accept').click(function(){
  $('#holder').append(newUser);
  $('#name').val("");
});

$('#name').keypress(function(e) {
  if(e.which === 13){
    $('#holder').append(newUser);
    $('#name').val("");
  }
});

//Add class selected and add visual effect to people object 
//when they are pressed
$('#holder').delegate('h2','click',function(){
  $(this).parent().toggleClass('selected');
});

//Bind functionality to delete button in person object
$('#holder').delegate('.delete', 'click', function(){
  var name = $(this).prevAll('.user-name').text();
  var person;
  var verify;
  var purchases;

  verify = window.confirm("Are you sure you want to delete " + name + "?");

  if( verify ){
    person = getObjectByName(name, 'person');
    // for each item in the buyers list
    for(var i = 0; i < person.transactions.length; i++){
      // remove balance from other people's balance
      purchases = getObjectByName(person.transactions[i].name, 'transaction');
      purchases.removeBalance();


      // remove person from buyers list
      for(var j = 0; j < purchases.buyers.length; j++){
        if(name === purchases.buyers[j]){
          purchases.buyers.splice(j, 1);
        }
      }

      // remove person from people list
      for(var i = 0; i < peopleList.length; i++){
        if(name === peopleList[i].name){
          peopleList.splice(i, 1);
        }
      }

      // readd balance to other elements in the purchase
      purchases.addBalance();

      // delete ui element
      $('.' + name).replaceWith('');
    }
  }
})

//Bind functionality to edit button in person object
$('#holder').delegate('.edit', 'click', function(){
  $(this).parent().toggleClass('editMode');
  var userName;
  var inputString;
  //Record the old name in order to change the name of people in purchases
  //to the new name
  var oldName;
  var items;
  var person;


  //If editMode class is on, change the h2 element containing name to a text 
  //input
  if($(this).parent().hasClass('editMode')){
    userName = $(this).prevAll('.user-name').text();
    inputString = '<input type="text" value="';
    inputString += userName;
    inputString += '" class="user-name">';
    $(this).prevAll('.user-name').replaceWith(inputString);

  }

  //when editMode is pressed again, reset the name 
  else{
    //concatenate a string containing the new username 
    userName = $(this).prevAll('.user-name').val();
    inputString = '<h2 class="user-name">';
    inputString += userName;
    inputString += '</h2>';

    // set the old name to the second class of the parent element 
    oldName = $(this).parent().attr('class').split(' ')[1];

    //replace the input with an h2 element containing the new userName
    $(this).parent().removeClass().addClass('user ' + userName);
    $(this).prevAll('.user-name').replaceWith(inputString);

    // console.log("The old user name is " + oldName);
    // console.log("The new user name is " + userName);

    // get the person object associated with the name to be edited
    person = getObjectByName(oldName, 'person')
    // change the name of the object to the new name
    person.name = userName;

    // for every transaction in the list of transactions
    for(var i = 0; i < person.transactions.length; i++){
      // get the object that is named in the transaction list
      items = getObjectByName(person.transactions[i].name, 'transaction');
      // find the old name within the list of buyers for that object
      for(var j = 0; j < items.buyers.length; j++){
        if (items.buyers[j] === oldName){
          // replace the old name with the new one
          items.buyers[j] = userName;
        }
      }
    }
    // obsolete code with getObjectByName function

    // //for each transaction in the transaction list, check the buyers list
    // for(var i = 0; i < transactionList.length; i++){

    //   getObjectByName(transactionList)
    //   //iterate over each name in the buyers list
    //   for(var j = 0; j < transactionList[i].buyers.length ; i++){
    //     if(transactionList[i].buyers[j] === oldName){
    //       //set the name of the buyer to the new edited name
    //       transactionList[i].buyers[j] = userName;
    //     }
    //   }
    // }
  }
});