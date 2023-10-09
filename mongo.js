const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} 

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.czlxalm.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
},
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length < 5) {
    console.log('phonebook:')
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const newName = process.argv[3]
    const newPhone = process.argv[4]

    const contact = new Contact({
        name: newName,
        number: newPhone,
    })

    contact.save().then(result => {
        console.log(`added ${newName} number ${newPhone} to phonebook`)
        mongoose.connection.close()
    }).catch(error => {
        console.log(error.name)
        mongoose.connection.close()
    })
}



// const contact = new Note({
//   content: 'HTML is Easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })