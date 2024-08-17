const mongoose = require('mongoose')

// allow fields not specified in schema to be saved
mongoose.set('strictQuery',false)

const connStr = process.env.MONGODB_URI
console.log("Connecting to DB...")

mongoose.connect(connStr)
.then(res => console.log("Connected to MongoDB"))
.catch(err => {
  console.log("error connecting to MongoDB: ", err.message)
})

// define schema for the document to be stored
const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

/* define model i.e. constructor function to create new objects 
based on provided schema. Will inherit methods to query/update
objects within the collection which will be named as the plural, 
lowercase version of the provided model name */
const Contact = mongoose.model('Contact', contactSchema)

// format objects returned by mongoose on models using the schema
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // transform surrogate key to string
    delete returnedObject._id
    delete returnedObject.__v // remove mongo versioning field
  }
})

module.exports = Contact

