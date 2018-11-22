const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}
const url = process.env.MONGODB_URI

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

// Otetaan talteen käynnistyksen komentoriviparametrit
const argv = process.argv.slice(2)

// Jos oli annettu parametreja, talletetaan uusi dokumentti tietokantaan.
if (argv.length >= 2) {
    const name = argv[0]
    const number = argv[1]
    const person = new Person({
        name,
        number
    })

    console.log(`Lisätään henkilö ${name} numero ${number} luetteloon`)

    mongoose.connect(url, { useNewUrlParser: true })
    person
        .save()
        .then(() => {
            mongoose.connection.close()
        })

// Muuten tulostetaan vain kokoelman sisältö.
} else {
    mongoose.connect(url, { useNewUrlParser: true })
    Person
        .find({})
        .then(result => {
            console.log('Puhelinluettelo:')
            result.forEach(person =>
                console.log(`${person.name} ${person.number}`)
            )
            mongoose.connection.close()
        })
}