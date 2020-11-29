

const renderIndicator = word => {
    word.el.classList.add("indicator");
}

const renderWord = (word,parent) => {
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
    div.classList.add("word");
    word.el = div;
    document.getElementById("container").prepend(div);
}

const renderBox = box => {
    const div = document.createElement("div");
    div.style.marginTop = box[1]+"px";
    div.style.marginLeft = box[0]+"px";
    div.style.width = box[2]+"px";
    div.style.height = box[3]+"px";
    div.className = "box";
    document.getElementById("container").prepend(div);
    box.el = div;
    return div;
}

const renderFormElement = element => {
    const boxEl = renderBox(element.box);
    boxEl.setAttribute("boxId",element.boxId);
    boxEl.onclick = () => console.log(element);
    element.words.forEach(word => renderWord(word));
    console.log(element);





}

export {renderIndicator,renderFormElement}