var express = require('express');
const {execSync} = require("child_process");
const {analyze} = require("../lib/gvision")
var router = express.Router();
const {generateForm} = require("../lib/form");
const {FormPit37} = require("../lib/form-pit-37");
const fs = require('fs');
const csv = require('csv-parser');
var stringSimilarity = require('string-similarity');




/* GET home page. */


router.get('/analyze/:file', async function (req, res, next) {
    const file = req.params.file.replace(/\.json$/, '');
    if (/[/]/.test(file)) {
        throw new Error('invalid file');
    }

    const path = "public/data/" + file;
    const reportPath = path + "-data.json";

    if (!fs.existsSync(path)) {
        throw new Error(`${path} does not exist`);
    }

    if (!fs.existsSync(file)) {
        const result = await analyze(path);
        const command = "/usr/bin/python3 lib/boxes.py " + path;

        execSync(command);
    }

    res.render('index', {title: 'Express', file: file});
});

router.get('/formData/:file', async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');

    const file = req.params.file.replace(/\.json$/, '');
    if (/[/]/.test(file)) {
        throw new Error('invalid file');
    }

    const path = "public/data/" + file;
    const reportPath = path + "-data.json";

    if (!fs.existsSync(path)) {
        throw new Error(`${path} does not exist`);
    }

    if (!fs.existsSync(file)) {
        const result = await analyze(path);
        const command = "/usr/bin/python3 lib/boxes.py " + path;

        execSync(command);
    }

    const checkboxesPath = path + "-checkboxes.json";
    if (!fs.existsSync(checkboxesPath)) {
        const command = "/usr/bin/python3 lib/checkboxes.py " + path;
        execSync(command);
    }

    const form = generateForm(path);

    const formDriver = new FormPit37(form);

    form.checkboxes = JSON.parse(fs.readFileSync(checkboxesPath).toString('utf8'));



    res.send({
        form: form,
        formData: formDriver.getData(),
        formDriver: formDriver,
    });
});


router.get('/api/:type/:column/:query', async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    const type = req.params.type
    const column = req.params.column
    const query = req.params.query
    const resp = [];

    await new Promise((resolve, reject) => {
        if (-1 !== ["crpkep", "opp", "pit11poltax", "us"]) {
            const path = "./apidata/" + type + ".csv";
            if (!fs.existsSync(path)) {
                throw new Error(`${path} does not exist`);
            }

            fs.createReadStream(path)
                .pipe(csv())
                .on('data', (row) => {
                    if (undefined !== row[column]
                        && "" + row[column] === query) {
                        resp.push(row);
                    }
                    resolve();
                })
                .on('end', () => {
                    resolve();
                });


        }
    });


    res.send(resp);
});

router.get('/api/uslist', async function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');




    const data = JSON.parse(fs.readFileSync("./apidata/us.json"));



    const prep = str => str.trim().toLowerCase().replace(/\s/g,"_")
        // .replace("urząd skarbowy",'')
        // .replace(/\swe?\s/,' ')
    ;
    let winner = null;
    let propositions = [];
    if (undefined !== req.query["value"]) {
        const query = prep(req.query["value"]);
        if (0 < query.trim().length) {

            // const short = str => str.replace(/^(.*)urząd skarbowy(\sw)?\s/,'');
            let winnerSim = null;
            for(const row of data) {
                let similarity = stringSimilarity.compareTwoStrings(query, prep(row.t));
                if (similarity > 0.5 && (similarity > winnerSim || null === winnerSim)) {
                    winner = row;
                    winnerSim = similarity;
                    row.smilarity = similarity;
                    propositions.push(winner);
                }

            }
        }
    }

    res.send({
        data: data,
        proposition: winner,
        propositions: propositions
    })

    // res.sendFile("./apidata/us.json");
});


router.post('/export', async function (req, res, next) {

    const form = JSON.parse(req.body.form);
    let template = fs.readFileSync("./apidata/pit37template.xml").toString("utf8");
    ;

    const driver = new FormPit37();

    const getValue = id => {
        id = parseInt(id);
        if (15 === id) {
            return "PL";
        }

        if (undefined !== form[id]) {
            let result = form[id].value;
            if ("true" === result) {
                return "1";
            }
            if (undefined === result || 0 === result.length && driver.isNumericField(id)) {
                if (-1 !== [1,2].indexOf(id)) {
                    return "";
                }
                return "0";
            } else {
                return form[id].value;
            }
        } else {
            if (driver.isNumericField(id)) {
                if (-1 !== [1,2].indexOf(id)) {
                    return "";
                }
            } else {
                return "";
            }
        }
    };






    for (let id in form) {
        template = template.replace("{" + id + "}", getValue(id));
    }

    for(let i = 0;i < 150;i++) {
        template = template.replace("{" + i + "}", '');
    }



    res.set('Content-Type', 'application/xml');
    res.setHeader('Content-disposition', 'attachment; filename=pit37-generated.xml');
    res.send(template);
});


module.exports = router;
