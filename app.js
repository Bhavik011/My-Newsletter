import express from 'express';
import request from 'request';
import {
    fileURLToPath
} from "url";
import path from 'path'
import https from 'https'

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "/signup.html"))
})

app.post('/', function (req, res) {
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const email = req.body.Email;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: FirstName,
                LNAME: LastName
            }
        }]
    }
    const jsonData = JSON.stringify(data);
    const list_id = 'd85fff00ba';
    const url = `https://us9.api.mailchimp.com/3.0/lists/${list_id}`

    const options = {
        method: "POST",
        auth: "bhavik:a6f4c33a95c12c4db2a3f434e9b068d4-us9"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode != 200) {
            res.sendFile(path.join(__dirname, "/failure.html"))
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            const info = JSON.parse(data);
            if (info.error_count > 0) {
                res.sendFile(path.join(__dirname, "/failure.html"))

            } else {
                res.sendFile(path.join(__dirname, "/success.html"))
            }

        })
    })
    request.write(jsonData);
    request.end();

})

app.post("/failure", function (req, res) {
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is Running on Port 3000")
})
//Api Key
//a6f4c33a95c12c4db2a3f434e9b068d4-us9

//list id
//d85fff00ba