//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var cors = require("cors");
var corsOptions = { origin: "*", optionSucessStatus: 200 };


var app = express();
app.use(cors(corsOptions));

var utils = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
app.get("/otraCosa/:id/:algo", (req, res, next) => {
    console.log("id", req.params.id)
    console.log("algo", req.params.algo)
    utils.query("select * from Devices where id=" + req.params.id, (err, rsp, fields) => {
        if (err == null) {

            console.log("rsp", rsp);
            res.status(200).send(JSON.stringify(rsp));
        } else {
            console.log("err", err);
            res.status(409).send(err);
        }

        //console.log(fields);
    });

});

app.delete("/devices/:id", (req, res, next) => {
    console.log("se pide eliminar dispositivo", req.params.id)
    utils.query("DELETE FROM Devices WHERE id=" + req.params.id, (err, rsp, fields) => {
        if (err == null) {
            console.log("rsp", rsp);
            res.status(200).send(JSON.stringify(rsp));
        } else {
            console.log("err", err);
            res.status(409).send(err);
        }
    });
});

app.put("/device", (req, res, next) => {
    console.log("Llego el update", "UPDATE Devices SET value = " + req.body.value + " WHERE id = " + req.body.id);
    utils.query("UPDATE Devices SET value = " + req.body.value + " WHERE id = " + req.body.id, (err, rsp, fields) => {
        if (req.body.name == "") {
            res.status(409).send("no tengo nada que hacer");
        } else {
            res.status(200).send("se guardo el dispositivo");
        }

    });
});

app.get("/devices/", (req, res, next) => {
    console.log("request: ", req)
    console.log("response: ", res)
    utils.query("select * from Devices", (err, rsp, fields) => {
        if (err == null) {
            console.log("rsp: ", rsp);
            res.status(200).send(JSON.stringify(rsp));
        } else {
            console.log("err: ", err);
            res.status(409).send(err);
        }

    });

});


app.listen(PORT, function (req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
