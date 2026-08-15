import express from 'express'
import cors from 'cors'
import { db } from './db'

const app = express()
const PORT = process.env.PORT || 3001

// Allow the frontend to send requests to this backend.
app.use(cors())

// Allow Express to read JSON request bodies.
app.use(express.json())

// Simple endpoint to verify that the backend is running.
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Simulation backend is running',
  })
})

// Check that the backend can communicate with MySQL.
app.get('/api/test-db', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS result')

    res.json({
      status: 'ok',
      database: rows,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: 'error',
      message: 'Could not connect to MySQL',
    })
  }
})

// Save a telemetry snapshot to MySQL.
app.post('/api/telemetry', async (req, res) => {
  try {
    const {
      timestamp,
      x,
      y,
      z,
      velocity,
      acceleration,
      angle,
    } = req.body

    const query = `
      INSERT INTO telemetry
      (timestamp, x, y, z, velocity, acceleration, angle)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    await db.execute(query, [
      timestamp,
      x,
      y,
      z,
      velocity,
      acceleration,
      angle,
    ])

    res.json({
      status: 'ok',
      message: 'Telemetry saved successfully',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: 'error',
      message: 'Could not save telemetry',
    })
  }
})

// Start the Express server.
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})