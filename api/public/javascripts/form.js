

class Form {
    constructor(words,boxes,img) {
        this.words = words;
        this.boxes = boxes;
        this.img = img;
    }

    getDocumentProp(word) {
        return (word.boundingBox.vertices[2].y - word.boundingBox.vertices[1].y) / this.img.height;
    }

    isIndicatorTextValid(word) {
        let result = "";
        const symbols = word.symbols.map(el => el);
        if (symbols[symbols.length -1].text === ".") {
            symbols.splice(symbols.length - 1,1);
        }
        word.symbols = symbols;
        for(const symbol of symbols) {
            if (Math.round(symbol.confidence * 100) > 98
                &&
                !isNaN(parseInt(symbol.text))

            ) {
                result += symbol.text;
            } else {
                // return false;
            }
        }
        if (parseInt(result) > 150) {
            return false;
        }
        return result;
    }

    getIndicators() {
        if (undefined === this._indicators) {
            this._indicators = [];

            const byProp = {};
            const candidates = [];
            for(const word of this.words) {
                if (this.isIndicatorTextValid(word)) {
                    const prop = Math.round(this.getDocumentProp(word) * 1000);
                    if (undefined === byProp[prop]) {
                        byProp[prop] = [];
                    }
                    byProp[prop].push(word);
                    candidates.push(word);
                }
            }


            let winnerProp = null;
            for(const prop in byProp) {
                if (null === winnerProp || byProp[prop].length > byProp[winnerProp].length)  {
                    winnerProp = prop;
                }
            }


            // @todo box find

            for(const word of candidates) {
                const diff = ((winnerProp / 1000) - this.getDocumentProp(word)) / (winnerProp / 1000);
                if (diff < 0.01) {
                    this._indicators.push(word);
                }
            }



        }
        return this._indicators;
    }

}

const getForm = async img => {
    const url = img.src.replace(/\/data\//,"/formData/") + ".json";
    return await (await fetch(url)).json();
}


export {Form,getForm};