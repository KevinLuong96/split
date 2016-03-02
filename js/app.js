//hold a list of the transaction objects
var transactionList= [];
//hold a list of the people objects
var peopleList= [];

var help;
var nameHelp;
var transactionHelp;
var peopleHelp;

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
  var textString;
  var $list = [];
  var $transactionList;
  var listLength;

  for(var i = 0; i < this.buyers.length; i++){
    // select the person with the same name as the elements in the buyers list
    buyer = getObjectByName(this.buyers[i], 'person');
    // add to their balance the price of the transaction divided by # of people
    buyer.balance += Math.round (this.price / this.buyers.length * 100) / 100;

    // add the transaction to the list of transactions in the UI
    textString = '<p class= purchase>';
    textString += this.name;
    textString += ': ';
    textString += this.price;
    textString += '</p>'

    // record all of the list items which were appended to the ui
    $list = $('.' + buyer.name + ' .transaction-list').children();    

    /*
    since the ui is rewritten every time, keep track of current transaction list 
    items appended to the html
    */

    // // refresh the ui to show the updated balance
    $('.' + buyer.name).replaceWith(buyer.toHTML());
    

    $('.' + buyer.name + ' .transaction-list').append($list);
    $('.' + buyer.name + ' .transaction-list').append(textString);
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

  //reset the value of the forms
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
  htmlString += "<div class= 'transaction-list'></div>"
  htmlString += "</li>"


  return htmlString;
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
  if( $('#name').val() !== '' ){
    $('#holder').append(newUser());
    $('#name').val("");
  } 
});

$('#name').keypress(function(e) {
  if(e.which === 13){
    $('#holder').append(newUser())  ;
    $('#name').val("");
  }
});

$('#undo').click(function(){
  var transaction
  var people;
  var balanceString;

  // if there are any transactions to undo
  if(transactionList.length > 0 ){
    // set the temporary variable to the last added transaction
    transaction = transactionList.pop();
    // remove the price of the transaction from the people objects
    transaction.removeBalance();

    for(var i = 0; i < transaction.buyers.length; i++){
      people = getObjectByName( transaction.buyers[i], 'person');
      for(var j = 0; j < people.transactions.length; j++){
        // find and remove the transaction from the persons list of transactions
        if (transaction.name === people.transactions[j].name){
          people.transactions.splice(j,1);
        }

        balanceString = "<h2 class='user-balance'>";
        balanceString += people.balance;
        balanceString += '</h2>';

        $('.' + people.name + ' .user-balance').replaceWith(balanceString);
      }

      // remove the last added transaction from the people view UI
      $('.' + people.name + ' .transaction-list').children().last()
        .replaceWith('');

      $('#item-input').val(transaction.name);
      $('#price').val(transaction.price);
    }
  }
});

//Add class selected and add visual effect to people object 
//when they are pressed
$('#holder').delegate('h2','click',function(){
  $(this).parent().toggleClass('selected');
});

//Bind functionality to view button in person HTML code
$('#holder').delegate('.view', 'click', function(){
  $(this).nextAll('.transaction-list').slideToggle();
})

//Bind functionality to delete button in person object
$('#holder').delegate('.delete', 'click', function(){
  var name = $(this).prevAll('.user-name').text();
  var person;
  var verify;
  var purchases;
  var length;

  verify = window.confirm("Are you sure you want to delete " + name + "?");

  if( verify ){

    person = getObjectByName(name, 'person');
    console.log(person);
    console.log(person.transactions.length);
    length = person.transactions.length;

    // for each item in the buyers list
    for(var i = 0; i < length; i++){
      console.log("hi");
      // remove balance from other people's balance
      console.log(person.transactions[i].name);
      purchases = getObjectByName(person.transactions[i].name, 'transaction');
      console.log(purchases);
      purchases.removeBalance();

      // remove person from buyers list
      for(var j = 0; j < purchases.buyers.length; j++){
        if(name === purchases.buyers[j]){

          purchases.buyers.splice(j, 1);

          // if there are no more buyers, delete the transaction from the list
          if(purchases.buyers.length === 0){  
            for(var k = 0; k < transactionList.length; k++){
              if( transactionList[k].name === purchases.name ){
                transactionList.splice(k, 1);
              }
            }
          }
            // replace the transaction in the transaction list with the new edited one
          else{
            for(var k = 0; k < transactionList.length; k++){
              if( transactionList[k].name === purchases.name ){
                transactionList[k] = purchases;
              }
            }
          }
        }
      }
    

      // readd balance to other elements in the purchase

      if(purchases.buyers.length != 0){
        purchases.addBalance();

        // console.log(purchases);
        for( var l = 0; l < purchases.buyers.length; l++){
          $('.' + purchases.buyers[l] + ' .transaction-list').children().last().replaceWith('') 
        //   console.log("deleting last p element");
        }
      }


// -------------------------------- to do --------------------------------------------------
// figure out why deleting the middle transactions does not work properly 
// ----------------------------------------------------------------------------------------------------
// remove the second added ui element when a transaction is deleted
    console.log(person.transactions);
    } // for each transaction in the person's list

    // remove person from people list
    for(var i = 0; i < peopleList.length; i++){
      if(name === peopleList[i].name){
        peopleList.splice(i, 1);
      }
    }
    // delete ui element
    $('.' + name).replaceWith('');
    //delete duplicate transaction list item

  } //if verify is true
});

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
}); //edit button functionality

