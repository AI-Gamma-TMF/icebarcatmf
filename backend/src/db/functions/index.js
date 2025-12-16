const fs = require('fs')
const path = require('path')

const sqlDirectory = __dirname

const functions = {}

fs.readdirSync(sqlDirectory).forEach(file => {
  if (file.endsWith('.sql')) {
    const queryName = path.basename(file, '.sql').toLowerCase()?.replace(/(_\w)/g, (match) => match[1].toUpperCase())
    const queryContent = fs.readFileSync(path.join(sqlDirectory, file), 'utf8')
    functions[queryName] = queryContent
  }
})

module.exports = functions
