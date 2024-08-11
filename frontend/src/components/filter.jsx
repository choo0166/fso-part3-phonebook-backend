
const Filter = ({ inputValue, filterInputChangeHandler }) => {
  return (
    <form>
      <div>
        filter shown with:{" "}
        <input value={inputValue} onChange={filterInputChangeHandler} />
      </div>
    </form>
  )
}

export default Filter