//create the string that contains the elements of the overlay when help is 
//pressed

help = '<div class="help-overlay">';
help += '<img src="img/cancel.png" id="help-cancel">';
help += '<img src="img/left-arrow.png" id="left-arrow">';
help += '<img src="img/right-arrow.png" id="right-arrow">';
help += '</div>';

nameHelp = '<div class= "name-help">';
nameHelp += '<p>Enter the name of the person splitting the bill and press '
nameHelp +=  'accept to start holding their balance.</p>'
nameHelp += '</div>'

transactionHelp = '<div class="transaction-help">';
transactionHelp += '<p>Enter the name of a transaction, its value and ';
transactionHelp += 'select the people who will be splitting it';
transactionHelp += ' and press enter. You can also undo the previous'; 
transactionHelp += ' transaction by pressing the undo button.</p>';
transactionHelp += '</div>';

peopleHelp = '<div class="people-help">';
peopleHelp += '<p>Select people by clicking on them. Pressing view allows you';
peopleHelp += ' to view their transactions, edit allows you to change the name';
peopleHelp += ' of the person and delete removes the person and redistributes ';
peopleHelp += 'their balance to the other people involved in their transactions';
peopleHelp += '.</p></div>'

$('#help').click(function(){
  // $('.main-header').css({
  //   'margin-top': '51px'
  // })
  $('body').append(help);
  $('#help').hide();

  addHelp('name');
  $('#left-arrow').hide();
});  //help button on click

//remove the style and text elements of the help element specified 
function removeHelp(type){
  var $helpType = $('.' + type) ;
  if(type === 'transaction'){
    for(var i =0; i < 3; i++){
    $helpType.children().last().remove()
    }
  } 
  else if(type === 'name') {
    for(var i =0; i < 2; i++){
      $helpType.children().last().remove()
    }
  }

  else{
    $('#holder').children().last().remove();
    peopleList.pop();
  }

  $helpType.removeAttr('style').removeClass('help');

};

//add the styling and text for the specified help type
function addHelp(type){ 

  if( type === 'people'){
    //Create and highlight a sample person 
    $('#name').val('Sample');
    $('#holder').append(newUser);
    $('#name').val('');
    $('#holder').children().last().addClass('people');
  }

  var $helpType = $('.' + type);
  $helpType.append('<img src="img/up-arrow.png">');

  if( type === 'name'){
    $helpType.children().last().addClass("name-arrow arrow");
    $helpType.append(nameHelp).addClass('help');
  }

  else if( type === 'transaction'){
    $helpType.children().last().addClass('transaction-arrow arrow');
    $helpType.append('<img src="img/up-arrow.png" class="second-arrow arrow">');
    $helpType.append(transactionHelp).addClass('help');
  }

  else{
    $helpType.children().last().addClass('people-arrow arrow')
    $helpType.append(peopleHelp).addClass('help');
  }

  $helpType.css({
    'position': 'relative',
    'z-index': '1',
    'background-color': 'white'
  });
};

//calls on the hide and add functions for the appropriate help texts 
$('body').delegate('#right-arrow', 'click', function() {

  if( $('.name').hasClass('help') ){
    $('#left-arrow').show();
    removeHelp('name');
    addHelp('transaction');
  }

  else{
    $('#right-arrow').hide();
    removeHelp('transaction');
    addHelp('people');
  }
});

$('body').delegate('#left-arrow', 'click', function() {

  if( $('.transaction').hasClass('help') ){
    $('#left-arrow').hide();
    removeHelp('transaction');
    addHelp('name');
  }

  else{
    $('#right-arrow').show();
    removeHelp('people');
    addHelp('transaction');
  }
});

$('body').delegate('#help-cancel', 'click', function() {
  $('#help').show();
  $('.main-header').css({
    'margin-top': '0'
  });
  $('body').children('.help-overlay').remove();

  if($('.name').hasClass('help')){
    removeHelp('name');
  }
  else if($('.transaction').hasClass('help')){
    removeHelp('transaction');
  }
  else{
    removeHelp('people');
  }
});   //help overlay close button

// $('#split').click(function() {
//   if ($(this).hasClass('maximized')){
//     $(this).removeClass('maximized').css('width', '5%');;
//   }
//   else{
//     $(this).addClass('maximized').css('width', '20%');;
//   }
// });





























