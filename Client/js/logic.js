/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//uses 3rd party api

var makeEbayCall = function () {
    var title = $('#modal_title').val();
    var description = $('#modal_description').val();
    var startPrice = $('#modal_description').val();
    var picURL = '';
    var eBayAuthToken = '';

    var makeEbayCallJson = function (title, description, startPrice, picURL, eBayAuthToken) {
        var ebayJson = {
            "AddItemRequest": {
                "-xmlns": "urn:ebay:apis:eBLBaseComponents",
                "RequesterCredentials": {"eBayAuthToken": eBayAuthToken},
                "ErrorLanguage": "en_US",
                "WarningLevel": "High",
                "Item": {
                    "Title": title,
                    "Description": description,
                    "PrimaryCategory": {"CategoryID": "GET TRADING CARD CATAGORY"},
                    "StartPrice": startPrice,
                    "CategoryMappingAllowed": "true",
                    "ConditionID": "4000",
                    "Country": "US",
                    "Currency": "USD",
                    "DispatchTimeMax": "3",
                    "ListingDuration": "Days_7",
                    "ListingType": "FixedPriceItem",
                    "PaymentMethods": "PayPal",
                    "PayPalEmailAddress": "magicalbookseller@yahoo.com",
                    "PictureDetails": {"PictureURL": picURL},
                    "PostalCode": "73034",
                    "Quantity": "1",
                    "ReturnPolicy": {
                        "ReturnsAcceptedOption": "ReturnsAccepted",
                        "RefundOption": "MoneyBack",
                        "ReturnsWithinOption": "Days_30",
                        "Description": "If you are not satisfied, return for refund.",
                        "ShippingCostPaidByOption": "Buyer"
                    },
                    "ShippingDetails": {
                        "ShippingType": "Flat",
                        "ShippingServiceOptions": {
                            "ShippingServicePriority": "1",
                            "ShippingService": "USPSMedia",
                            "ShippingServiceCost": "FLAT RATE OF SHIPPING"
                        }
                    },
                    "Site": "US"
                }
            }
        };
        return ebayJson;

    };
    var form = makeEbayCallJson(title, description, startPrice, picURL, eBayAuthToken);
    console.log(form);
    socket.emit('ebayPostListing', form);
};


var a = function (input) {

    var formatedInput = '';
    for (var i = 0; i < input.length + 1; i++) {

        if (input.substring(i, i + 1) !== ' ') {
            formatedInput = formatedInput + input.substring(i, i + 1);

        } else {
            formatedInput = formatedInput + '-';

        }

    }

    $.ajax({
        type: 'GET',
        url: 'https://api.deckbrew.com/mtg/cards/' + formatedInput

    }).success(function (data) {

        var g = "url(" + data.editions[0].image_url + ")";
        var searchTable = $('#card_list');
        var searchTable2 = $('#main_pic');

        searchTable2.css({"background-image": g, "background-position": 'right', 'background-repeat': 'no-repeat'});

    });

};
//END


var socket = io();

//RETURN ALL FROM DB
var test = function () {

    socket.emit('hitDB', {id: "afd"});

};

socket.on('dbReturn', function (data) {
    var fillModal = function (title) {
        $('#modal_title').val(title);

    };

    var heightCounter = 0;
    var cardlist = $('#card_list');
    cardlist.empty();

    $.each(data.cards, function (index, value) {
        
        var tableRow = $('<tr>');
        var tableD = $('<td>').attr({class: 'indiv_card'});
        var textH4 = $('<h4>').attr({HTML: value.name_card + " x" + value.quantity});
        textH4.append(value.name_card + " x" + value.quantity + " ");

        var createListingLink = $('<a>').attr({"data-toggle": 'modal', "data-target": '#myModal', href: 'url', onclick: fillModal('')});
        createListingLink.append(' Create Listing ');

        heightCounter = heightCounter + 50;
        //cardlist.append('<tr><td class ="indiv_card"><h4>' + value.name_card + " x" + value.quantity + " " + '<a data-toggle="modal" data-target="#myModal" href="url">Create Listing</a>  </h4></td></tr>');

        var displayDiv = $('#main_pic');
        displayDiv.height(heightCounter);
        cardlist.append(tableRow.append(tableD.append(textH4.append(createListingLink))));
    });
});
//END

