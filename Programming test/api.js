"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var fs = require("fs");
var path = require("path");
var uuid_1 = require("uuid"); // Importa la función v4 de uuid para generar un id único
var app = express();
var filePath = path.resolve(__dirname, '../MOCK_DATA.json');
app.use(express.json());
// Challenge 6
app.get('/books', function (req, res, next) {
    var phrase = req.query.phrase;
    // Validar que la frase solo contenga letras del alfabeto
    if (!/^[a-zA-Z]+$/.test(phrase)) {
        next();
    }
    try {
        var booksData = fs.readFileSync(filePath, 'utf-8');
        var books = JSON.parse(booksData);
        // Filtrar los libros cuyo nombre de autor incluya la frase proporcionada
        var matchingBooks = books.filter(function (book) {
            return book.author.toLowerCase().includes(phrase.toLowerCase());
        });
        if (matchingBooks.length === 0) {
            return res.status(404).json({ error: 'No se encontraron libros que coincidan con la frase proporcionada' });
        }
        return res.status(200).json(matchingBooks);
    }
    catch (error) {
        console.error('Error al leer el archivo de libros:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});
//Challenge #5
app.post('/books', function (req, res) {
    var _a = req.body, title = _a.title, author = _a.author, price = _a.price, availability = _a.availability, num_reviews = _a.num_reviews, stars = _a.stars, description = _a.description;
    console.log(title, author, price, availability, num_reviews, stars, description);
    var parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'El precio debe ser un número' });
    }
    // Generar un nuevo id único para el libro
    var id = (0, uuid_1.v4)();
    var newBook = {
        id: id,
        title: title,
        author: author,
        price: parsedPrice,
        availability: availability,
        num_reviews: num_reviews,
        stars: stars,
        description: description
    };
    res.status(201).json(newBook);
});
//Chalenge #4
app.get('/books', function (req, res, next) {
    // Verificar si el precio existe
    var priceParam = req.query.price;
    if (!priceParam) {
        next();
    }
    // Verificar si el precio es un número
    var price = parseFloat(priceParam);
    if (isNaN(price)) {
        return res.status(400).send('El precio debe ser un número');
    }
    try {
        var booksData = fs.readFileSync(filePath, 'utf-8');
        var books = JSON.parse(booksData);
        console.log('Todos los libros:', books);
        var expensiveBooks = books.filter(function (book) {
            // Convertir el precio a número y verificar si es mayor que el precio proporcionado
            console.log('Precio del libro:', book.price);
            var bookPrice = parseFloat(book.price);
            console.log('Precio del libro (convertido):', bookPrice);
            return !isNaN(bookPrice) && bookPrice > price;
        });
        console.log('Libros caros:', expensiveBooks);
        if (expensiveBooks.length === 0) {
            return res.status(404).send('No se encontraron libros con precio mayor al proporcionado');
        }
        res.status(200).contentType('application/json').json(expensiveBooks);
    }
    catch (error) {
        console.error('Error al leer el archivo de libros:', error);
        res.status(500).send('Error interno del servidor');
    }
});
//Chalenge #3
app.get('/books/:id', function (req, res) {
    try {
        var booksData = fs.readFileSync(filePath, 'utf-8');
        var books = JSON.parse(booksData);
        // Obtener el ID del libro desde los parámetros de la solicitud
        var bookId_1 = req.params.id;
        // Buscar el libro por su ID
        var book = books.find(function (book) { return book.id === bookId_1; });
        if (book) {
            // Si se encuentra el libro, enviarlo como respuesta
            res.status(200).contentType('application/json').json(book);
        }
        else {
            // Si no se encuentra el libro, enviar un código de estado 400
            res.status(400).send('Libro no encontrado');
        }
    }
    catch (error) {
        // Si hay algún error al leer el archivo, enviar una respuesta de error
        console.error('Error al leer el archivo de libros:', error);
        res.status(500).send('Error interno del servidor');
    }
});
// // Challenge #2
app.get('/books', function (req_, res) {
    try {
        // Leer el archivo JSON que contiene la lista de libros
        var booksData = fs.readFileSync(filePath, 'utf-8');
        var books = JSON.parse(booksData);
        // Enviar la lista de libros como respuesta
        res.status(200).contentType('application/json').json(books);
    }
    catch (error) {
        // Si hay algún error al leer el archivo, enviar una respuesta de error
        console.error('Error al leer el archivo de libros:', error);
        res.status(500).send('Error interno del servidor');
    }
});
// Challenge #1
app.get('/hello', function (req, res) {
    res.status(200).contentType('text/plain').send('Hello, wolrd!!');
});
var port = 3000;
app.listen(port, function () {
    console.log("Servidor en ejecuci\u00F3n en el puerto ".concat(port));
});
