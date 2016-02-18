//store a list of all transactions for undo function
var transactionList= [];

//constructor for a single transaction
function Purchase(name, price){
  this.name = name;
  this.price = price;
  //hold an array of names of people splitting this purchase
  // Do you need a list of buyers and list of transactions
  // maybe use counter instead of list of buyers
  // this.buyers = [];
}

//when enter button is pressed in transaction, convert input to object
$("#transaction-button").click(function(){
  var transactionText = $("#item-input").val();
  var transactionPrice = $("#price").val();

  //if price is not empty, allow a purchase object to be created
  if(transactionPrice !== ""){
    //ensure that transaction price is a number
    if(!isNaN(transactionPrice)){
      //create transaction and add to transaction list

      //add transaction amount when split to selected users
    }
  }
});

//Person object constructor
//Must hold name, balance
function Person(name){
  this.name = name;
  this.balance = 0;
  this.transactions = [];
};

Person.prototype.toHTML = function(){
  //toHTML converts object into HTML to display on screen
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
  if($(this).parent().hasClass('editMode')){
    userName = $(this).prevAll('.user-name').text();
    inputString = '<input type="text" value="';
    inputString += userName;
    inputString += '" class="user-name">';
    $(this).prevAll('.user-name').replaceWith(inputString);
  }

  else{
    userName = $(this).prevAll('.user-name').val();
    inputString = '<h2 class="user-name">';
    inputString += userName;
    inputString += '</h2>';

    $(this).prevAll('.user-name').replaceWith(inputString);
  }
});













//