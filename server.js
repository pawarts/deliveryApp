const express = require('express');
const path = require("path");

const mysql = require('mysql2');

// create the connection to database

function connectToDatabase() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'your_user',
        password: 'your_password',
        database: 'your_database'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Помилка підключення до бази даних:', err.message);
        } else {
            console.log('Підключення до бази даних встановлено.');
        }
    });


    return connection
}

let connection = connectToDatabase();

connection.connect((err) => {
    err ? console.log(err) : console.log('I\'m connected to DB')
})



const app = express();

//Listened port
const PORT = 8700;

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

app.get('/', (req, res) => {
    res.redirect('/all')
})

app.post('/reg', (req, res) => {

    let body = req.body

    let login = body.login
    let password = body.password
    let email = body.email
    let status = body.status;

    if(password[0] != password[1] && login != '' && password != '' && email != ''){
        res.redirect('/reg')
    } else {
        let insert = `INSERT INTO ${`baeke9kzc4pm7pbd3bgq.user`} (${`id`}, ${`login`}, ${`password`}, ${`email`}, ${`status`}) VALUES (NULL, '${login}', '${password[0]}', '${email}', '${status}')`

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

    let query = `SELECT  ${`login`}, ${`password`}, ${`email`}, ${`id`}, ${`status`}  FROM ${`baeke9kzc4pm7pbd3bgq.user`} WHERE login =  ? AND password = ?`
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

    const checkFood = `SELECT * FROM food`;

    connection.query(checkFood, (err, res) => {
        if(!err){
            if(res.length == 0){

                const food = [
                    {
                        'foodName': 'Pepperoni',
                        'storeName' : 'Silpo',
                        'image_link': 'https://www.thespruceeats.com/thmb/yy3vu0m1bZKkCIqtcnkc9bwqYBs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Pepperonipizzahoriz-3d53b00a7cce429eae3bfb629df356ec.jpg',
                        'price' : 51
                    },
                    {
                        'foodName': 'Burger',
                        'storeName' : 'KFC',
                        'image_link': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYVFRgWFhUZGRgZGhgYGhocHBwYGBoYGRkZGhwaGBocIS4lHB4rIRgYJjgmKy80NTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJSw0NDQ0NDQ0NjQ2NDQ0NDQ0NDQ0NDQ0NDE0NDQ0NDQ0NjQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIALcBEwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAABAAIDBAUGB//EADoQAAIBAgQEBAQFAwMEAwAAAAECEQADBBIhMQUiQVEGYXGBEzKRoRRCscHRUmLwI3LhBxaC8RUksv/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACkRAAICAgIBAwMEAwAAAAAAAAABAhEDIRIxQQQTUSIykRRhcaGBseH/2gAMAwEAAhEDEQA/APHTQomhTEKhRoUAKhRpUAClRpUACjSo0gABTgtOQVMiUrGQZKOWp2SompWMYRTloGiopgOilTopUANoGngTtrTvhN/SfoakCEiktWmwF0b23H/g38VELTf0t9DRaHQ4bVBcqeoXFCGxgNKaOWllqhDZpU4ihFAhs0KdFCKBDaVGKEUwBSo0KAFSo0qAJDQomhTEClRpUANpU6KUUAClRilFAAoxRijFIAoKspUCCrCipZaA9Qla3eDeHL+J5lULbEzcblSR0U7s3kPtXpXh3gVjC2ycqNdKlXdjnYtGyLEKnpv3rDJnhDT7NYYZS2ujyvCeH8RcClbZCsMys3KCDsR69O9bmD8H5WX4zCTrkVgpA11dj8v0ru7tsKuUlsyEMUOUQTqPlPLEDcGml1Q/EKc78mpDMWMQ0MM0AdfvXHP1kpOlo6oelitvZzuH4Nh1yAWEYlsozl51MLmIIB/SrJ4euco5RFUxKqMo7QANama+wLQhLs2VHYGXfMQCGzSqjQbbU7F2lDZQwBQf62YnRzqFSBrpP71n7s35NvbjHwQXiucFUUwZ0QKCe+5mps2it8BmRZz5eTNpoHaDMTUiXS9vIFyI+5K88DUFcuoO/UVn8XxIyhFiZCweWFWPmy7k7+9EZtsTx6Iil26rMiTZTUicyqN4L7xuaptfUFi8seXIVLZABPYa9BvV/GEWLZR0OdwHXWcykDQj71mPfvi0FuEqhEKJgBdoHYVpF+SHEjucU0UC2iqumgPMJnmnf1qjjbttyWNpQZ01M+42aKtthVQA3EbKyBlIMAz8pnt5VR/Cl5yjUS24gL79dRWsZbIlDRTxmHtkKEEETOh19dTUDcOkSrAjTUggZu01os6qkDVpOYEAjyKnf/1Ve4whYGvUgxPt0NbKcjJwRkXbZUwwg0w1uYi8pAAWY6tqY7HoR2qmvD82YiRGo0lfQ9R61rHIvJlLG10ZpoTUjW2ESCJ2qOKtGTBSpRQpiFSoUqYBpUKVAExoU40KYgUqNKgAUqNKgAUYpUaQCiiBSAogUhjkFdd4M8LNinDurCwA5LD87JHIDuBrqfKK5exbLEKoJZiAANySYAHvXvnh/BHDYa3Y2CIM0fmdudyfLMSPaub1GXhHXbN8OPkyXF4YKqoICIqwIChBAGoG2w+tU2wy5mJ5lUc2sa/sNRvqa1IJUg9YJHcjb9ar3MMCQu4gu8GAI1GaN9ifYd68trk7PRi+Kozr1vMzMfpMgRpv1PnUN7DTcCrzSqgN7wF1q+hDorhSA2sNvrrrRKEuXByiECgTC5Z19ZP2FTx+S7a6MLGIGdUAK5NLjQC87qiCYiCDmqjcvi3eGZA4zTknmIKxmcjz1/mugxOHUK77HV3bUnzY96yMYua4+XVBlCmBroJIPaetF1vwNK9FSxiiju51LZggP5Ax2EdhArIuISxc6s3T9hWnxW38PKqnPcYyV3CrMTI3ocMt3PiSiBiAS2bVQNiW7bj7Vcb8g+PgyMXcLDMYZlyhZ5uUflHbpU2IR3AvXkLIP6myrPYAHTU9qhcIRcuFwWZzyAQSe69h9arYjEO6qjSQs5V6CTP71sjJlnG23NuWuBLRAKLOeIJhSR8vU+9MsYVXw76IrIwgxDsrRBMnUSY2p54cULpd5GC8oMZSwI0JGh0mq/EMVcuKpdQJ+VohjA8vbcdKuL8IloywgZuUb7T0/mnYvCZQGBlTsYj69jUnw4gx+o27VLdsjIrA6yQR17zHbbWtOWyOJn20BIzTHWN6kw6kgqCI3ykTmIOw84namlCDT1kQQdtRVNi4keKtZjkUcphgJkgxrqffQ1ivbI3G+3nW7esnQn80nT/NDUXEcMMrwCAoVh5EhQR6H9q1xz8GGWFqzDNA0SabXQcoqFKlTAVKlFKgCZqFFqVMTFSpUqADQo0qQAo0qVACFOFNAp6qe1IZ1/8A034QcRiw2bKLK/FP90EAL5bn6V7SE/SvGv8Aplixaxq53yI6MmphWaQVB+9e1WlmvN9VuZ3YHUSIpUb2pkRoRB8x2PerL01hXMqOhMqYlAqFgOaQFB0UyQImdN//AHUV4QU0PMSvoYJ1+lXcRazoUM5SRImNQQRr7Cm5kysTunSJbNGkDuQeneq4p9CUq7KOKw8groZiQdQeuo6jyrJfCkPnOrMwJkCCIygRtFbuIDfBkqfi5VKx0aRofLvUF23rvtUyiXCRyuIwZ+Jd0JZJZhEkKI2A6ajas6+xCBgSEuSAQeVoOqn+DXT4zFC2wurq+VkM6hs7Z2mNogRWEvDrrq5Oqh2uC38oBIOq/wAedTHjdLsu5eejnbqAaDSm4ZUk5wflOWP6uk+W9WboDjMNv80qA261TCQy3YuXJhWbKJO5gdN6hcEwZ27yf1rSss4BCswDCDBiRrofqaQwkaVXJIiiO3bD22LEAoFCKNJkmT59Kprbg7Awdj+47VrJhe9FsJOwpc0hqJh3LMkwNTRGHPbqRWx+EPanJZykQNZ6dzvR7oOJk4fCI0gkry6E/wBcifaKqOQVOclVKrOkmV0GnpWrcw+p6ftVbiOW0jFkDZ1yKT0J6+oFaY5cpUZTSUWzk/gCh8IVIWoE16NnnURm2KGQVITTTQA3KKNKlQBdPCzTf/jGroSaGao5srgjCXhRpw4Qa2i9DOKObHwiZI4RT14UK0i4ppelykPhEpDhq08YBBVjPTGei2FIjGFTtTvgr2om5TC9Gw0OKL2r0nwTxh2wzJJm2Yljmkb6Trpt9K8yzV13/T/E2hdazcEG6AqP2Ik5D2B/UCub1OJzxtR78BbXR3J4o5Oi5iIIAEZh1366/apL3GSnzWyddIJGnTcU7G8PZIYMAAANoHtWVds5i2bOZMGJIAXtOw1ivDc8uN8Zdh70kqLV/izMhbIyBeYnQwvQ+ZNZtnxWMxy2GJ/MVgscugaNOn7UuI4lVVVVZhYMn5tToPLXeszGXxh7ysi5AyKSp1PMASDPrvW+LLJuyv1Dao0B43QmHtuO8FW/UimP4tstoVcTIBgEe8HSuX4hgy7MUGo1jrVFLOmU6Hp610rjJXZUc8kdRiOMoVORHY7RAAOveaPBuJM6G3dMOZyhQeZeigCSWG3pTPD11z/psobWMwA1EaTVxMOoYgHnbtpoJJgn9PKs8jUF0L9TPlsoX7MvkW3AAbMTCQF6jeev2rKxN0W4JQsrA5SGABIMdj5Vscb4suQWVMXAGQADmIeAAT1gg1l4+wAihvnGgUSRGpJ8jMU4Sem12DzzauyHDcSU/MhH+0hvsYrQTHo4IFu4T6KBHXXNp9awGtEHtV63Y+IqruBuJjfqe9atoSzyXk0E4igJQrDRprG+2p3pg40AkLZZiGAbXaZkxGwgU/C8BzsAs7b9vft/NbeH8MqqjUiN4J3qo4762DzTfTMNuLsGVfhrqM0ydNTpr6feq68QYuTlVT+Ub67kk119nw3bkNrPeamTw9aH5BVrAxe7P5ORS0XJElfRQw76nU1zviDD6Bs7NDFYIEA9Z1mdK9WfAoq6ACK898Z28jcp5XMsP7l2P0P2rbHh4tNMmUpS7ZxhShlqYigRXVZNEJSgVqUimkUxEcUqdFKgDoCTSM1OEFEKKys1orBKOWrIUVJeIMQIjejkFFHIaPwjVqKQWiwoq/BpGzVuKaRSsdFX4ND4FWitNiiwogFkVJh0h1I3DKR9RRJq3w7ht6+0WUZyOoGgPmdhSbCj1cX3Ng5W1EQTB67waw8TxyHVSkiYL6AnYDl7TQs8VdUa1cWGjKWnYr80/euY4/e5YH5tj5Vw5FGaSZ6np/Q83U130dHetqA4VhKTIGpEkkeYBmqxFvIbjW/iwVB0OZMus5htP7Vznhzj64d2+KrOrkFiCJJ7uTqwG4E7k13jxnORVafmA5ZEbdtK436d4nd3fRxZ/RSxTaOX4wPhXsyyc6q4nfK4kAxVbH2w6JcRTnynPG0zvWlesK7FySYbmJ6ajcnp08qb4r4kuHCpaClmUg9hESIHXWrx29JbOd45J0c9hsVctMGUkQZ9RW74gxDJhs6crhkMjoSwbSRp2PvWLhsSt5CcuVl+aPlIMww7diPMVr3bX4lPhhlGaMwJgZhtB9pqpv648l0yH9yOOxXFXZhcChXEnMvmIOhnea0vD/EWe4UcyGRiJ01XX02zfSqXEOHG1ce2fmHMFmSFO06doqThF0WS7FCzkZVMwFB+bSNzp9+9dk4weNqv4Oh41x0bqui5zcywplZIXOoHMqgnmaCD70OG42wu3Uk6qZjoNqxsQ7XQoYfKWI3/ADR/ApJhT0rGCjHvsn2zusJxaymzrr51P/3FZzBc4k+pH1iK4N8qiWNZmLx4zAJrG5B610wk3qKD2z1H/uOyJXOJHSGn9KifxIhzBSSVEnSPpNeaW8VLBtj1q5ib/PmDDUQYPsapzaY/afwdRd8VZw8LlIGgJkmuF4njHdyXYnUxO3t2qe+QsEMDOsAg6bQY2qpjLbgZmQgHbQ/Wrg3ZLiktlZjTDTC1NLVvRjY800tTSaYTToVkmahUc0qdCs7RVXtQ07UFNImuc6RFqWY0CaDMKAHZqE00vTGegCRqazULl4tE9KjJoAcXpoamlqnwGGa64Qddz2HU0m0lbFZCTXV+GvFuIsAWkRGXoCII85G9RnwqSxKsQkaHc5vPypmH4I1jndjMBQFGhLGDJPlWKzwl0xJxbo1RjS7NcIBzksR013HlVLG8K+KAqXQAswrbiTJhho2vQxVVLuR9DrDcp2IEEaaeevSq93jqLAZWDH+khlEnTfpXLLFkjL6do93B6iCSt01+BlzwzlBLvqNdIH/6qXCYt8POW6xEEc0EgHeCQSPY0MVihEkkDudPbWsLEYpSYDL9RVxc56kjoftz+6SZr2+LshfVSH0Ijp6ipuEYPDXg/wAV2RwCRJUKwGwEiS3lXP2bRdgoIkkRJABnbWuxwHgbEuJJRQf7sx+grRQUXpHJ6iGCK01+Stbwa2muCQsBlgmSzZh8vccuaf5qHH4rkCIpBQ6MCNVy6yB1mTXbcK8GraUi6GuMe+gX/aOlVOJeErUSmcHtMj+axnjalyZxw9hzt/8ADzxLoVy55idGza5p65pmdKd+MXN8un3+9bw8Ntml0bJ5CTSxOEsop/0jI1GYRPqTTU4y7N8kIP7f6OcxONXKcoI9onyBFUsJxNkaT8p/KKlxSs7ZioE7LGgFNtYEkjlIEwTE6V0xjCqoy9ogx2La60kQo2FVctdi3AkKoEtu5DgsQpWUk5hmYxJER2qrxTgirzBGtW1Ek3CJG3Yn/DVqSSpEVFGVwfAPdJC9O9O43bSzyK5d9M3RV/k1FZ4gwlLJZEJAe5lJO+0j5R96s4jgwMrlKuOskmf7u9KUoxacjlyZ91HownuNvO3t+lb3B+IB1yXTr0Y0eH8LRQRcAYnTbQelUMbgfhAFSTzkz0A6aeWlP3YSfFGDmP4nwoqC6CR1A/UVilq6S3YzKQt0ifOufxeHa20NE+XUd60xTT1eyWyEmmzTc1AtXRQDppUzNRpCOuk+dEKT0NTHFL0FNbFeVc1s6qQ0W27U78O3701sS1NfFNG+/wClGw0T4bCZ2VcwGYgT0E07EYMpeNkHMwMaaz6Vf8MYlAHtvYFxrikIZAKkAnQnbvWNhLzo4cNzqd99dqTTvsLXwSOkEg6EaGrXD+HfGLhWUFRIBMFvSmcX4d8FEuu4L3CWKdRPetLhHC2xDImQWUy5i5+Z47es0k1V2D0+jnXuKDHWYirfDcRkuIRoJAP+0nWtXifB7CZ2VmYISGZgNx+Ve5rTseEUu286N8y5l5hJnoe1KTjJUKn5NsXHCZB1Mk+XSq2KV2QWFYa7sRMdevaq+G4mqL8IsVvKQhziQegkjf1Fa2FY5W+KVDoYbKJXXVY9prxp4smN8m+v9Ee00nKyphfDqKc7c7qpVR0bMsiPLWuRXhv+u4dG6lEynkMrpA6dq7u/fLryExoAYjqRH1qlxVuQgDUxLAkMQBGverx+ukpfV5FHNJPZw/EbTgOHgBYKkQQcw+Vuuw67xWM+BCqoYAMZO8EiMwOu2/2rZ8SYgjKikLbYgPG5bQjMT0GvvWXxu4pCBNVC8rdCQBMeQiP8ivWwScopvyaRyOStkow5UMrZi6KTprEGIPcRu2u1GzxK/ZyFbrgGCMrEafX2q7iC9oi+I54UqDmjQSCP9wU6GozwkNh1cT8Vg5VQSZKOQ0DsVP1BqpSiuxylS2a+H8aYwOgt386QCwZVaABrrGYCfOuv4T45tvy4lQmsC4s5Cd+YHVPXUedeU+G2IdmjYAljso16HSd9PI1ovcz8itKa5tANTMAMJj5h9YpyiukKNNWz21rasoZYZWEgjUEdwazcTwhH3UV5x4d8Svg/lYvbzCUOokzOSdiNJP1Br07gfHLGMUm04zD5kOjp6r28xpWTgn2g5Sj0ypY4BY3NtT6iacvBLQMhFHtWrjLioOYgdh1PtXLY/wATqjQsH0PX1qHPFBqPkh5JeWXceyWh0FefeIlbFXUzXB8BSJUSCD59ydgenbu/j3HHuE66fMB/nasE8X+HbJOpdgAB2WCxnpuPrUKWWTuP8JGTmbuKxXw1Fu2AiAAACdv3PnVVcV1rN/E5lDn5fPQ9taSMzxkWZ6nQe3eo9p+RJNk+Iuyf2oKQQAwmJj371ZfBPH5R1jrWHxDFZNtTVwxt6QOEkro1sRbULy7TNc5xllLKRvBkeQOn71YwfEM7BWEE7dqi44gkEeY9R3/zvXRhg4TSkJGVNCaVKu4YKVKKVAHVlvKmOmYRqPSngirXD8G958ltczQTvAAG5JPtXNdbOirKaAgVdcIEHMzMVkgDQHtrvVe8uRihjMpgwZ+9K2eYfl1GvbUa0rvYVWhYRM7TIQgEgsSNQNtOp2qTAYt7T50YDSMpUEfeqz3iXaEhcxgk9Jqwl4iBCwN9NTrvPppQwRdxeKvYlw7qz5BplUZV7TFbWCc3rn4i5eW2EEGyGyNlyxKz0J/SsrFY2++dcOjJYYgwiSZA3LR5Vl4AKj52XPAMBjImNJHUA9KzatW0V06TOt4rjlw5V0cXEYFQk5yCdQ2byrmG4xedSqEogPSQfQNVrD8YW3gjZbKzM7xEmFbUyp6bwRWt4SFlkL5ATaVeZ1GRWaZIjc9YqFFY021/n9inJypIocHwKXnJxLlAE5CzFMzT0J3p/h/iuW9cS6zG25VQRqOUkAkk7a1J4zvZ2RkV8sQXk5GJ+UwdtAdu4rLt4JymfI+UCS2Vssd5japklOLvzoOPg9KfDqozLsBIHaAYjvWLjMSRzaEeWsE9/pWNwzxBctAI0sgiP6gPLuPKugPGLeIRlDLO+UnKxjsDv7V5mT0vG5ULLhi1yj+DnOI4AXFEsOcx6evY1RXgYwoZXuFrrowtj8igic2u5IEDzNa961BkiAdhW3gODW7sBlDdJOsfWt8GSdcU9HK4tbMPhXDgUT4qgsyM1ycphgxOukzqgjSBVp7mTmAVAFyAwBlT+kTsPTetm9w1cMHOUZdCoGgJOg284rmbGJD3Ha8FZljIpgIpkyYOhIhdT3NZTlOc5XdIpRlKLYb/AA+3kN4Is3JDABlR00IfKCNZza9a5x+KpZVkRMk7xLFiJgknXrtXT43i9uOY5yfyrJA9W2PtWZg1w924A65A2gIER2mK3wzlX1p1/JNToxMXgnW7/oqXVspAmYJg7kxE9a3Lth7bWRbRwAEV7iDKxYtLlW3gSduwq1g8MtrEZHg5XAB6QYIP0Iqz4wzpfEEgBFgagDUyR51q8spUvj+wSlLSJPFOOK2GdTmd2AmdQNSZ9hXN8MtM4zNoAYM94mB3q1ibxuJzTmkTOk9j+oqMKeX+3NH/AJAg/rvWOOHGDj5t7KWNyV+RW8JaBaGc5mLFSFK6mSACJXrsaovw22x5gcoJygEyAY0nTsPpWgogRUbJJ3rojKS3ezphgivu2RPh0XRZgaQdsv8AIq1gjHMTMbD/AJqq7zpPvUD4lVGrADzp02Uowj0aPEMXmgbVx3E3zOYO1WMdxItou3es2uvDjcdswyzT+mIFMGRvRuuzGWJJ86BptdBiAihTqFAApUaVAHVn1p1u6VkqxB1EgkGPaovpVmzeRApWyjOJlnLsG1MFkJKyJjaNK52b7Kum8a96DX0Wc3YwBEk9Negp1xndmd2BZiSYAA18ulM+AvYe+tGvIbBhXa42VELGCYHQDUkkwAB3qxgsYUcOFViJ0cSPpUOEa4iuoYAOMpKqAcszE+1WeMcNXC28O6kN8VAW5pZXIz6jpysun80Om6Ev3JX47ib5yByhJgADIDOgVTBM69KxsRbuIxRlZSDBBBB9dYMVZZgw19eo/Stu7x5bq5sSnxnQZbRY5VCk82cCMxMLqZ2otRWkFX5OfwfxEYOo+WdW1EEEGfY1qcK4ffZHCMxSZdVI6iScs66Cuk8MY+yvxVb8OY5spTcROjsRmUHpGk1zWVcS7nS3bLsVZFhFYxJZQQWkLuNdqlvlopLiaPDeMq7qt8MbABXKuRTEQp5QM0aaVavYnFYlSlgubNtQkwocrrAaN9Og7VmXMHYS23/2Ee4CSoQgoVAEaRmDkyI/WlheOPZsZAFU3gzhlcq4A5QH95MedZuF3S6KUq7ZCg7tTmVfKs60pgwRJnXfXvrUlksohmzfajgNSOpbiNlwoAZSoC85zToNc31rSwviC1aIyvJGh0YDXXqK4cP/AJrQLeVYr06TtWRKMWei8V4/YuYZg9wB55QOZicuYGB0mNa4C/xRWHMjAnciDrVVo6VDdZRoWAPaRP0rWOGK72wVxVJlh+JJpyv66VG/FEMaMPqao3CvcVCzCtlij8EubOpwPiCybiPeLcmWdCcwX5SfPb1irXiPxZZxDqUUgLIzEHMfYbCuLzDzpFlpLBBdEJ07Rt3OMIdJ09D+wpDjCDqx9oH3rFZ1HQCofxA8qpYY/BTyM3LvGF6An2/5qu3FWPypPqf2FZTXfI+wpoZv7v0q1iivAPJIu3MXcbSQo8h+5qrkJOu/maYubt96GVvL9apRS6Icm+x5t6dKXwfP7VHkb+o002/M1RJZGFETmqRMGOpEebD9KpBKOWlT+R2iwyIu8frUBuLO32oZaWWmkKx/xx/Sf896VMy0qeg2dIKbccAEnQDvVZ+IptLH0H81VxuLVlyQ4Ez0+461iou9mspa0aKXJ1G0UWY9axreLKiBMDYTH6U445+yj6k0+DDmjVmkRPQVkHGOesewqN8Q/Vj9aODFzR03DLdoufjMyoFJ5fmLaALtpudfKqeKxSZyEUhOmZhP3rEe4zdW+9NyHsfvQse7bBz1SRsvik6sB9zUZxCdWMfQfpWauHbtUn4RydPuf4p8Y/IcmXDj0A5Z+n8mmDHjfJt3NVlwvMULQw3FWLfDxoM+/lG9DjFdiUm+gtxQ9EUfU1GeIudoB8h/NG7hkW5kzFgdmB0PWp1sINh96GorwC5PyU3xbxqx/wA9Ki+M5/MT71qKqdFH0p5MeQO3t2pcl4Q+L+TJyPOzGOuv609MO8yVPvGtazuFTOT1K+hgRp3+b7VSt4sFQSYPYf8AFPk66FSsg/CP2A9/+KkGGO5I7baaVKrKxgdajxrN8QwNug0ER0noT+9CbYmkhv4UdWJpfh0HfvvRDsegFWMOgIYs0EbDuYJ+0fei2OkQG2vagAOgFC1eBbKT1Ak+cdKOJdUfKJI7zv8AxRTC0E00rVY4kSIAUayI6eu5NWPxA6TTaaEnYGSmRUkzQQcwJEidu9IYzLTclC7chuvp09qXxzECY3jpI6x7mqomxFaUUpNCaAFFKjQoAEUqU0qYE9vBt2+4qQYA9TSpVLbL4oemCA60ThF6k0qVTbCkOGGQdKHw03yj6UqVK2OkPgDYUppUqBiNOQmeXQ6x9KVKhCZnC02fMCPv71PjcVFzKg0AAIPUiZ186VKtFvszelovcU4etvKzvzkAwq6HMB10iJisx8UM/KNI1GwHkPtSpUo7Wxy0yZcRO1PvqboVRsgLEnp6dydKVKlHsb6IDiC0rG2hmnJaHYUqVEtAtkyGCCNxtUC4clicx7mlSpRBkJvSSoEROu+n81JZxQykMe4kCD0Gn3o0q1pEWVbTr1FPOVjMUKVJgh3wwOlWcMihtdspb6UqVSUQFxJjbpQF4UaVNggZpoTSpUAS3bZWJ61FFKlQAYpppUqABFKlSoA//9k=',
                        'price' : 15
                    },
                    {
                        'foodName': 'Donut cheeseburger',
                        'storeName' : 'McDonalds',
                        'image_link': 'https://www.thespruceeats.com/thmb/AxLrZ2ppkDzj8-ioweEdMGa39v8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/luther-burger-doughnut-bacon-cheeseburger-4018810-step-12-d4cd29cc6e994883bc9bb87aa57e6cb8.jpg',
                        'price' : 20
                    }
                ]

                food.forEach(item => {
                    let insert = `INSERT INTO \`food\` (\`id\`, \`foodName\`, \`storeName\`, \`image_link\`, \`price\`) VALUES (NULL, '${item.foodName}', '${item.storeName}', '${item.image_link}', '${item.price}')`;
                    connection.query(insert, (err, result) => {
                        if(err){
                            console.log(err)
                        }
                    })
                })

            }
        }
    })

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


if (connection.state === 'disconnected') {
    console.log('Підключення до бази даних закрите. Повторне підключення...');
    connection = connectToDatabase();
}

connection.end()
/*orm sequelize*/