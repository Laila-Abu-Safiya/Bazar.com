const fs = require('fs');
const { parse } = require('csv-parse');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var catalog = []
var parser = parse({ columns: true }, function(err, Catalog) {
    catalog = Catalog;
});

fs.createReadStream('catalog.csv').pipe(parser);

const express = require('express');
const { text } = require('express');
const e = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('Hello world!!!');
});
app.get('/CATALOG_WEBSERVICE_IP', (req, res) => {
    let result = catalog.map(o => ({ id: parseInt(o.id), price: parseInt(o.price), tittle: o.tittle, quantity: parseInt(o.quantity), topic: o.topic }));
    return res.send(result);
});
app.get('/CATALOG_WEBSERVICE_IP/find/:itemName', (req, res) => {
    console.log("order name")
    let Book = catalog.filter((c => c.topic === req.params.itemName));

    if (!Book) return res.status(404).send('The Books is not found!');
    else {
        let result = Book.map(o => ({
            id: parseInt(o.id),
            price: parseInt(o.price),
            tittle: o.tittle,
            quantity: parseInt(o.quantity),
            topic: o.topic
        }));
        return res.send(result);
    }
});

app.get('/CATALOG_WEBSERVICE_IP/getInfo/:itemNUM', (req, res) => {
    console.log("order")
    let Book = catalog.filter((c => c.id === req.params.itemNUM));
    if (!Book) return res.status(404).send('The Book is not found!');
    let result = Book.map(o => ({ id: parseInt(o.id), tittle: o.tittle, quantity: parseInt(o.quantity), price: parseInt(o.price), topic: (o.topic), }));
    return res.send(result[0]);
});
app.get('/CATALOG_WEBSERVICE_IP/put/:itemNUM', (req, res) => {
    console.log("kareem");
    let Book = catalog.filter((c => c.id === req.params.itemNUM));
    if (!Book) return res.status(404).send('The Book is not found!');
    else{
        for (var i in catalog) {
            if (catalog[i].id === req.params.itemNUM) {
                if (catalog[i].quantity > 0) {
                    catalog[i].quantity = `${(parseInt(catalog[i].quantity) - 1)}`;
                    const csvWriter = createCsvWriter({
                        path: 'catalog.csv',
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
                     return res.send(result[0]);
                    }
                }
            }
        }
});

const port = process.env.PORT||5000;
app.listen(port, () => console.log( `Listeningon port ${ port }...`))
