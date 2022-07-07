// Lomake uuden yhteystiedon lisäämiseen
import Notification from './Notification'
import Errornotification from './Errornotification'
const Form = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange, errorMessage, feedbackMessage}) => {
  
    return (
    <div className="form_container">
      <h2 className="pagetitle">Phonebook</h2>
      <p className="form_title">Submit a new contact by entering information below:</p>
      <form onSubmit={addPerson}>
          <div className="name_input">
            
            <input className="form_input" value={newName} onChange={handleNameChange} placeholder="Name"/>
            <span class="focus-border"></span>
            <span class="name_input_send_span"></span>
          </div>
          <div className="number_input">
            <input className="form_input" value={newNumber} onChange={handleNumberChange} placeholder="Phonenumber"/>
            <span class="focus-border"></span>
          </div>
          <div className="submit_button">
            <button className ="form_button" type="submit">add</button>
          </div>
      </form>
      <Errornotification message={errorMessage}></Errornotification>
      <Notification message={feedbackMessage}></Notification>
    </div>
    )
  }
export default Form