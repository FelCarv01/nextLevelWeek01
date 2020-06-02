import express from 'express'

const app = express();
app.get('/users', (req, res)=> {
    res.json([
        'Felipe',
        'Jurandi',
        'Dr. Abobinha'
    ])
});




app.listen(3333);