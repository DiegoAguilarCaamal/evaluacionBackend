const express = require('express');
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Importa la función v4 de uuid para generar un id único

const app = express();
const filePath = path.resolve(__dirname, '../MOCK_DATA.json');
app.use(express.json());

// Challenge 6

app.get('/books', (req: Request, res: Response, next: NextFunction) => {
    const phrase: string = req.query.phrase as string;

    // Validar que la frase solo contenga letras del alfabeto
    if (!/^[a-zA-Z]+$/.test(phrase)) {
        next();
    }

    try {
        const booksData = fs.readFileSync(filePath, 'utf-8');
        const books = JSON.parse(booksData);

        // Filtrar los libros cuyo nombre de autor incluya la frase proporcionada
        const matchingBooks = books.filter((book: any) =>
            book.author.toLowerCase().includes(phrase.toLowerCase())
        );

        if (matchingBooks.length === 0) {
            return res.status(404).json({ error: 'No se encontraron libros que coincidan con la frase proporcionada' });
        }

        return res.status(200).json(matchingBooks);
    } catch (error) {
        console.error('Error al leer el archivo de libros:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Challenge #5
app.post('/books', (req: Request, res: Response) => {

    const { title, author, price, availability, num_reviews, stars, description } = req.body;

    console.log(title, author, price, availability, num_reviews, stars, description);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'El precio debe ser un número' });
    }

    // Generar un nuevo id único para el libro
    const id = uuidv4();

    const newBook = {
        id,
        title,
        author,
        price: parsedPrice,
        availability,
        num_reviews,
        stars,
        description
    };

    res.status(201).json(newBook);
});

//Chalenge #4

app.get('/books', (req: Request, res: Response, next: NextFunction) => {
    // Verificar si el precio existe
    const priceParam = req.query.price;

    if (!priceParam) {
        next();
    }

    // Verificar si el precio es un número
    const price = parseFloat(priceParam as string);
    if (isNaN(price)) {
        return res.status(400).send('El precio debe ser un número');
    }

    try {
        const booksData = fs.readFileSync(filePath, 'utf-8');
        const books = JSON.parse(booksData);

        console.log('Todos los libros:', books);

        const expensiveBooks = books.filter((book: any) => {
            // Convertir el precio a número y verificar si es mayor que el precio proporcionado
            console.log('Precio del libro:', book.price);
            const bookPrice = parseFloat(book.price);
            console.log('Precio del libro (convertido):', bookPrice);
            return !isNaN(bookPrice) && bookPrice > price;
        });

        console.log('Libros caros:', expensiveBooks);

        if (expensiveBooks.length === 0) {
            return res.status(404).send('No se encontraron libros con precio mayor al proporcionado');
        }

        res.status(200).contentType('application/json').json(expensiveBooks);
    } catch (error) {
        console.error('Error al leer el archivo de libros:', error);
        res.status(500).send('Error interno del servidor');
    }
});


//Chalenge #3
app.get('/books/:id', (req: Request, res: Response) => {
    try {
        const booksData = fs.readFileSync(filePath, 'utf-8');
        const books = JSON.parse(booksData);

        // Obtener el ID del libro desde los parámetros de la solicitud
        const bookId = req.params.id;

        // Buscar el libro por su ID
        const book = books.find((book: any) => book.id === bookId);

        if (book) {
            // Si se encuentra el libro, enviarlo como respuesta
            res.status(200).contentType('application/json').json(book);
        } else {
            // Si no se encuentra el libro, enviar un código de estado 400
            res.status(400).send('Libro no encontrado');
        }
    } catch (error) {
        // Si hay algún error al leer el archivo, enviar una respuesta de error
        console.error('Error al leer el archivo de libros:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// // Challenge #2
app.get('/books', (req_: Request, res: Response) => {
    try {
        // Leer el archivo JSON que contiene la lista de libros
        const booksData = fs.readFileSync(filePath, 'utf-8');
        const books = JSON.parse(booksData);

        // Enviar la lista de libros como respuesta
        res.status(200).contentType('application/json').json(books);
    } catch (error) {
        // Si hay algún error al leer el archivo, enviar una respuesta de error
        console.error('Error al leer el archivo de libros:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Challenge #1
app.get('/hello', (req: Request, res: Response) => {
    res.status(200).contentType('text/plain').send('Hello, wolrd!!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor en ejecución en el puerto ${port}`);
});
