// Grabs express, mysql, database, and my api via require method
const express = require("express");
const mysql = require("mysql2");
const api = require("index.js")
const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', api);

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});