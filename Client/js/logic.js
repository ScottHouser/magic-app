/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//uses 3rd party api

var makeEbayCall = function () {
    var title = $('#modal_title').val();
    var description = $('#modal_description').val();
    var startPrice = $('#modal_starting_price').val();
    var picURL = $('#modal_pic_url').val();
    var eBayAuthToken = '';
    var conditionId = document.getElementById("new_check").checked ? 1000 : 3000;
    var categoryId = document.getElementById("foil_check").checked ? 49181 : 38292;


    var makeEbayCallJson = function (title, description, startPrice, picURL, conditionId, CategoryId) {
        var ebayJson = '<?xml version="1.0" encoding="utf-8"?>' +
                '<AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">' +
                '<RequesterCredentials>' +
                '<eBayAuthToken>x</eBayAuthToken>' +
                '</RequesterCredentials>' +
                '<ErrorLanguage>en_US</ErrorLanguage>' +
                '<WarningLevel>High</WarningLevel>' +
                '<Item>' +
                '<CategoryMappingAllowed>true</CategoryMappingAllowed>' +
                '<ConditionID>' + conditionId + '</ConditionID>' +
                '<Country>US</Country>' +
                '<Currency>USD</Currency>' +
                '<Description>' + description + '</Description>' +
                '<DispatchTimeMax>2</DispatchTimeMax>' +
                '<ListingDuration>Days_30</ListingDuration>' +
                '<ListingType>FixedPriceItem</ListingType>' +
                '<PaymentMethods>PayPal</PaymentMethods>' +
                '<PayPalEmailAddress>bulseye1111@gmail.com</PayPalEmailAddress>' +
                '<PictureDetails>' +
                '<PictureURL>' + picURL + '</PictureURL>' +
                '</PictureDetails>' +
                '<PostalCode>73013</PostalCode>' +
                '<PrimaryCategory>' +
                '<CategoryID>' + categoryId + '</CategoryID>' +
                '</PrimaryCategory>' +
                '<Quantity>1</Quantity>' +
                '<ReturnPolicy>' +
                '<ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>' +
                '<RefundOption>MoneyBack</RefundOption>' +
                '<ReturnsWithinOption>Days_30</ReturnsWithinOption>' +
                '<Description>If the card or cards are damaged or counterfeited, please message me or open a return through ebay and I will refund you as soon as possible.</Description>' +
                '<ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>' +
                '</ReturnPolicy>' +
                '<ShippingDetails>' +
                '<ShippingType>Flat</ShippingType>' +
                '<ShippingServiceOptions>' +
                '<FreeShipping>1</FreeShipping>' +
                '<ShippingService>ShippingMethodStandard</ShippingService>' +
                '</ShippingServiceOptions>' +
                '</ShippingDetails>' +
                '<Site>US</Site>' +
                '<StartPrice>' + startPrice + '</StartPrice>' +
                '<Title>' + title + '</Title>' +
                '</Item>' +
                '<Version>1019</Version>' +
                '</AddItemRequest>'


        return ebayJson;

    };


    var form = makeEbayCallJson(title, description, startPrice, picURL, conditionId, categoryId);
    console.log(form);
    socket.emit('ebayPostListing', form);
    socket.on('xmlRequest', function (data) {
        console.log(data);
        $.ajax({
            type: 'POST',
            url: 'https://api.ebay.com/ws/api.dll',
            headers: {
                'X-EBAY-API-COMPATIBILITY-LEVEL': '1019',
                'X-EBAY-API-CALL-NAME': 'AddItem',
                'X-EBAY-API-SITEID': '0',
                'X-EBAY-API-DETAIL-LEVEL': 0,
                'X-EBAY-API-IAF-TOKEN': 'AgAAAA**AQAAAA**aAAAAA**HKoxWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6AFmYqoC5mAow+dj6x9nY+seQ**4f4DAA**AAMAAA**aloOJiTqs+eJfiI0TmWCHXLFsfPkd0eRThFQ+f+Fjj+6oLDl6m3B/3IlwjX0+/1nHJu4HnwVwWS3pmlusXMY4Dwq4VoBGAzFar42TFSCMZcR/TrD3h8fzMOL2EQCDyqGHnhzoHQoMptrY4h2mDhokOxG49k6VbtHCu6VVElyYIBrmxamcCQsA4YSNbLX65rTm1KSEs73euaDsnN6rBGnsk3mLU71VZ+gCuaOsGsP4mloK8VYiDhoq0ealgeBZyVgUjFXma924oAdx+yNtEp0KtaJAy18NDZ8jqLLucGNKtUGLzcw+Ibu3e5qFKeoawH0ab0Qw7JzKSRlHR4PNHQwIdmzVY3EN9ffMPlcjAmBvY31qPGYR4Ssj5IcfplIRqjUdhaamSJCebSCT/AUMOOj6dTlVh1nHrlMiqL/hzUu3apCafJ9oJme0yX9o00wtGgvIUO8kJeHPbi9TQOsQS0bsNV0ZWbPPBTVGMgAtepdAtRtQfdjLRBTCzKFFFa1jDNC1i6F8Vec3/ne5muNzhNPC2QWP580TRAIsDoExeIIpwcJFeWXEIafBzAsJjpObST47yqk7Xy5dlAHnS90zwOB+2QZpRKPl05CSkO/+JXkgz5Jsnlc3gNaxZvYFB3rynClBtInp9G+H8tXeQWjH5v5IE/U8d0eUdN9lhjDg4795teB+8PNc0jvIIyJ8xpAV8Q8jjcNf2IByQX3iNQj5/XdeHgxdDdsb0zmfNmQAPwlXkp0J8ze92/GB6BBp1iTMoBx'
            },
            data: data.xml


        }).success(function (data) {
            console.log('success', data);


        }).fail(function (error) {
            console.log('error', error);
        });
    });
};


