
const PersonForm = ({
  inputName,
  inputNumber,
  formSubmitHandler,
  nameInputChangeHandler,
  numberInputChangeHandler,
}) => {
  return (
    <form onSubmit={formSubmitHandler}>
      <div>
        name: <input value={inputName} onChange={nameInputChangeHandler} />
      </div>
      <div>
        number:{" "}
        <input value={inputNumber} onChange={numberInputChangeHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm