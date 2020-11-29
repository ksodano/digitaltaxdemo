


// const indicators = [];
//
//
// const isFormIndicator = word => {
//     let result = "";
//     const symbols = word.symbols.map(el => el);
//     if (symbols[symbols.length -1].text === ".") {
//         symbols.splice(symbols.length - 1,1);
//     }
//     word.symbols = symbols;
//     for(const symbol of symbols) {
//         if (Math.round(symbol.confidence * 100) > 98
//             &&
//             !isNaN(parseInt(symbol.text))
//
//         ) {
//             result += symbol.text;
//         } else {
//             // return false;
//         }
//     }
//     if (parseInt(result) > 150) {
//         return false;
//     }
//     return result;
//     // return !isNaN(parseInt(result));
// }




class Ocr {
    constructor(img) {
        this.img = img;
        this.indicators = [];
        this.words = [];
    }

    render(word) {
        const div = document.createElement("div");
        div.style.marginTop = word.boundingBox.vertices[0].y+"px";
        div.style.marginLeft = word.boundingBox.vertices[0].x+"px";
        div.style.width = (word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x)+"px";
        div.style.height = (word.boundingBox.vertices[2].y - word.boundingBox.vertices[0].y)+"px";
        div.style.fontSize = ((word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x) / word.symbols.length) + "px";
        div.innerHTML = word.symbols.map(symbol => `<span
            data-confidence="`+Math.round(symbol.confidence * 10)+`"
            >`+symbol.text+`</span>`).join("");
        div.setAttribute("data-index",word.index);

        // const indicator = isFormIndicator(word);
        // if (indicator) {
        //     // div.setAttribute("data-form-indicator",isFormIndicator(word));
        //     indicators.push({
        //         id: indicator,
        //         word: word,
        //         el: div
        //     });
        //     word.indicator = indicator;
        //     div.classList.add("indicator");
        // }
        // if () {
        // }
        word.el = div;
        document.getElementById("container").prepend(div);
    }


    async analyze() {
        const url = this.img.src+"-data.json";
        const data = await (await fetch(url)).json();
        this.words = [];
        for (const block of data.responses[0].fullTextAnnotation.pages[0].blocks) {
            if ("TEXT" === block.blockType) {
                for(const paragraph of block.paragraphs) {
                    for(const word of paragraph.words) {
                        word.index = this.words.length;
                        word.fontProp = (word.boundingBox.vertices[2].y - word.boundingBox.vertices[1].y) / this.img.height;
                        word.text = word.symbols.map(s => s.text).join("");
                        this.render(word);
                        this.words.push(word);
                    }
                }
            }
        }
        return this.words;
    }
}

export {Ocr}