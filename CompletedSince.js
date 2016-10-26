var LeanKitClient = require( "leankit-client" );
var accountName = "chatmeter";
var email = "leankitUserName"
var password = "leankitPassword"
var client = new LeanKitClient( accountName, email, password );

// Change this variable to match the ID of the board
// you want to retrieve. If needed, use the previous
// sample code to list all the boards in your account
// to determine the correct ID to use.
var boardId = 118706773;


client.getBoard( boardId, function( err, board ) {
    if ( err ) console.error( "Error getting board:", err );

    // Get the active lanes from the board
    var lanes = board.Lanes;
    var count = 0;
    var size = 0;
    // Get the first lane (index starts at 0)
    for (var i = 13; i < lanes.length; i++) {

      // Get the cards in the lane
      var cards = lanes[i].Cards;
      // Loop through the cards and output basic information
      for (var j = 0; j < cards.length; j++) {
          var card = cards[ j ];
            if(card.DueDate && Date.parse(card.LastMove) > new Date("October 9, 2016")) {
              count++
              size += card.Size
              size += card.TaskBoardTotalSize
              console.log(card.Id, card.Title, 0 + card.Size + card.TaskBoardTotalSize)
            }
      }

    }

    console.log("cards ", count );
    console.log("size ", size)
} );

client.getBoardArchiveLanes( boardId, function( err, archive ) {
    if ( err ) console.error( "Error getting board:", err );
    var count = 0;
    var size = 0;
    // Get the active lanes from the board
    var cards = archive[0].Lane.Cards;
      // Loop through the cards and output basic information
      for (var j = 0; j < cards.length; j++) {
          var card = cards[ j ];
          if(card.DueDate && Date.parse(card.LastMove) > new Date("October 9, 2016")) {
              count++
              size += card.Size
              size += card.TaskBoardTotalSize
              console.log(card.Id, card.Title, 0 + card.Size + card.TaskBoardTotalSize)
            }
      }

      console.log("cards ", count );
      console.log("size ", size)
} );
