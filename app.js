/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var mysql = require('mysql');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Client/index.html');


    //var angular = (__dirname + '/Client/js/angularApp.js');
    //console.log(angular);

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "apprentice",
        database: "mesaSQL"
    });

    con.connect(function (err) {
        if (err)
            throw err;
        console.log("Connected!");

        con.query("SELECT * FROM `Website_Content_mesa`", function (err, result, fields) {
            if (err)
                throw err;

        });
    });

    //SOCKETS
    var io = require('socket.io')(serv, {});
    io.sockets.on('connection', function (socket) {

        //TESTDB
        socket.on('hitDB', function (data) {

            con.query("SELECT * FROM `card_DB`", function (err, result, fields) {
                if (err)
                    throw err;

                socket.emit('dbReturn', {cards: result});
            });
        });
        //SEARCHBAR
        socket.on('searchBar', function (data) {

            con.query("SELECT * FROM `card_name_db` WHERE name LIKE" + "'%" + data.searchTerm + "%' LIMIT 10", function (err, result, fields) {
                if (err)
                    throw err;
                console.log(result);

                socket.emit('searchBarReturn', {cards: result});
            });
        });
        //SEARCHRESULTBARCLICKED
        socket.on('searchBarSelected', function (data) {

            con.query("SELECT * FROM `card_DB` WHERE name_card LIKE" + "'%" + data.searchTerm + "%' LIMIT 10", function (err, result, fields) {
                if (err)
                    throw err;

                socket.emit('searchBarReturnClick', {cards: result});
            });
        });
        
        //SUBMITaCARDSTODB
        socket.on('submitDB', function (data) {
            console.log(data);
            var sql = "INSERT INTO `card_DB`(name_card, set_name, purchace_price, quantity, current_price) VALUES ?";
            var values = [
                [data.name, data.set_name, data.purchace_price, parseInt(data.quantity), data.current_price]
            ];

            if (!isNaN(parseInt(data.quantity))) {
                console.log(data.name.toString());

                con.query("SELECT * FROM `card_DB` WHERE name_card LIKE" + "'" + data.name + "'", function (err, result, fields) {


                    if (err)
                        throw err;
                    if (result.length !== 0) {

                        var q = parseInt(result[0].quantity) + parseInt(data.quantity);


                        con.query("UPDATE card_DB SET quantity = " + parseInt(q) + " WHERE name_card =" + "'" + result[0].name_card + "'", function (err, result, fields) {
                            if (err)
                                throw err;
                            socket.emit('entryReturnClick', {message: 'Success!', card: data.name});
                        });


                    } else {
                        con.query(sql, [values], function (err, result, fields) {
                            if (err)
                                throw err;

                            socket.emit('entryReturnClick', {message: 'Success!', card: data.name});
                        });
                    }
                });


            } else {
                socket.emit('entryReturnClick', {message: 'Not A Quantity!'});
            }
        });

        //SUBMITCARDSTODB ALL CARDS!
        socket.on('submitDB2', function (data) {

            var sql = "INSERT INTO `card_name_db`(name) VALUES ?";
            var values = [
                [data.name]
            ];

            con.query(sql, [values], function (err, result, fields) {
                if (err)
                    throw err;


            });

        });
        
         socket.on('deleteOne', function (data) {
             console.log(data);
            //var newQuantity=7; 
            
            var cardName=data.name;
             
           // con.query("SELECT * FROM `card_DB` WHERE name_card LIKE" + "'" + data.name + "'", function (err, result, fields) {
                
            //    console.log(result);
               // newNewQuantity=parseInt(result.quantity)-1;
                //=result.quantity-1;
                
                
                
           // }); 
            
            con.query("UPDATE card_DB SET quantity = " + parseInt(data.quantity-1) + " WHERE name_card =" + "'" + cardName + "'", function (err, result, fields) {
               
                            if (err)
                                throw err;
                            socket.emit('minus1ReturnClick', {message: 'Success!', card: data.name});
                        });

            //var sql = "INSERT INTO `card_name_db`(name) VALUES ?";
           // var values = [
           //     [data.name]
           // ];

           // con.query(sql, [values], function (err, result, fields) {
            //    if (err)
            //        throw err;


           // });

        });



    });

});

app.use('/client', express.static(__dirname + '/Client'));

serv.listen(3000);

