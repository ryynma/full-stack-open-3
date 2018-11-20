const mongoose = require('mongoose')

// Otetaan käyttöön dotenv-lisäosan avulla .env-tiedoston ympäristömuuttujat
// mutta vain kehitysmoodissa. (Herokussa on omat ympäristömuuttujat.)
if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

// Staattinen apumetodi henkilötietojen muotoilemiseksi.
Person.format = (function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
})

module.exports = Person