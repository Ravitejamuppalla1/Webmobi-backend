const express = require("express")
const cors = require("cors")
const sequelizeDB = require("./config/Database")
const route = require("./config/Route")
const app = express()
const port = 3040
app.use(cors())
app.use(express.json())
app.use(route);
app.listen(port, (req, res) => {
  console.log(`welcome to port ${port}`)
})

sequelizeDB.sync()
    .then(() => {
        console.log('Database synchronized.')
    })
    .catch((error) => {
        console.error('Unable to synchronize the database:', error)
    });