//SEARCH BAR DISPLAY
var inputBox1 = document.getElementById('card_search');

inputBox1.onkeyup = function () {

    var searchTable = $('#search_display');
    searchTable.empty();
    var inputBox2 = document.getElementById('card_search').value;

    if (inputBox2 !== '') {
        socket.emit('searchBar', {searchTerm: inputBox2});
    }
    ;

};

socket.on('searchBarReturn', function (data) {

    var searchTable = $('#search_display');

    $.each(data.cards, function (index, value) {
        var tableRow2 = $('<tr>');
        var tableD2 = $('<td>').attr({class: 'indiv_card'});
        var h6text = $('<h6>');
        var linkToDisplay = $('<a>').click(function () {
            displayFunctions(value.name.toLowerCase());
        });
        linkToDisplay.append(value.name.toLowerCase());
        searchTable.append(tableRow2.append(tableD2.append(h6text.append(linkToDisplay))));

    });


});
//END

//Retrieve card by search click
var sendSearchLink = function (searchTermLink) {
    socket.emit('searchBarSelected', {searchTerm: searchTermLink});
};


socket.on('searchBarReturnClick', function (data) {

    var fillModal = function (title) {
        $('#modal_title').val(title);

    };

    var cardlist = $('#card_list');
    cardlist.empty();
    var displayDiv = $('#main_pic');
    displayDiv.height(430);

    $.each(data.cards, function (index, value) {

        var tableRow = $('<tr>');
        var tableD = $('<td>').attr({class: 'indiv_card'});
        var textH4 = $('<h4>').attr({HTML: value.name_card + " x" + value.quantity});
        textH4.append(value.name_card + " x" + value.quantity + " ");

        var createListingLink = $('<a>').attr({"data-toggle": 'modal', "data-target": '#myModal', href: 'url', onclick: fillModal(value.name_card)});

        createListingLink.append(' Create Listing ');
        var deleteOneButton = $('<button>').attr({class: 'btn btn-danger', text: '-1'});
        deleteOneButton.append(' -1');
        deleteOneButton.click(function () {
            deleteOne(value.name_card, value.quantity);
        });

        cardlist.append(tableRow.append(tableD.append(textH4.append(createListingLink, deleteOneButton))));


    });

});
//END

//submit card to database
var submitToDB = function () {
    var cardName = $('#card_input1').val();
    var cardQuantity = $('#card_input2').val();
    var setname = $('#card_input3').val();
    var purchacePrice = $('#card_input4').val();
    var currentPrice = $('#card_input5').val();


    socket.emit('submitDB', {name: cardName, set_name: setname, quantity: cardQuantity, purchace_price: purchacePrice, current_price: currentPrice});

};

socket.on('entryReturnClick', function (data) {

    if (data.message === 'Success!') {
        $('#card_input1').val('');
        $('#card_input2').val('');
        $('#card_input3').val('');
        $('#card_input4').val('');
        $('#card_input5').val('');
        var cardlist = $('#card_list');
        cardlist.empty();
        sendSearchLink(data.card);


    }
    $('#log_message').html(data.message);

});
//END

//FILLS All cards in db
var allCards = function () {
    $.getJSON('/Client/js/AllCards.json', function (data) {

        for (var card in data) {
            socket.emit('submitDB2', {name: card});
        }

    });
};
//END

//Deletes one card when button pressed
var deleteOne = function (card, quant) {

    socket.emit('deleteOne', {name: card, quantity: quant});

};




var displayFunctions = function (linkValue) {
    a(linkValue);
    $('#card_input1').val(linkValue);
    socket.emit('searchBarSelected', {searchTerm: linkValue});
};






