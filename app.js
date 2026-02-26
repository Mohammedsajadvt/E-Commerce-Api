const express = require('express');
const app = express();



app.use(express.json());
//app.use('/api/users',re);

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

module.exports = app;
