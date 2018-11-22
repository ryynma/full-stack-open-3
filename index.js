/**
 * Full Stack open osan 3 tehtävät
 * Backend, tietokanta ja full stack.
 */

const Person = require('./models/Person')

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// Konfiguroidaan morganille token 'reqData'
morgan.token('reqData', function getReqData (req) {
    const data = JSON.stringify(req.body)
    return data
})

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
// Asetetaan morganin tulostuksen sisältö tokeneilla
app.use(morgan(':method :url :reqData :status :res[content-length] - :response-time ms'))

/**
 * Palauttaa koko puhelinluettelon JSON-muodossa.
 */
app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.json(people.map(Person.format))
        })
        .catch(error => {
            console.log(error)
        })
})

/**
 * Palauttaa tietyn henkilön tiedot JSON-muodossa.
 */
app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
        })
})

/**
 * Palauttaa tiedon luettelon pituudesta.
 */
app.get('/info', (req, res) => {
    Person.estimatedDocumentCount()
        .then(count => {
            const date = new Date().toString()
            res.send(`<p>Puhelinluettelossa on ${count} henkilön tiedot.</p>
            <p>${date}</p>`)
        })
        .catch(error => {
            console.log(error)
        })
})

/**
 * Lisää henkilön luetteloon ja palauttaa lisätyt tiedot.
 */
app.post('/api/persons', (req, res) => {
    const name = req.body.name.trim()
    const number = req.body.number.trim()

    // Tarkistetaan, että nimi ja numero oli annettu.
    if (name === undefined || name.length < 3) {
        return res.status(400).json({ error: 'check name' })
    }
    if (number === undefined || number.length < 6) {
        return res.status(400).json({ error: 'check number' })
    }

    // Tarkistetaan, ettei nimi ole vielä luettelossa.
    const foundPeople = Person.find({ name })

    foundPeople.then(found => {
        if (found.length > 0) {
            return res.status(400).json({ error: 'person is already in database' })
        } else {
            const person = new Person({
                name: name,
                number: number
            })
            person
                .save()
                .then((savedPerson) => {
                    res.json(Person.format(savedPerson))
                })
        }})
        .catch(error => {
            console.log(error)
        })
})

app.put('/api/persons/:id', (req, res) => {
    const number = req.body.number.trim()

    // Tarkistetaan, että numero oli annettu.
    if (number === undefined || number.length < 6) {
        return res.status(400).json({ error: 'check number' })
    }

    Person.findByIdAndUpdate(req.params.id, { number }, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
        })

})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(removedPerson =>
            res.status(200).json(Person.format(removedPerson))
        )
        .catch(error => {
            console.log(error)
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})