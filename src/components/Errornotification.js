const Errornotification = ({message}) => {
    if (message === null) {return null}

    return(
        <div className="errornotification">
            {message}
        </div>
    )
}

export default Errornotification