const express = require('express'); //using express to creat API's
const { text } = require('express');
const e = require('express');
const https = require('http');
const cache = require('/home/front/Desktop/frontend/routeCache.js');
const app = express();
//var parse_Info;
//var parse_Search;
var parse_Pruchase;
var result = []
app.get('/CATALOG_WEBSERVICE_IP/search/:itemName', cache(300) ,(req, res) => { //search about specific topic
    let data = '';
    let parse_Search;
   //send the request for catalog server
//send request to catalog server to give info for book due to item number
https.get(`http://10.0.2.4:3000/CATALOG_WEBSERVICE_IP/find/${req.params.itemName}`, (res) => {//request to catalog server to check if the book exist an quantity>0
res.on('data', (chunk) => {
    data += chunk;
});
res.on('end', () => {// if exist 
    //parse_Search = JSON.parse(data);
    if(!data) { parse_Search = "the book is not exist"}
  else {parse_Search = data}
  result.push(parse_Search);
});
})

.on('error', (error) => {
    console.log(error);//if theres an error
});

res.send(result);//returend value
});

app.get('/CATALOG_WEBSERVICE_IP/info/:itemNUM',cache(300),(req, res) => {//query to give info using item number
    let data = '';
    let parse_Info;
    //send request to catalog server to give info for book due to item number
    https.get(`http://10.0.2.4:3000/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {//request to catalog server to check if the book exist an quantity>0
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {// if exist 
        if(!data){parse_Info = "the book was not found"}
        else{
        parse_Info = JSON.parse(data);
    const book = {
        tittle : parse_Info.tittle,
        quantity : parse_Info.quantity,
        price : parse_Info.price
    }
        result.push(book);}
    });
    })
    
    console.log(result[result.length -1])
    //console.log(R);
    res.send(result);//returend value
    });
    
app.get('/CATALOG_WEBSERVICE_IP/pruchase/:itemNUM',cache(300), (req, res) => {//query to buy a specific book, it will send the request to order server
    let data = '';
 https.get(`http://10.0.2.7:3000/CATALOG_WEBSERVICE_IP/buy/${req.params.itemNUM}`, (res) => {//send the request to order server
 res.on('data', (chunk) => {
     data += chunk;
 });
 res.on('end', () => {
    console.log(data)
    //parse_Pruchase = JSON.parse(data); //returned data
    parse_Pruchase = data;
 });
 })
 .on('error', (error) => {
     console.log(error);
 });
 if(!parse_Pruchase) res.status(404).send('The Book is not found!'); //if it's null, that's mean book not available
 else {res.send("Bought successfuly!");}//if exist return bought list
});

const port = process.env.PORT||3000;//port listining to request
app.listen(port, () => console.log(` Listeningon port $ { port }...`))
