// Komponentti erilaisten viestien näyttämiseen käyttäjälle
const Notification = ({message}) => {
    if (message === null) {return null}

    return(
        <div className="notification">
            {message}
        </div>
    )
}

export default Notification