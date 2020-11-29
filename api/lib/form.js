const fs = require('fs');

const sizeOf = require('image-size');


class FormInput {

    constructor(indicator,valueWords) {
        this.indicator = indicator;
        this.valueWords = valueWords;
    }

}

const isFormIndicatorTextValid = word => {
    let result = "";
    const symbols = word.symbols.map(el => el);
    if (0 === symbols.length) {
        return false;
    }
    if (symbols[symbols.length - 1].text === ".") {
        symbols.splice(symbols.length - 1, 1);
    } else {
        // return false;
    }
    word.symbols = symbols;
    for (const symbol of symbols) {
        if (
            // Math.round(symbol.confidence * 100) > 98
            // &&
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

const distance = (point1, point2) => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}


const getWordText = word => word.symbols.map(s => s.text).join("");


class FormBox {
    constructor(box, words = []) {
        this.box = box;
        this.words = words;
    }

    getFormIndicator() {
        if (undefined === this.formIndicator) {
            this.formIndicatorDistance = null;
            for (const word of this.words) {
                if (isFormIndicatorTextValid(word)) {
                    let dist = distance(
                        getWordCenter(word),
                        {x: this.box[0], y: this.box[1]});

                    if (null === this.formIndicatorDistance
                        || dist < this.formIndicatorDistance) {
                        this.formIndicatorDistance = dist;
                        this.formIndicator = word;
                    }
                }
            }
        }
        return this.formIndicator;
    }

    getValue() {
        if (undefined === this.value) {
            if (null == this.getFormIndicator()) {
                this.value = null;

            } else {
                const result = [];
                for(const word of this.words) {
                    if (getWordHeight(word) > getWordHeight(this.getFormIndicator()) * 1.3) {
                        result.push(getWordText(word));
                    }
                }
                this.value = result;
            }

        }
        return this.value;
    }

}

class Form {
    constructor(elements,imgSize) {
        this.elements = elements;
        this.imgSize = imgSize;
    }

    getFormInputs() {
        if (undefined === this.formInputs) {
            const candidates = [];
            let minDist = null;
            this.elements.forEach(element => {
                if (null != element.getFormIndicator()) {
                    if (element.formIndicatorDistance < minDist || null === minDist)  {
                        minDist = element.formIndicatorDistance;
                    }
                    candidates.push(element);
                }
            });

            this.formInputs = candidates;

            // this.formInputs = candidates.filter(formInput => {
            //     const dist = (formInput.formIndicatorDistance - minDist);
            //     let distMod = (dist - minDist) / minDist;
            //     if (distMod < 0) {
            //         return false;
            //     }
            //     return distMod < 1
            // });

        }
        return this.formInputs;
    }

}

const getBoxCenter = box => {
    return {
        x: box[0] + box[2] / 2,
        y: box[1] + box[3] / 2

    }
}

const isBoxInsideBox = (box, container) => {
    const boxPos = getBoxCenter(box);
    return container[2] * container[3] > box[2] * box[3]
        && boxPos.x >= container[0]
        && boxPos.y >= container[1]
        && boxPos.x <= container[0] + container[2]
        && boxPos.y <= container[1] + container[3]
        ;
}

const getWordCenter = word => {
    const wordBox = word.boundingBox.vertices;
    return {
        x: (wordBox[2].x + wordBox[0].x) / 2,
        y: (wordBox[2].y + wordBox[0].y) / 2,
    };
}


const getWordHeight = word => {
    const wordBox = word.boundingBox.vertices;
    return wordBox[2].y - wordBox[0].y;
}

const isWordInsideBox = (word, box) => {

    const wordPos = getWordCenter(word);
    return wordPos.x >= box[0]
        && wordPos.y >= box[1]
        && wordPos.x <= box[0] + box[2]
        && wordPos.y <= box[1] + box[3]
        ;

}


const generateForm = file => {

    const allBoxes = JSON.parse(fs.readFileSync(file + "-report.json").toString('utf8'));




    const data = JSON.parse(fs.readFileSync(file + "-data.json").toString('utf8'));


    const words = [];
    data.responses.forEach(response => response.fullTextAnnotation.pages.forEach(
        page => page.blocks.forEach(block => block.paragraphs.forEach(paragraph => paragraph.words.forEach(word => words.push(word))))));

    const imageSize = sizeOf(file);

    const minBoxHeight = 30 * (imageSize.height  / 1754);
    const minBoxWidth = 30 * (imageSize.height  / 1754);

    const reducedBoxes = allBoxes.filter(box => {
       return  box[3] > minBoxHeight && box[2] > minBoxWidth;
    });
    // reducedBoxes = allBoxes;

    // filter containers of other boxes
    const boxes = reducedBoxes.filter(candidate => {
        for (const box of reducedBoxes) {
            if (candidate !== box && isBoxInsideBox(box, candidate)) {
                return false;
            }
        }
        return true;
    });

    const allFormElements = [];
    for (const box of boxes) {
        let boxForm = null;
        for (const word of words) {
            if (isWordInsideBox(word, box)) {
                if (null === boxForm) {
                    boxForm = new FormBox(box, [word]);
                } else {
                    boxForm.words.push(word);
                }
            }
        }
        if (null !== boxForm) {
            boxForm.boxId = allBoxes.indexOf(box);
            allFormElements.push(boxForm);
        }
    }


    let result = new Form(allFormElements,imageSize);
    return result;
}



class FormDriver {

    constructor(form) {
        this.form = form;
    }

    getData() {

    }
}

module.exports = {generateForm,Form,FormBox,FormDriver,getWordText};