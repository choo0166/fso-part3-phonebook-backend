const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }

  if (error.name === "ValidationError") {
    // handle mongoose validator exception
    return response.status(400).json({ error: error.message })
  }

  // execution continues to default Express error handler
  next(error) 
}

// middleware chain terminates here
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  errorHandler,
  unknownEndpoint
}