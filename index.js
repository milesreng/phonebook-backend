const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :content`))

morgan.token('content', function(request, response) {
    return JSON.stringify(request.body)
})

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/info', (request, response) => {
    const count = data.length
    const date = new Date()

    response.send(`<p>Phone book has information for ${count} people</p>
                        <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
    const pid = Number(request.params.id)
    const person = data.find(p => p.id === pid)

    if (person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

const generateID = () => {
    return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'contact name or phone number missing'
        })
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: generateID(),
    }

    if (data.find(person => person.name == contact.name)) {
        return response.status(400).json({
            error: `${contact.name} already exists in phonebook`
        })
    }

    data = data.concat(contact)
    response.json(contact)
})

app.delete('/api/persons/:id', (request, response) => {
    const pid = Number(request.params.id)

    data = data.filter(person => person.id !== pid)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})