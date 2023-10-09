/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Contact = require('./models/contact')

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
  
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		let errors = Object.values(error.errors).map(el => el.message)
		let fields = Object.values(error.errors).map(el => el.path)

		if (errors.length > 1) {
			const formattedErrors = errors.join('\n')
			return response.status(400).json({ messages: formattedErrors,
				fields: fields })
		} else {
			return response.status(400).json({ messages: errors,
				fields: fields })
		}
	}
  
	next(error)
}

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


morgan.token('content', function(request, response) {
	return JSON.stringify(request.body)
})

app.get('/info', (request, response) => {
	const count = Contact.find({}).estimatedDocumentCount()
    
	const date = new Date()

	response.send(`<p>Phone book has information for ${count} people</p>
                        <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
	Contact.find({}).then(contacts => {
		response.json(contacts)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Contact.findById(request.params.id).then(contact => {
		if (contact) {
			response.json(contact)
		} else {
			response.status(404).end()
		}
	}).catch(error => next(error))
    
	// const pid = Number(request.params.id)
	// const person = data.find(p => p.id === pid)

	// if (person) {
	//     response.json(person)
	// } else {
	//     response.status(400).end()
	// }
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	const contact = new Contact({
		name: body.name,
		number: body.number
	})

	// if (data.find(person => person.name == contact.name)) {
	//     return response.status(400).json({
	//         error: `${contact.name} already exists in phonebook`
	//     })
	// }

	contact.save().then(savedContact => {
		response.json(savedContact)
	}).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
	const { name, number } = request.body

	Contact.findByIdAndUpdate(request.params.id, 
		{ name, number }, 
		{ runValidators: true, context: 'query' }).then(contact => {
		response.json(contact)
	})
})

app.delete('/api/persons/:id', (request, response, next) => {
	Contact.findByIdAndRemove(request.params.id).then(() => {
		response.status(204).end()
	}).catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})