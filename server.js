const express = require('express');
const path = require("path");
const store = require("store2");
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delivery_app'
});

connection.connect((err) => {
    err ? console.log(err) : console.log('I\'m connected to DB')
})

const app = express();

//Listened port
const PORT = 8700

//Function create path
const createPath = (page) => path.resolve(__dirname, 'ejs-modules', `${page}.ejs`)

//Server launcher
app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`I'm listen port: ${PORT}`)
})

//Middleware components
app.use('/styles', express.static(__dirname + '/styles'))
app.use('/images', express.static(__dirname + '/images'))
app.use('/scripts', express.static(__dirname + '/scripts'))

app.use(express.urlencoded({extended: false}));


let login, email, status, id, cartID;

app.post('/reg', (req, res) => {

    let body = req.body

    let login = body.login
    let password = body.password
    let email = body.email
    let status = body.status;

    if(password[0] != password[1] && login != '' && password != '' && email != ''){
        res.redirect('/reg')
    } else {
        let insert = `INSERT INTO ${`delivery_app.user`} (${`id`}, ${`login`}, ${`password`}, ${`email`}, ${`status`}) VALUES (NULL, '${login}', '${password[0]}', '${email}', '${status}')`

        connection.query(insert, (error) => {
            if(!error){
                res.redirect('/log')
            } else {
                console.log(error)
            }
        })
    }
})
app.get('/reg', (req, res) => {
    res.render(createPath('reg'))
})

//Login page
app.get('/log', (req, res) => {
    res.render(createPath('login'))
})

app.post('/log',(req, res) => {

    const {name, password} = req.body

    let query = `SELECT  ${`login`}, ${`password`}, ${`email`}, ${`id`}, ${`status`}  FROM ${`delivery_app.user`} WHERE login =  ? AND password = ?`
    connection.query(query, [name, password], (err, result, field) =>{
        if(Array.isArray(result) && result.length > 0){
            login = name;
            email = result[0].email;
            status = result[0].status;
            id = result[0].id;
            res.redirect('/all')
        } else {
            console.log(err)
            res.redirect("/log")
        }

        res.end()
    })


})

app.get('/:store', (req, res) => {
    let location = '/';

    if(req.headers.referer === 'http://localhost:8700/log' || login !== undefined){
        let store = req.params.store;
        let storeBackToAll = false;

        if(store !== 'all'){
            storeBackToAll = true
        }

        let query = store === 'all' ? `SELECT * from food` : `SELECT * FROM food WHERE storeName = '${store}'`

        if(status === 'courier'){
            query = `SELECT * FROM orders`
        }

        connection.query(query, (err, result, fields) => {
            if(!err){

                let store_array = [];

                result.forEach(element => {
                    if(!store_array.includes(element.storeName)){
                        store_array.push(element.storeName)
                    }
                })

                let querySelect = status === 'courier' ? `SELECT * FROM cart` : `SELECT cart.id FROM cart INNER JOIN user ON cart.userID = user.id WHERE user.id = ${id}`;

                connection.query(querySelect, (err, elements ) => {
                    if(!err){
                        let food_id_array = [];
                        res.render(createPath('index'), { location, result, elements, store_array, food_id_array, login, storeBackToAll, status});
                    }
                })

            } else {console.log(err)}
        })
    }
    else{res.redirect('/log');
    }

})

app.post('/deliver', (req, res) => {
})


app.get('/cart/food', (req, res) => {
    console.log(login + ' ' + email)
    let location = 'cart'
    let selectQuery = `SELECT ${`cart.id`}, ${`cart.foodID`}, ${`cart.userID`}, ${`cart.foodName`}, ${`cart.storeName`}, ${`cart.price`}, ${`cart.number`}, ${`cart.food_image`} FROM cart INNER JOIN user ON cart.userID = user.id  WHERE user.id = ${id}`
    connection.query(selectQuery, (err, results) => {

        let sum = 0;

        if(results != undefined){
            results.forEach(item => {
                let itemFullPrice = item.number * item.price;

                sum += itemFullPrice
            })
        } else{
            results = [];
        }
        res.render(createPath('cart'), {location, results, login, email, sum})
    })
})

app.post('/cart', async (req, res) => {
    let body = req.body;

    let selectQuery = `SELECT * FROM \`cart\``

    connection.query(selectQuery, (err, result) => {
        if(!err){

            let query = `INSERT INTO \`cart\` (\`id\`, \`foodID\`, \`userID\`, \`foodName\`, \`storeName\`, \`price\`, \`food_image\`, \`number\`) VALUES (NULL, '${body.id}', '${id}',\'${body.foodName}\', \'${body.storeName}\', \'${body.price}\', \'${body.image}\', \'${1}\')`;


            for(let i = 0; i < result.length; i++){
                let item = result[i];


                if(item.foodID == body.id){
                    query = `UPDATE \`cart\` SET \`number\` = '${item.number++}' WHERE \`cart\`.\`id\` = ${item.id};`
                } else {
                    query = `INSERT INTO \`cart\` (\`id\`, \`foodID\`, \`userID\`, \`foodName\`, \`storeName\`, \`price\`, \`food_image\`, \`number\`) VALUES (NULL, '${body.id}', '${id}',\'${body.foodName}\', \'${body.storeName}\', \'${body.price}\', \'${body.image}\', \'${1}\')`
                }
            }
            connection.query(query, (err, result, fields) => {
                if(err){
                    console.log(err)
                } else{
                    cartID = result.insertId;
                    res.redirect('/all');
                }
            })

            cartID = result.insertId;

        }
    })
})

app.post('/deliver_form', async(req, res) => {
    let body = req.body;

    let name = body.name;
    let contact = body.phone;
    let price = body.price;
    let address = body.address;

    console.log(cartID)

    let query = `INSERT INTO \`orders\` (\`id\`, \`cartID\`, \`userName\`, \`address\`, \`price\`, \`contact\`) VALUES (NULL, '${cartID}', '${name}', '${address}', '${price * 0.1}', '${contact}')`

    connection.query(query, (error, result) => {
        if(error){
            console.log(error)
        } else {
            const delete_query = `DELETE FROM cart WHERE userID = '${id}'`

            connection.query(delete_query, (err, res) => {
                if(err){
                    console.log(err);
                }
            })
        }
    })

    res.redirect(req.headers.referer)
})

app.get('/add_food/:id/:number', (req,res) => {
    let id = req.params.id;
    let number = req.params.number;

    number++

    const query = `UPDATE \`cart\` SET \`number\` = '${number}' WHERE \`cart\`.\`id\` = ${id}`;

    connection.query(query, (error, result) => {
        if(error){
            console.error(error);
        } else{
            console.log(result);
            res.redirect('/cart/food')
        }
    })
})

app.get('/delete_food/:id/:number', (req,res) => {
    let cartID = req.params.id;
    let number = req.params.number;

    console.log(cartID + ' ' + number)

    number--

    let query = `UPDATE \`cart\` SET \`number\` = '${number}' WHERE \`cart\`.\`id\` = ${cartID}`;

    if(number === 0){
        query = `DELETE FROM cart WHERE id = '${cartID}'`;
        console.error("It's not work")
    }

    connection.query(query, (error, result) => {
        if(error){
            console.error(error);
        } else{
            console.log(result);
            res.redirect('/cart/food')
        }
    })
})
/*orm sequelize*/