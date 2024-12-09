const express = require('express')
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express()
app.use(bodyParser.json());                        

app.get('/', (req, res) => {res.send('HEY! Wow! Luke was here.......')})

// Get all stairpaths
app.get('/stairpaths', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stairpaths');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get a single stairpath by ID
app.get('/stairpaths/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM stairpaths WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Stairpath not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Create a new stairpath
app.post('/stairpaths', async (req, res) => {
    const { name, start_latitude, start_longitude, end_latitude, end_longitude } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO stairpaths (name, start_latitude, start_longitude, end_latitude, end_longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, start_latitude, start_longitude, end_latitude, end_longitude]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update a stairpath
app.put('/stairpaths/:id', async (req, res) => {
    const { id } = req.params;
    const { name, start_latitude, start_longitude, end_latitude, end_longitude } = req.body;
    try {
        const result = await pool.query(
            'UPDATE stairpaths SET name = $1, start_latitude = $2, start_longitude = $3, end_latitude = $4, end_longitude = $5 WHERE id = $6 RETURNING *',
            [name, start_latitude, start_longitude, end_latitude, end_longitude, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Stairpath not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Delete a stairpath
app.delete('/stairpaths/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM stairpaths WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Stairpath not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'))
