const fs = require('fs');
const https = require('http');
const { parse } = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var catalog = [];
var flag = 1;
var parse_Info;

var parser = parse({ columns: true }, function(err, Catalog) {
    catalog = Catalog;
});

fs.createReadStream('cache.csv').pipe(parser);

const express = require('express');
const { text } = require('express');
const e = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Hello world!!!');
});
app.get('/CATALOG_WEBSERVICE_IP', (req, res) => {
    let result = catalog.map(o => ({ id: parseInt(o.id), price: parseInt(o.price), tittle: o.tittle, quantity: parseInt(o.quantity), topic: o.topic }));
    res.send(result);
});
app.get('/CATALOG_WEBSERVICE_IP/cachefind/:ItemName', (req, res1) => {

    let data = '';
    let notfound = '';
    console.log(req.params.ItemName)
    let Book = catalog.filter((c => c.topic === req.params.ItemName));
    let result = Book.map(o => ({ tittle: o.tittle, quantity: parseInt(o.quantity), price: parseInt(o.price), topic: o.topic }));
    if (result.length === 0){
        if(flag === 1){
        https.get(`http://192.168.0.15:5000/CATALOG_WEBSERVICE_IP/find/${req.params.ItemName}`, (res) => {//request to catalog server to check if the book exist an quantity>0
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {// if exist 
            if(data.length === 0){
                notfound = "book not found"
                res1.status(404);
            }
            else {
                console.log("result"+data)
                parse_Info = data;
                const book = {
                    id : catalog.length+1,
                    tittle : parse_Info.tittle,
                    price : parse_Info.price,
                    quantity : parse_Info.quantity,
                    topic : parse_Info.topic
    
                }
                catalog.push(book)
               
                const csvWriter = createCsvWriter({
                    path: 'cache.csv',
                    header: [
                        { id: 'id', title: 'id' },
                        { id: 'price', title: 'price' },
                        { id: 'tittle', title: 'tittle' },
                        { id: 'quantity', title: 'quantity' },
                        { id: 'topic', title: 'topic' }
                    ]
                });
                csvWriter
                    .writeRecords(catalog)
                    .then(() => console.log(''));
                 return res1.send(parse_Info);//returend value 
                

            }
            //res1.send(parse_Info);
            //res1.setHeader('Content-Type', 'text/html');
        });
        })
        .on('error', (error) => {
            console.log(error);//if theres an error
        })
        flag = 0;
    }

    if(flag === 0){
        https.get(`http://192.168.0.14:5000/CATALOG_WEBSERVICE_IP/find/${req.params.ItemName}`, (res2) => {//request to catalog server to check if the book exist an quantity>0
        res2.on('data', (chunk) => {
            data += chunk;
        });
        res2.on('end', () => {// if exist 
            if(data.length === 0){
                notfound = "book not found"
                return res1.status(404);
            }
            else {
                parse_Info = (data);
                const book = {
                    id : catalog.length+1,
                    tittle : parse_Info.tittle,
                    price : parse_Info.price,
                    quantity : parse_Info.quantity,
                    topic : parse_Info.topic
    
                }
                catalog.push(book)
                
                const csvWriter = createCsvWriter({
                    path: 'cache.csv',
                    header: [
                        { id: 'id', title: 'id' },
                        { id: 'price', title: 'price' },
                        { id: 'tittle', title: 'tittle' },
                        { id: 'quantity', title: 'quantity' },
                        { id: 'topic', title: 'topic' }
                    ]
                });
                csvWriter
                    .writeRecords(catalog)
                    .then(() => console.log(''));
                 return res1.send(parse_Info);//returend value 
                

            }
             
        });
        })
        .on('error', (error) => {
            console.log(error);//if theres an error
        })
        flag = 1;
    }
    //res1.send(parse_Info);
    }
    else{
         res1.send(result);
}
});

