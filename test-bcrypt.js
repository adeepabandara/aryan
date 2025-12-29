const bcrypt = require('bcryptjs')

const storedHash = "$2b$10$6Kg2sXWfokdvwXgseiRHxesM9K8W468iYXjaLoHt.bsPDIqso6YWC"
const password = "admin123"

bcrypt.compare(password, storedHash).then(result => {
  console.log('Password match:', result)
}).catch(err => {
  console.error('Error:', err)
})
