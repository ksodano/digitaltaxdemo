
const renderBox = box => {
    const div = document.createElement("div");
    div.style.marginTop = box[1]+"px";
    div.style.marginLeft = box[0]+"px";
    div.style.width = box[2]+"px";
    div.style.height = box[3]+"px";
    div.className = "box";
    document.getElementById("container").prepend(div);
    box.el = div;
}

const boxesInit = async img => {
    const url = img.src+"-report.json";
    const data = await (await fetch(url)).json();
    for(const box of data) {
        renderBox(box);
    }
    return data;
}

export {boxesInit}