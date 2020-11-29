const vision = require('@google-cloud/vision');
const fs = require('fs');
var nodeBase64 = require('nodejs-base64-converter');

// Creates a client

const clientOptions = {apiEndpoint: 'eu-vision.googleapis.com'};
const client = new vision.ImageAnnotatorClient(clientOptions);


class Analysis {
    constructor(data) {
        this.data = data;
    }


}


const analyze = async fname => {
    const analyzePath = fname+"-data.json";
    if (fs.existsSync(analyzePath)) {
        return JSON.parse(fs.readFileSync(analyzePath));
    }

    const request = {
        features: [{type: 'DOCUMENT_TEXT_DETECTION'}],
        imageContext: {
            languageHints: ["pl"]
        },
        "image": {
            "content": nodeBase64.encode(fs.readFileSync(fname))
        },
    };

    // const [result] = await client.textDetection(fname);
    const [result] = await client.batchAnnotateImages({
        requests: [request],
    });

    fs.writeFileSync(analyzePath,JSON.stringify(result));
    return result;


}


module.exports = {analyze}