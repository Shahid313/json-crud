var express = require('express')
var path = require('path');
var bp = require('body-parser')
var app = express()
var fs = require('fs')
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
var cors = require('cors')
app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({extended:true}))

app.set("view engine", "hbs");

app.get('/form', (req, res) => {
    res.render('index')
})

app.get('/getData', async (req, res) => {
    await readFileAsync(__dirname+'/'+'db.json', 'utf-8', (err, data) => {
        const myData = JSON.parse(data)
        res.send(myData)
        setTimeout(async () => {
            myData.splice(0, myData.length);
            const emptyArr = JSON.stringify(myData);
            await writeFileAsync('db.json', emptyArr, err => {
            // error checking
            if(err) throw err;
            
            console.log("deleted");
        });
        }, 2000);
            
        

    })
    
})


app.post('/postData', async (req, res) => {
    const ticker = req.body.ticker
    const timeframe = req.body.timeframe
    const status = req.body.status
    const closePrice = req.body.closePrice

    let new_data = {
        "ticker":ticker,
        "timeframe":timeframe,
        "status":status,
        "closePrice":closePrice
    }

    await readFileAsync(__dirname+'/'+'db.json', 'utf-8', (err, data) => {
        var db_data = JSON.parse(data)
        db_data.push(new_data)
        var new_db = JSON.stringify(db_data)

        writeFileAsync('db.json', new_db, err => {
            // error checking
            if(err) throw err;
            
            console.log("New data added");
        });
        res.sendStatus(200)
    })
    
  });


app.listen(5000, () => {
    console.log('Server is running on port 5000')
})