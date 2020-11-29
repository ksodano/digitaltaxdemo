const {analyze} = require("../lib/gvision")

const file = "./public/data/pit2.jpeg";

(async () => {
    const result = await analyze(file);
    console.log(result);
})();

