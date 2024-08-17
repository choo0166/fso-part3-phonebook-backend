const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv")
const app = express()
const middleware = require("./utils/middleware")

// dotenv init env
dotenv.config()
const PORT = process.env.PORT || 3001
const Contact = require("./models/contact")


// morgan logging token for request body
morgan.token("content-body", (request, response) => {
  return JSON.stringify(request.body)
})

/* middlewares
Middleware are functions that can be used for handling request and response objects e.g.
const myLogger = function (req, res, next) {
  console.log('LOGGED') // prints `LOGGED` for every request to App
  next() // yields control to the next middleware 
} 

middlewares are called in the order of `use` statements
Note: these will be called before the route event handlers. To
call middleware on specific routes, specify them in the event 
handler */

// allow serving of static assets from express
app.use(express.static("dist")) 
// use express json-parser for accessing json payloads in request body
app.use(express.json()) 
// morgan logger middleware
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content-body"
  )
)

// define route event handlers
app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts)
  })
})

app.get("/info", (request, response) => {
  const timestamp = new Date()
  Contact.countDocuments({}).then((count) => {
    response.send(`
      <p>Phonebook has info for ${count} people<br></br>
      ${timestamp.toString()}
      `)
  })
})

/* route for fetching a single resource by id. This handles all 
GET requests of the form /api/persons/SOMETHING */
app.get("/api/persons/:id", (request, response, next) => {
  // access id in query parameters
  const id = request.params.id
  Contact.findById(id)
    .then((contact) => {
      console.log(contact)
      response.json(contact)
    })
    // execution continues to error handler middleware
    .catch((error) => next(error)) 
})

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  const payload = request.body

  Contact.findByIdAndUpdate(id, payload, { new: true })
    .then((updatedContact) => {
      // return formatted object from transformed toJSON method
      response.json(updatedContact)
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const payload = request.body

  if (!payload.name) {
    return response.status(400).json({
      error: "missing name in request body",
    })
  }

  if (!payload.number) {
    return response.status(400).json({
      error: "missing number in request body",
    })
  }

  const newContact = new Contact({
    name: payload.name,
    number: payload.number,
  })

  newContact
    .save()
    .then((savedContact) => {
      // return formatted object from transformed toJSON method
      response.json(savedContact)
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Contact.findByIdAndDelete(id)
    .then((result) => {
      console.log(result)
      response.status(204).end()
    })
    .catch((error) => next(error))
})

/* Execution continues to this middleware when no 
event handlers are registered for a specified route */
app.use(middleware.unknownEndpoint)

// error handler middleware must be loaded last
app.use(middleware.errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
