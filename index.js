const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const port = 3001

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
        return res.status(400).json({ error: 'name must be unique' })
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
    console.log(`Poistetaan henkilö ${id}`)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.listen(port)

console.log('palvelin käynnistyi')