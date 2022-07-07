import axios from 'axios'
const baseUrl = '/api/persons'

// Palauttaa kaikki backendiin tallennetut yhteystiedot
const getAll = () => {
    return axios.get(baseUrl)
}

// Lähettää uuden yhteystiedon backendin tietokantaan/rakenteeseen 
const create = (newObject) => {
    return axios.post(baseUrl, newObject)
}

// Päivittää olemassaolevan yhteystiedon
const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)

}

// Poistaa yhteystiedon backend tietokannasta/rakenteesta
const del = (id) => {
    axios.delete(`${baseUrl}/${id}`)
    console.log(`poistettu nimi id: ${id}`)
    
}

export default {
    getAll, create, update, del 
}