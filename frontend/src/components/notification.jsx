const Notification = ({ messageObj }) => {
  const { message, isError } = { ...messageObj }
  const style = isError ? "error" : "success"
  if (message) {
    return (
      <div className={style}>
        {message}
      </div>
    )
  }
  return null
}

export default Notification