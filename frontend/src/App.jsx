import { useState, useEffect } from "react"
import Filter from "./components/filter"
import PersonForm from "./components/personForm"
import Persons from "./components/persons"
import Notification from "./components/notification"
import phoneService from "./services/phonebook"

const App = () => {
  const [persons, setPersons] = useState([])
  // form input state
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  // search filter state
  const [searchString, setSearchString] = useState("")
  // status notification state
  const [statusMessage, setStatusMessage] = useState({
    message: null,
    isError: false,
  })

  /* Effects are run after every completed render, second
  parameter is used to specify which state updates should
  trigger the effect, an empty array specifies that the 
  effect should only run once after 1st render. 
  
  The principle is that the effect is always executed after the 
  first render of the component and when the value of the second 
  parameter changes.*/
  useEffect(() => {
    phoneService.getAll().then((response) => {
      console.log(response.data)
      setPersons(response.data)
    })
  }, [])

  // form submit handler
  const addContact = (event) => {
    event.preventDefault()
    console.log(event)

    /* Checking if name was previously added, note Array
    includes method checks objects by reference and not
    by their keys and values */
    const foundContact = persons.find((p) => p["name"] === newName)
    if (foundContact) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedContact = { ...foundContact, number: newNumber }
        phoneService
          .update(foundContact["id"], updatedContact)
          .then((response) => {
            setStatusMessage({
              message: `Updated number for ${newName}`,
              isError: false,
            })
            phoneService.getAll().then((response) => setPersons(response.data))
          })
          .catch((err) =>
            setStatusMessage({ message: err.response.data.error, isError: true })
          )
          .finally(() => {
            setTimeout(
              () =>
                setStatusMessage((oldStatus) => {
                  return { ...oldStatus, message: null }
                }),
              5000
            )
            setNewName("")
            setNewNumber("")
          })
      }
    } else {
      // create new contact, backend assigns id for each record created
      phoneService
        .create({ name: newName, number: newNumber })
        .then((response) => {
          console.log(response.data)
          setStatusMessage({ message: `Added ${newName}`, isError: false })
          setPersons((oldPersons) => oldPersons.concat(response.data))
        })
        .catch((err) =>
          setStatusMessage({ message: err.response.data.error, isError: true })
        )
        .finally(() => {
          setTimeout(
            () =>
              setStatusMessage((oldStatus) => {
                return { ...oldStatus, message: null }
              }),
            5000
          )
          setNewName("")
          setNewNumber("")
        })
    }
  }

  // form input event handler to sync changes to component state
  const nameInputChangeHandler = (event) => {
    // console.log(event.target)
    setNewName(event.target.value)
  }

  const numberInputChangeHandler = (event) => {
    // console.log(event.target)
    setNewNumber(event.target.value)
  }

  const filterInputChangeHandler = (event) => {
    // console.log(event.target)
    setSearchString(event.target.value)
  }

  // utility function to filter persons matching search string
  const filterPersons = (searchString) => {
    return persons.filter((person) =>
      person["name"].toLowerCase().includes(searchString.toLowerCase())
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messageObj={statusMessage} />
      <Filter
        inputValue={searchString}
        filterInputChangeHandler={filterInputChangeHandler}
      />
      <h3>Add a new contact</h3>
      <PersonForm
        inputName={newName}
        inputNumber={newNumber}
        formSubmitHandler={addContact}
        nameInputChangeHandler={nameInputChangeHandler}
        numberInputChangeHandler={numberInputChangeHandler}
      />
      <h3>Numbers</h3>
      {searchString === "" ? (
        <Persons persons={persons} setter={setPersons} />
      ) : (
        <Persons persons={filterPersons(searchString)} setter={setPersons} />
      )}
    </div>
  )
}

export default App
