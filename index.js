const express = require('express')
const bookRouter = require('./routes')

const app = express()
const port = 3000

app.use(express.json())

app.use('/api', bookRouter)


app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`)
})
