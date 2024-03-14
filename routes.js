const express = require('express')
const router = express.Router()
const multer = require('multer')
const { v4: uuid } = require('uuid')

const app = express()
const port = 3000


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	},
	filename: (req, file, cb) => {
		const extension = file.originalname.split('.').pop()
		const filename = `${uuid()}.${extension}`
		cb(null, filename)
	},
})

const upload = multer({ storage })


const books = {
	myBooks: [],
}


class Book {
	constructor(
		authors = '',
		title = '',
		description = '',
		fileCover = '',
		id = uuid(),
		fileBook = ''
	) {
		this.authors = authors
		this.title = title
		this.description = description
		this.fileCover = fileCover
		this.id = id
		this.fileBook = fileBook
	}
}

// создание книги
router.post('/books', upload.single('fileCover'), (req, res) => {
	const { authors, title, description } = req.body
	const newBook = new Book(authors, title, description)
	books.myBooks.push(newBook)
	res.send(newBook)
})

// получение одной книги по id
router.get('/books/:id', (req, res) => {
	const { id } = req.params
	const book = books.myBooks.find(b => b.id === id)
	if (book) {
		res.send(book)
	} else {
		res.status(404).send('Книга не найдена')
	}
})

// редактирование книги
router.put('/books/:id', upload.single('fileCover'), (req, res) => {
	const { id } = req.params
	const { authors, title, description } = req.body
	const bookIndex = books.myBooks.findIndex(b => b.id === id)
	if (bookIndex !== -1) {
		books.myBooks[bookIndex].authors = authors
		books.myBooks[bookIndex].title = title
		books.myBooks[bookIndex].description = description
		res.send(books.myBooks[bookIndex])
	} else {
		res.status(404).send('Книга не найдена')
	}
})

// получение всех книг
router.get('/books', (req, res) => {
	res.send(books)
})

// удаление книги по id
router.delete('/books/:id', (req, res) => {
	const { id } = req.params
	const bookIndex = books.myBooks.findIndex(b => b.id === id)
	if (bookIndex !== -1) {
		const deletedBook = books.myBooks.splice(bookIndex, 1)
		res.send(deletedBook[0])
	} else {
		res.status(404).send('Книга не найдена')
	}
})

// скачивание картинки выбранной книги
router.get('/books/:id/cover', (req, res) => {
	const { id } = req.params
	const book = books.myBooks.find(b => b.id === id)
	if (book) {
		res.sendFile(book.fileCover)
	} else {
		res.status(404).send('Книга не найдена')
	}
})

module.exports = router

