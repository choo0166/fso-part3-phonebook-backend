const express = require("express")
const cors = require('cors') 
const morgan = require("morgan")
const dotenv = require("dotenv")
const app = express()

// dotenv init env
dotenv.config()
const PORT = process.env.PORT || 3001

let phonebook = [
  // {
  //   id: "1",
  //   name: "Arto Hellas",
  //   number: "040-123456",
  // },
  // {
  //   id: "2",
  //   name: "Ada Lovelace",
  //   number: "39-44-5323523",
  // },
  // {
  //   id: "3",
  //   name: "Dan Abramov",
  //   number: "12-43-234345",
  // },
  // {
  //   id: "4",
  //   name: "Mary Poppendieck",
  //   number: "39-23-6423122",
  // },
]

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
app.use(cors())
app.use(express.json()) // use express json-parser for accessing json payloads in request body
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content-body"
  )
)

// define route event handlers
app.get("/api/persons", (request, response) => {
  response.json(phonebook)
})

app.get("/info", (request, response) => {
  const timestamp = new Date()
  response.send(`
    <p>Phonebook has info for ${phonebook.length} people<br></br>
    ${timestamp.toString()}
    `)
})

/* route for fetching a single resource by id. This handles all 
GET requests of the form /api/persons/SOMETHING */
app.get("/api/persons/:id", (request, response) => {
  // access id in query parameters
  const id = request.params.id
  const result = phonebook.find((e) => e.id === id)
  if (result) {
    response.json(result)
  } else {
    response.status(404).end()
  }
})

app.post("/api/persons", (request, response) => {
  try {
    const payload = request.body
    if (!payload.name) {
      response.status(400).json({
        error: "missing name in request body",
      })
    } else if (!payload.number) {
      response.status(400).json({
        error: "missing number in request body",
      })
    } else if (phonebook.find((e) => e.name === payload.name)) {
      response.status(400).json({
        error: "name must be unique",
      })
    } else {
      const newContact = {
        ...payload,
        id: Math.floor(Math.random() * 1000).toString(),
      }
      phonebook = phonebook.concat(newContact)
      response.json(newContact)
    }
  } catch (error) {
    response.status(400).json({
      error: JSON.stringify(error),
    })
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter((e) => e.id !== id)
  response.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
