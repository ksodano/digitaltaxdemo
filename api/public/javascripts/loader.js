import {Ocr} from "./ocr.js";
import {boxesInit} from "./boxes.js";
import {Form,getForm} from "./form.js";
import {renderFormElement} from "./ui.js";

const load = async () => {
    const img = document.querySelector("img");

    // const words = await (new Ocr(img)).analyze();
    // window["words"] = words;
    // const boxes = await boxesInit(img);
    // window["boxes"] = boxes;
    // const form = new Form(words,boxes,img);
    // const indicators = form.getIndicators();
    // indicators.forEach(indicator => renderIndicator(indicator));
    // window["indicators"] = indicators;


    const form = await getForm(img);
    for(const element of form.form.elements) {
        renderFormElement(element);
    }
    window["form"] = form;




}
// img.addEventListener("load", async () => {
//
// });
window.addEventListener("load", async () => {
    load();
})