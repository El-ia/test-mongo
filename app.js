import express from 'express'
import { dbconnect } from './config/db.js';
const app = express()
const port = 3000

await dbconnect();
app. get ('/', (req, res) => {res. send( 'Hello World!')})

app. listen(port, () => {
console.log (`Example app listening on port ${port}`)
})