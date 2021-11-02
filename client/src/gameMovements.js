//Tell the library which element to use for the table
cards.init({table:'#card-table', type:STANDARD});

//Create a new deck of cards
deck = new cards.Deck();
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 600;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create the tablau setup
hand1 = new cards.Hand({faceUp:false, y:450, x:50});
hand2 = new cards.Hand({faceUp:false, y:450, x:250});
hand3 = new cards.Hand({faceUp:false, y:450, x:450});
hand4 = new cards.Hand({faceUp:false, y:450, x:650});
hand5 = new cards.Hand({faceUp:false, y:450, x:850});
hand6 = new cards.Hand({faceUp:false, y:450, x:1050});
hand7 = new cards.Hand({faceUp:false, y:450, x:1250});
talon = new cards.Hand({faceUp:true, x:180});



//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
    deck.deal(1, [hand1], 50);
    deck.deal(2, [hand2], 50);
    deck.deal(3, [hand3], 50);
    deck.deal(4, [hand4], 50);
    deck.deal(5, [hand5], 50);
    deck.deal(6, [hand6], 50);
    deck.deal(7, [hand7], 50);
    hand2.topCard().showCard();
});


//When you click on the top card of a deck, cards are added to the talon
deck.click(function(card){
	if (card === deck.topCard()) {
		deck.deal(3, [talon], 50);
	}
});

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
lowerhand.click(function(card){
	if (card.suit == discardPile.topCard().suit
		|| card.rank == discardPile.topCard().rank) {
		discardPile.addCard(card);
		discardPile.render();
		lowerhand.render();
	}
});