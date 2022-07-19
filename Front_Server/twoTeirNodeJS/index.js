const express = require('express'); //using express to creat API's
const { text } = require('express');
const e = require('express');
const https = require('http');
const app = express();
var parse_Info;
var parse_Search;
var parse_Pruchase;
app.get('/CATALOG_WEBSERVICE_IP/search/:itemName', (req, res) => { //search about specific topic
    let data = '';
   //send the request for catalog server
//send request to catalog server to give info for book due to item number
https.get(`http://10.0.2.4:5000/CATALOG_WEBSERVICE_IP/find/${req.params.itemName}`, (res) => {//request to catalog server to check if the book exist an quantity>0
res.on('data', (chunk) => {
    data += chunk;
});
res.on('end', () => {// if exist 
    //parse_Search = JSON.parse(data);
  parse_Search = data

});
})

.on('error', (error) => {
    console.log(error);//if theres an error
});

res.send(parse_Search);//returend value
});

app.get('/CATALOG_WEBSERVICE_IP/info/:itemNUM', (req, res) => {//query to give info using item number
    let data = '';
    //send request to catalog server to give info for book due to item number
    https.get(`http://10.0.2.4:5000/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {//request to catalog server to check if the book exist an quantity>0
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {// if exist 
        parse_Info = JSON.parse(data); 
     
    });
    })
    
    .on('error', (error) => {
        console.log(error);//if theres an error
    });
    res.send(parse_Info);//returend value
    });
    
app.get('/CATALOG_WEBSERVICE_IP/pruchase/:itemNUM', (req, res) => {//query to buy a specific book, it will send the request to order server
    let data = '';
 https.get(`http://10.0.2.7:5000/CATALOG_WEBSERVICE_IP/buy/${req.params.itemNUM}`, (res) => {//send the request to order server
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
