const mongoose = require('mongoose')
const validator = require('validator')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.log('error connecting to MongoDB:', error.message)
})

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name must be at least 3 characters long.'],
        required: [true, 'Enter a name.']
    },
    number: {
        type: String,
        minLength: [8, 'Phone number must be of length 8 or longer.'],
        required: true,
        validate: {
            validator: function (el) {
                return /^\d{2,3}-\d+$/.test(el)
            }, message: 'Phone number is formatted incorrectly.'
        }
    },
  })
  
  contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
  })

  module.exports = mongoose.model('Contact', contactSchema)