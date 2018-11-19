/**
 * Full Stack open osan 3 tehtävät
 * Backend.
 */

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// Konfiguroidaan morganille token 'reqData'
morgan.token('reqData', function getReqData (req) {
    data = JSON.stringify(req.body)
    return data
})

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
// Asetetaan morganin tulostuksen sisältö tokeneilla
app.use(morgan(':method :url :reqData :status :res[content-length] - :response-time ms'))

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
      }
    ]

/**
 * Palauttaa koko puhelinluettelon JSON-muodossa.
 */
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

/**
 * Palauttaa tietyn henkilön tiedot JSON-muodossa.
 */
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

/**
 * Palauttaa tiedon luettelon pituudesta.
 */
app.get('/info', (req, res) => {
    const lkm = persons.length
    const date = new Date().toString()
    res.send(`<p>Puhelinluettelossa on ${lkm} henkilön tiedot.</p>
    <p>${date}</p>`)
})

/**
 * Lisää henkilön luetteloon ja palauttaa lisätyt tiedot.
 */
app.post('/api/persons', (req, res) => {
    const body = req.body
    const name = body.name.trim()
    const number = body.number.trim()

    // Tarkistetaan, että nimi ja numero oli annettu.
    if (name === undefined || name.length < 3) {
        return res.status(400).json({ error: 'check name' })
    }
    if (number === undefined || number.length < 6) {
        return res.status(400).json({ error: 'check number' })
    }

    // Tarkistetaan, ettei nimi ole vielä luettelossa.
    const foundPerson = persons.find(p => p.name.toLowerCase() === name.toLowerCase())
    if (foundPerson) {
        return res.status(400).end()
    }

    // Luodaan lisättävä olio.
    const person = {
        name: name,
        number: number,
        id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)
})

const generateId = () => {
    return Math.floor(Math.random() * 5000000)
}

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const removedPerson = persons.find(p => p.id === id)

    // Jos poistettavaa henkilöä ei löytynyt palvelimen datasta
    if (!removedPerson) {
        return res.status(400).end()
    }

    persons = persons.filter(p => p.id !== id)
    res.status(200).json(removedPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})