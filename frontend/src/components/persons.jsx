import phoneService from "../services/phonebook"

const PersonLine = ({ pid, name, number, setPersons }) => {
  const deleteHandler = (id) => {
    if (window.confirm(`Delete ${name} ?`)) {
      phoneService
        .remove(id)
        .then((res) => {
          console.log(`Deleted person ${name} with id ${id}`)
          setPersons((oldPersons) => oldPersons.filter((e) => e["id"] != id))
        })
        .catch((err) => console.log(err))
    }
  }
  return (
    <tr>
      <td>{name}</td>
      <td>{number}</td>
      <td>
        <button onClick={() => deleteHandler(pid)}>delete</button>
      </td>
    </tr>
  )
}

const Persons = ({ persons, setter }) => {
  return (
    <div>
      <table>
        <tbody>
          {persons.map((person) => {
            return (
              <PersonLine
                key={person["id"]}
                pid={person["id"]}
                name={person["name"]}
                number={person["number"]}
                setPersons={setter}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Persons
