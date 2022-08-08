const fs = require('fs');
const https =require('http'); 
const { parse } = require('csv-parse');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var Book_Sold = []
var parser_Order = parse({ columns: true }, function(err, Order) {
    Book_Sold = Order;
});

fs.createReadStream('order.csv').pipe(parser_Order);

const express = require('express');
const { text, response } = require('express');
const e = require('express');

const app = express();
app.post('/CATALOG_WEBSERVICE_IP/buy/:itemNUM', (req, res) => {
   // let Book = catalog.filter((c => c.id === req.params.itemNUM));
   // if (!Book) res.status(404).send('The Book is not found!');
   let data = '';
   let parse;
https.get(`http://localhost:5000/CATALOG_WEBSERVICE_IP/put/${req.params.itemNUM}`, (res) => {
res.on('data', (chunk) => {
    data += chunk;
    console.log(chunk);
});
res.on('end', () => {
    console.log(data);
 parse = JSON.parse(data);
 const book = {
    id : Book_Sold.length,
    tittle : parse.tittle,
    price: parse.price
 } 
 Book_Sold.push(book);  
 const csvWriterOrder = createCsvWriter({
    path: 'order.csv',
    header: [
        { id: 'id', title: 'id' },
        { id: 'tittle', title: 'tittle' },
        { id: 'price', title: 'price' }
    ]
});
csvWriterOrder
    .writeRecords(Book_Sold)
    .then(() => console.log(``));

});
})

.on('error', (error) => {
    console.log(error);
});

https.get(`http://192.168.0.14:5000/CATALOG_WEBSERVICE_IP/put/${req.params.itemNUM}`, (res) => {

})
return res.send(Book_Sold);
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(` Listeningon port $ { port }...`))
