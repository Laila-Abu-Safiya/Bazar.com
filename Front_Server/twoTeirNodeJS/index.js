const express = require('express'); //using express to creat API's
const { text } = require('express');

const https = require('http');
const app = express();
var parse_Info;
var parse_Search;
var parse_Pruchase;
var flag = 1;
var flag1 = 1;
app.get('/CATALOG_WEBSERVICE_IP/search/:itemName', (req, res1) => { //search about specific topic
    let data = '';
    //consloe.log("kareem")
    //send request to catalog server to give info for book due to item number
    https.get(`http://localhost:5001/CATALOG_WEBSERVICE_IP/cachefind/${req.params.itemName}`, (res) => {//request to catalog server to check if the book exist an quantity>0
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {// if exist 
        if(data === "0"){
            parse_Info = "The Book is not found"
        }
        else {parse_Info = (data); }
        res1.send(parse_Info);//returend value

     
    });
    })
    .on('error', (error) => {
        console.log(error);//if theres an error
    })
});

app.get('/CATALOG_WEBSERVICE_IP/info/:itemNUM', (req, res1) => {//query to give info using item number
    let data = '';
    //consloe.log("kareem")
    //send request to catalog server to give info for book due to item number
    https.get(`http://localhost:5001/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {//request to catalog server to check if the book exist an quantity>0
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {// if exist 
        if(data === "0"){
            parse_Info = "The Book is not found"
        }
        else {parse_Info = (data); }
         res1.send ((parse_Info));//returend value

     
    });
    })
    .on('error', (error) => {
        console.log(error);//if theres an error
    })
    });

    
app.get('/CATALOG_WEBSERVICE_IP/pruchase/:itemNUM', (req, res1) => {//query to buy a specific book, it will send the request to order server
    let data = '';
 https.get(`http://localhost:5001/CATALOG_WEBSERVICE_IP/put/${req.params.itemNUM}`, (res) => {//send the request to order server
 res.on('data', (chunk) => {
     data += chunk;
 });
 res.on('end', () => {

    parse_Pruchase = data;
    if(parse_Pruchase === 0) res1.status(404).send("'The Book is not found!'"); //if it's null, that's mean book not available
    else {res1.send("Bought successfuly!");}//if exist return bought list
   
 });
 })
 .on('error', (error) => {
     console.log(error);
 });
});

const port = process.env.PORT||5000;//port listining to request
app.listen(port, () => console.log(` Listeningon port ${ port }...`))

// sudo docker build -t node-docker-tuttorial .
// sudo docker run -it -p 9009:5000 node-docker-tutorial
        else {parse_Info = (data); }
         res1.send(parse_Info);//returend value

     
    });
    })
    .on('error', (error) => {
        console.log(error);//if theres an error
    })
    });

    
app.post('/CATALOG_WEBSERVICE_IP/pruchase/:itemNUM', (req, res1) => {//query to buy a specific book, it will send the request to order server
    let data = '';
 https.get(`http://localhost:5001/CATALOG_WEBSERVICE_IP/put/${req.params.itemNUM}`, (res) => {//send the request to order server
 res.on('data', (chunk) => {
     data += chunk;
 });
 res.on('end', () => {
    console.log(data)
    parse_Pruchase = data;
    if(!parse_Pruchase) res1.status(404).send('The Book is not found!'); //if it's null, that's mean book not available
    else {res1.send("Bought successfuly!");}//if exist return bought list
   
 });
 })
 .on('error', (error) => {
     console.log(error);
 });
});

const port = process.env.PORT||5000;//port listining to request
app.listen(port, () => console.log(` Listeningon port ${ port }...`))
