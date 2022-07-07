// Komponentti yhden yhteystiedon esittämiseen ja poistamiseen
const Number = ({content, confirmDel, rowRef}) => {
    return(
      <div className="contact_row" ref={rowRef}> 
        <p className="contact_name">{content.name}</p> <p className="contact_number">{content.number}</p> <button value={content.id} onClick={confirmDel}>delete</button>
        <span className="contact-border"></span>
      </div>  
    
    )
  }
export default Number