var a = function (input) {
    var formatedInput = formatLowerCaseNoSpaces(input);



    $.ajax({
        type: 'GET',
        url: 'https://api.deckbrew.com/mtg/cards/' + formatedInput

    }).success(function (data) {


        var g = "url(" + data.editions[0].image_url + ")";
        var searchTable = $('#card_list');
        var searchTable2 = $('#main_pic');

        searchTable2.css({"background-image": g, "background-position": 'top right', 'background-repeat': 'no-repeat'});

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
        var linkToDisplay = $('<a class="search_table_link">').click(function () {
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

        clearModal();
        $('#modal_title').val(title);
        $('#modal_quantity').val(1);

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
    if (data.cards.length == 0) {

        var createListingLink = $('<a>').attr({"data-toggle": 'modal', "data-target": '#myModal', href: 'url', class: "search_table_link", onclick: fillModal(data.searchTermReturn)});
        createListingLink.append('<h4> Create Listing </h4>');

        var tableRow = $('<tr>');
        var tableD = $('<td>').attr({class: 'indiv_card'});
        cardlist.append(tableRow.append(tableD.append(createListingLink)));


        var formatedInput = formatLowerCaseNoSpaces(data.searchTermReturn);


        $.ajax({
            async: false,
            type: 'GET',
            url: 'https://api.deckbrew.com/mtg/cards/' + formatedInput

        }).success(function (data) {




            $.each(data.editions, function (index, value) {
                var newRadioDiv = $('<div>');
                var newRadioLable = $('<lable>');
                newRadioLable.append(data.editions[index].set + " " + data.editions[index].set_id);
                var newRadioRadioButton = $('<input>').attr({type: 'radio', dataSetName: data.editions[index].set, dataSetAbr: data.editions[index].set_id, name: "optradio"});

                $('#set_radio_div').append(newRadioDiv.append(newRadioRadioButton, newRadioLable));
            });

        });
    }

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
//

var titleGenerator = function () {

    var cardName = $('#modal_title').val();
    var quantity = $('#modal_quantity').val() == 1 ? '' : 'x' + $('#modal_quantity').val();
    var setName = '';
    var setAbr = '';
    var sets = [];
    var foil = document.getElementById("foil_check").checked ? 'FOIL' : '';
    var condition = document.getElementById("new_check").checked ? "NM" : '';

    var checkedSet = ($("#set_radio_form input[type='radio']:checked"));

    setName = checkedSet[0].getAttribute('datasetname');
    setAbr = checkedSet[0].getAttribute('datasetabr');

    //if (quantity == 1) { quantity = ""}

    var outputString = cardName + " " + quantity + foil + " MTG " + setName + " " + setAbr + " " + condition;

    $("#modal_title").val(outputString);


};

var discriptionGenerator = function () {

    var cardName = $('#modal_title').val();
    var quantity = $('#modal_quantity').val() == 1 ? '' : 'x' + $('#modal_quantity').val();
    var setName = '';
    var setAbr = '';
    var sets = [];
    var foil = document.getElementById("foil_check").checked ? 'FOIL' : '';
    var condition = document.getElementById("new_check").checked ? "NM" : '';

    var checkedSet = ($("#set_radio_form input[type='radio']:checked"));

    setName = checkedSet[0].getAttribute('datasetname');
    setAbr = checkedSet[0].getAttribute('datasetabr');

    var outputString = cardName + " " + quantity + foil + " MTG Magic the Gathering\n" + setName + " " + setAbr + " \n " + condition + " Free shipping!";

    $("#modal_description").val(outputString);


};

var clearModal = function () {
    $('#modal_title').val('');
    $('#modal_quantity').val('');
    $('#modal_starting_price').val('');
    $('#modal_description').val('');
    $('#modal_pic_url').val('');
    document.getElementById("foil_check").checked = false;
    document.getElementById("new_check").checked = false;
    $('#set_radio_div').empty();

    var newRadioDiv = $('<div style="margin-top:10px;">');
    var newRadioLable = $('<lable>');
    newRadioLable.append('Custom Text');
    var newRadioRadioButton = $('<input>').attr({type: 'radio', dataSetName: '', dataSetAbr: '', name: "optradio"});

    $('#set_radio_div').append(newRadioDiv.append(newRadioRadioButton, newRadioLable));
};

var formatLowerCaseNoSpaces = function (word) {
    var formatedInput = '';

    var w = word.split(',').join('');

    var formatedInput = w.split(' ').join('-').toLowerCase();


    return formatedInput;
};

var testGoogleFunction = function () {
    var googURL= $('#modal_pic_url').val();
    $.ajax({
        type: 'POST',
        url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCVHqmoP280py605KPBGz2PGbeRpf8Tmjs',
        contentType: 'application/json',   
        data: '{"longUrl":"'+googURL+'"}'

    }).success(function (data) {
       
       $('#modal_pic_url').val(data.id);
        
    });

};