const fs = require('fs');
const { parse } = require('csv-parse');
const https = require('http');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var catalog = []
var flag1 = 1;
var ord = 1;
var f = 1;
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
    let count = '';
    let count1 = 0;
    https.get(`http://192.168.0.15:5000/CATALOG_WEBSERVICE_IP/${req.params.ItemName}`, (res2) => {//request to catalog server to check if the book exist an quantity>0
    res2.on('data', (chunk) => {
        notfound += chunk;
        count = notfound;
        console.log(notfound)
        
    });
    res2.on('end', () => {// if exist 
         count = notfound;
         for(var i in catalog){
            if(catalog[i].topic === req.params.ItemName){
                count1++;
            }
        }

        let Book = catalog.filter((c => c.topic === req.params.ItemName));
        let result = Book.map(o => ({ id: o.id, tittle: o.tittle, quantity: parseInt(o.quantity), price: parseInt(o.price), topic: o.topic }));
        if ((result.length === 0) || (count != count1.toString())){
            if(flag1 === 1){
            https.get(`http://192.168.0.15:5000/CATALOG_WEBSERVICE_IP/find/${req.params.ItemName}`, (res) => {//request to catalog server to check if the book exist an quantity>0
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {// if exist 
                if(data === "0"){
                    flag1 = 0;
                    return res1.status(404).send("0");
                }
                else {
                    
                    parse_Info = JSON.parse(data);
                    flag1 = 0;
                    console.log(flag1);
                    for(let i=0; i<parse_Info.length;i++){
                    const book = {
                        id : parse_Info[i].id,
                        price : parse_Info[i].price,
                        tittle : parse_Info[i].tittle,
                        quantity : parse_Info[i].quantity,
                        topic : parse_Info[i].topic
                    }
                    
                    for(var j in catalog){
                    if(catalog[j].id.toString() === book.id.toString() ){
                    catalog.splice(j, 1)
                    
                    break;
                    }
                }
                catalog.push(book)
                   console.log(book)
                
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
                }
                      return res1.send(parse_Info);//returend value 
                      
    
                }
            });
            })
            .on('error', (error) => {
                console.log(error);//if theres an error
            })
            
        }
    
        if(flag1 === 0){
            https.get(`http://192.168.0.14:5000/CATALOG_WEBSERVICE_IP/find/${req.params.ItemName}`, (res2) => {//request to catalog server to check if the book exist an quantity>0
            res2.on('data', (chunk) => {
                data += chunk;
            });
            res2.on('end', () => {// if exist 
                if(data === "0"){
                    flag1=1;
                    return res1.status(404).send("0");
                }
                else {
                    parse_Info = JSON.parse(data.toString());
                    flag1 = 1;
                    for(let i=0; i<parse_Info.length;i++){
                        const book = {
                            id : parse_Info[i].id,
                            price : parse_Info[i].price,
                            tittle : parse_Info[i].tittle,
                            quantity : parse_Info[i].quantity,
                            topic : parse_Info[i].topic
            
                        }
                        for(var j in catalog){
                            if(catalog[j].id.toString() === book.id.toString() ){
                            catalog.splice(j, 1)
                            
                            break;
                            }
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
                }
                     return res1.send(parse_Info);//returend value 
                    
    
                }
                 
            });
            })
            .on('error', (error) => {
                console.log(error);//if theres an error
            })
            
        }
        }
        else{
             res1.send(result);
    }

    });

});

});

app.get('/CATALOG_WEBSERVICE_IP/getInfo/:itemNUM', (req, res1) => {
    let data = '';
    let notfound = '';
    
    let Book = catalog.filter((c => c.id === req.params.itemNUM));
    //console.log(Book)
    let result = Book.map(o => ({ tittle: o.tittle, quantity: parseInt(o.quantity), price: parseInt(o.price), topic: o.topic }));
    if (result.length === 0){

        if(f === 1){
            
        https.get(`http://192.168.0.15:5000/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {//request to catalog server to check if the book exist an quantity>0
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {// if exist 
            if(data.toString() === "0"){
                f=0;
                return res1.status(404).send("0");
                
            }
            else {
                parse_Info = (data.toString());
                f = 0;
                const book = {
                    id : req.params.itemNUM,
                    tittle : parse_Info.tittle,
                    price : parse_Info.price,
                    quantity : parse_Info.quantity,
                    topic : parse_Info.topic
    
                }
                catalog.push(book)
                console.log(book)
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
        
    }

    if(f === 0){
        https.get(`http://192.168.0.14:5000/CATALOG_WEBSERVICE_IP/getInfo/${req.params.itemNUM}`, (res) => {//request to catalog server to check if the book exist an quantity>0
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {// if exist
            if(data === "0"){
                f=1;
                return res1.status(404).send("0");
            }
            else {
                parse_Info = JSON.parse(data.toString());
                f = 1;
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
                    
                return res1.send(parse_Info);//returend value 
            }
         
        });
        })
        .on('error', (error) => {
            console.log(error);//if theres an error
        })
        
    }

    }
    else{
         res1.send(result[0]);
}
});

app.get('/CATALOG_WEBSERVICE_IP/put/:itemNUM', (req, res1) => {
    let data = '';
    if(ord === 1){
 https.get(`http://192.168.0.14:5001/CATALOG_WEBSERVICE_IP/buy/${req.params.itemNUM}`, (res) => {//send the request to order server
 res.on('data', (chunk) => {
     data += chunk;
 });
 res.on('end', () => {

    parse_Pruchase = data;
    
    if(!parse_Pruchase === "0") res1.status(404).send("0"); //if it's null, that's mean book not available
    else {
    let Book = catalog.filter((c => c.id === req.params.itemNUM));
    if (!Book) return res1.status(404).send('The Book is not found!');
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
                     return res1.send(result[0]);
                    }
                }
            }
            ord = 0;
            return res1.send("Bought successfuly!");
        }//if exist return bought list
        }
       
   
 });
 })

 .on('error', (error) => {
    console.log(error);
});

}
if(ord === 0){
 https.get(`http://192.168.0.15:5001/CATALOG_WEBSERVICE_IP/buy/${req.params.itemNUM}`, (res) => {//send the request to order server
 res.on('data', (chunk) => {
     data += chunk;
 });
 res.on('end', () => {

    parse_Pruchase = data;
    if(!parse_Pruchase) res1.status(404).send('The Book is not found!'); //if it's null, that's mean book not available
    else {
    let Book = catalog.filter((c => c.id === req.params.itemNUM));
    if (!Book) res1.status(404).send('The Book is not found!');
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
                     res1.send(result[0]);
                    }
                }
            }
            ord = 1;
            res1.send("Bought successfuly!");}//if exist return bought list
        }
        
   
 });
 })

 .on('error', (error) => {
     console.log(error);
 });

}
});

const port = process.env.PORT||5001;
app.listen(port, () => console.log( 'Listeningon catalog port $ { port }...'))