app.get('/CATALOG_WEBSERVICE_IP/cacheInfo/:itemNUM', (req, res1) => {
    let data = '';
    let notfound = '';
    let Book = catalog.filter((c => c.id === req.params.itemNUM));
    console.log(Book)
    let result = Book.map(o => ({ tittle: o.tittle, quantity: parseInt(o.quantity), price: parseInt(o.price), topic: o.topic }));
    if (result.length === 0){
        if(flag === 1){
        https.get(`http://192.168.0.15:5000/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {//request to catalog server to check if the book exist an quantity>0
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {// if exist 
            if(data.length === 0){
                notfound = "book not found"
                return res1.status(404);
            }
            else {
                parse_Info = JSON.parse(data);
                const book = {
                    id : req.params.itemNUM,
                    tittle : parse_Info.tittle,
                    price : parse_Info.price,
                    quantity : parse_Info.quantity,
                    topic : parse_Info.topic
    
                }
                catalog.push(book)
                
                const csvWriter = createCsvWriter({
                    path: 'cache.csv',
                    header: [
                        { id: 'id', title: 'id' },
                        { id: 'price', title: 'price' },
                        { id: 'tittle', title: 'tittle' },
                        { id: 'quantity', title: 'quantity' },
                        { id: 'topic', title: 'topic' }
                    ]
                });
                csvWriter
                    .writeRecords(catalog)
                    .then(() => console.log(''));
                res1.send(parse_Info);//returend value 
            }
        });
        })
        .on('error', (error) => {
            console.log(error);//if theres an error
        })
        flag = 0;
    }

    if(flag === 0){
        https.get(`http://192.168.0.14:5000/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {//request to catalog server to check if the book exist an quantity>0
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {// if exist 
            if(data.length === 0){
                notfound = "book not found"
                return res1.status(404);
            }
            else {
                parse_Info = JSON.parse(data);
                const book = {
                    id : req.params.itemNUM,
                    tittle : parse_Info.tittle,
                    price : parse_Info.price,
                    quantity : parse_Info.quantity,
                    topic : parse_Info.topic
    
                }
                catalog.push(book)
                
                const csvWriter = createCsvWriter({
                    path: 'cache.csv',
                    header: [
                        { id: 'id', title: 'id' },
                        { id: 'price', title: 'price' },
                        { id: 'tittle', title: 'tittle' },
                        { id: 'quantity', title: 'quantity' },
                        { id: 'topic', title: 'topic' }
                    ]
                });
                csvWriter
                    .writeRecords(catalog)
                    .then(() => console.log(''));
                res1.send(parse_Info);//returend value 
            }
         
        });
        })
        .on('error', (error) => {
            console.log(error);//if theres an error
        })
        flag = 1;
    }

    }
    else{
         res1.send(result[0]);
}
});
app.get('/CATALOG_WEBSERVICE_IP/put/:itemNUM', (req, res) => {
    console.log("kareem");
    let Book = catalog.filter((c => c.id === req.params.itemNUM));
    if (!Book) res.status(404).send('The Book is not found!');
    else{
        for (var i in catalog) {
            if (catalog[i].id === req.params.itemNUM) {
                if (catalog[i].quantity > 0) {
                    catalog[i].quantity = `${(parseInt(catalog[i].quantity) - 1)}`;
                    const csvWriter = createCsvWriter({
                        path: 'cache.csv',
                        header: [
                            { id: 'id', title: 'id' },
                            { id: 'price', title: 'price' },
                            { id: 'tittle', title: 'tittle' },
                            { id: 'quantity', title: 'quantity' },
                            { id: 'topic', title: 'topic' }
                        ]
                    });
                    csvWriter
                        .writeRecords(catalog)
                        .then(() => console.log(''));
                      let result = Book.map(o => ({ tittle: o.tittle, quantity: parseInt(o.quantity), price: parseInt(o.price) }));
                     res.send(result[0]);
                    }
                }
            }
        }
});

const port = process.env.PORT||5001;
app.listen(port, () => console.log( 'Listeningon port $ { port }...'))