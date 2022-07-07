import { useState, useEffect, useRef } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import Form from './components/Form'
import Number from './components/Number'
import './App.css'
import { gsap } from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger"


const App = () => {
  
  // Sovellukseen tallennetut yhteystiedot
  const [persons, setPersons] = useState([])

  // Hakuehdon mukainen filtteri
  const [newFilter, setNewFilter] = useState('')

  // Hakuehdon perusteella filtteröidyt yhteystiedot
  const [personsToShow, setPersonsToShow] = useState(persons)

  // Uuden yhteystiedon nimi ja puhelinnumero
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  // Käyttäjälle esitettävä viesti
  const [errorMessage, setErrorMessage] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState(null)

  // gsap viitteet
  const rowRef = useRef();
  gsap.registerPlugin(ScrollTrigger);

  // varmistaa, että sivun uudelleenlatauksessa selauskohtaan linkitetyt
  // animaatiot toimivat taas oikein
  window.onbeforeunload = () => {
    window.scrollTo(0,0);
  }

  useEffect(() => {
    console.log('effect')
    personService.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
      
  }, [])

  console.log('render', persons.length, 'persons')

  // Animaatiot
  useEffect(() => {
    let mediaQuery = window.matchMedia("(min-width: 800px)")
    if (mediaQuery.matches) {
      gsap.to(".page_header", {
        y: 200,
        opacity:0,
        duration: 1.5,
        scrollTrigger: {
          trigger: ".form_container",
          start: "100% center",
          end: "100% 80px",
          scrub: true
        }
      })
      gsap.to(".display_container", {
        x: 205,
        opacity: 1,
        width: "370px",
        duration: 1,
        scrollTrigger: {
          trigger: ".form_container",
          start: "100% center",
          end: "100% 80px",
          scrub: true
        }
      })
      gsap.from(".form_container", {
        x: 200,
        duration: 1,
        scrollTrigger: {
          trigger: ".form_container",
          start: "80% center",
          end: "100% 80px",
          scrub: true
        }
      })
    }
    
    
  }, [])

  // Vaihtaa näytettävien henkilöiden/kontaktien tilan. Näyttää 6 ensimmäistä.
  const handlePersonsToShowChange = (personstofilter) => {      
      let hmoten = personstofilter.length -6
      if (hmoten < 0){hmoten = 0}
      let slicedArray = personstofilter.slice(0, personstofilter.length-hmoten);
      setPersonsToShow(slicedArray)
      
      
  }

  // Vaihtaa uuden yhteystiedon nimen tilan nimikentän syötteen muuttuessa
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  // Vaihtaa uuden yhteystiedon numeron tilan numerokentän syötteen muuttuessa
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  // Päivittää filtterin hakukentän sisällön muuttuessa
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
    console.log('new filter: ',newFilter)
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    console.log('Filtered persons: ', filteredPersons)
    handlePersonsToShowChange(filteredPersons)
    console.log('personstoshow: ', personsToShow)

  }
  
  // Lisää uuden henkilön/kontaktin puhelinluetteloon
  const addPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber,
    }
    // Jos nimi- tai numerokenttä on tyhjä annetaan virheilmoitus
    if (newName == '' && newNumber == '') {
      console.log('Tyhjä kenttä, lisää nimi ',persons)
      setErrorMessage(`Please enter a name and a number.`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
      return
    }

    if (newName.length < 4) {
      setErrorMessage(`The name must be at least 4 characters long`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
      return
    }
    console.log("newnumber length: ", newNumber.length)
    if (newNumber.length < 10) {
      setErrorMessage(`Please enter a phonenumber with a valid length of 10 characters`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
      return
    }
    
    // Tarkistetaan, onko saman niminen henkilö jo tallennettu
    if (persons.some(({name}) => name === newName)) {
      // Mikäli nimi on sama, mutta numero eri, kysytään päivitetäänkö henkilön numerotieto
      if (persons.some(({number}) => number !== newNumber)){
        const person = persons.filter(person => person.name === newName)
        const id = person[0].id
        // kysytään päivitetäänkö henkilön numerotieto
        if (window.confirm(`${person[0].name} has already been added to phonebook, replace the old number with a new one?`)){
          console.log('person : ', person)
          console.log('person id: ', id)
          personService.update(id, newPersonObject)
          setPersons(persons.map(person => (person.id === id ? {...person, number: newNumber} : person)))
          setFeedbackMessage(`The phone number of: ${newPersonObject.name} has been changed`)
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
            setFeedbackMessage(null)
          }, 5000)
          console.log(newName, 'Number has been changed')
          return
        }
        return
      }
      window.alert(`${newName} is already added to phonebook`)
      return
    }
    
    // Lähetetään uusi yhteystieto backendin tietokantaan/rakenteeseen ja 
    // päivitetään sovelluksen yhteystietojen tila.  
    personService.create(newPersonObject).then(response => {
        setPersons(persons.concat(response.data))
        console.log('lähetetty palvelimelle: ',response.data)
        
        setFeedbackMessage(`Contact: ${newPersonObject.name} has been added to phonebook`)
        setTimeout(() => {
          setFeedbackMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
    
    console.log(persons)
  }

  // Poistetaan yhteystieto backendin tietokannasta/rakenteesta ja päivitetään sovelluksen
  // yhteystietojen tila
  const confirmDel = (event) => {
    let personToDelete = persons.filter(person => person.id.toString().includes(event.target.value))[0]
    if (window.confirm(`Do you really want to delete person: ${personToDelete.name}`)) {
      personService.del(event.target.value)
      /// includes- metodi aiheuttaa jossain tapauksissa filtteröintivirheen.
      /// palauttaa true, jos esim "638543".includes("85"), jolloin selaimen tilasta katoavat kaikki
      /// yhteystiedot joiden id sisältää "85". Metodia voidaan kuitenkin käyttää jos id:t ovat
      /// aina saman pituisia. Muutetaan siis kovakoodattujen esimerkkiyhteystietojen id:t backend sovelluksessa.
      setPersons(persons.filter(person => !person.id.toString().includes(personToDelete.id)))
      handlePersonsToShowChange(personsToShow.filter(person => !person.id.toString().includes(personToDelete.id)))
      setFeedbackMessage(`${personToDelete.name} has been deleted from the phonebook`)
        setTimeout(() => {
          setFeedbackMessage(null)
        }, 5000)
       
         
    }
  }

  return (
    <div className="container">
      
      <div className="app_container">  
        <div className='page_header'>
          <h2>Scroll Down</h2>
        </div>
          <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} errorMessage={errorMessage} feedbackMessage={feedbackMessage}/>
        <div className="display_container">
          <div className='contacttitle'>
            <h2>Saved contacts</h2>
            <span class="hover-border"></span>
          </div>
          <Filter newfilter={newFilter} filterchange={handleFilterChange}/>
          <div className="contactlist">
            {personsToShow.map(person => <Number key={person.name} rowRef={rowRef} content={person} confirmDel={confirmDel}/>)}
          </div>
        </div>
        
      </div>
    </div>
  )

}

export default App
