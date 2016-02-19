//hold a list of the transaction objects
var transactionList= [];
//hold a list of the people objects
var peopleList= [];

//constructor for a single transaction
function Purchase(name, price){
  this.name = name;
  this.price = price;
  //hold an array of names of people splitting this purchase
  this.buyers = [];
}

//Takes the people contained within the buyers array and splits the value of
//price between their balances
Purchase.prototype.addBalance = function(){
  // iterate through the list of buyers to find the matching people
  for(var i = 0; i < this.buyers.length; i++){
    for(var j = 0; j < peopleList.length; j++){
      if(this.buyers[i] === peopleList[j].name){
        // Add to the balance of the matching people the price of 
        // transaction divided by buyers
        peopleList[j].balance += this.price / this.buyers.length;
        console.log(peopleList[j]);

        //refresh the UI with the updated balance
        console.log('.' + peopleList[j].name + '');
        $('.' + peopleList[j].name ).replaceWith(peopleList[j].toHTML());
      }
    }
  }
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
        $transactionPrice.val() );

      //append the name of the buyers into the transactions buyer array
      $('.selected').each(function(i, value){
        transaction.buyers[i] = $(this).attr('class').split(' ')[1];
      });

      // push the transaction name into the selected persons transaction list
      for(var i = 0; i < transaction.buyers.length; i++){
        for(var j = 0; j < peopleList.length; j++){
          if(transaction.buyers[i] === peopleList[j].name){
            console.log(peopleList[j].name);
            console.log(transaction.name)
            peopleList[j].transactions.push(transaction);
          }
        }
      }

      //add transaction amount when split to selected users
      console.log(transaction);
      transaction.addBalance();
    }
  }

  transactionList.push( transaction );

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


//Bind functionality to edit button in person object
$('#holder').delegate('.edit', 'click', function(){
  $(this).parent().toggleClass('editMode');
  var userName;
  var inputString;
  //Record the old name in order to change the name of people in purchases
  //to the new name
  var oldName;

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

    //for each transaction in the transaction list, check the buyers list
    for(var i = 0; i < transactionList.length; i++){
      //iterate over each name in the buyers list
      for(var j = 0; j < transactionList[i].buyers.length ; i++){
        if(transactionList[i].buyers[j] === oldName){
          //set the name of the buyer to the new edited name
          transactionList[i].buyers[j] = userName;
        }
      }
    }
  }
});













//