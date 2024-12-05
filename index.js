const express = require('express')
const app = express()

app.get('/', (req, res) => {res.send('HEY! Wow! Luke was here.......')})

app.get('/api/stairpaths', (req, res) => {
	res.send('Stairpaths!')
})

app.listen(3000, () => console.log('Server running on port 3000'))
