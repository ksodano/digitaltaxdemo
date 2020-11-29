import React from 'react';
import {ScanDocument} from "./ScanDocument";
import {
    autoFixFormMainTaxId,
    getDataByTaxId,
    getFormData,
    getFormPattern,
    getIndicatorPage,
    isIgnoredField,
    parseFormValue,
    getTaxIdUserFieldsMap, isCheckboxField
} from "./form-lib";
import {UsSelect} from "./UsSelect";
import {Checkboxes} from "./Checkboxes";




const templatePages = [
    "pit37_26-10.pdf-0000.png",
    "pit37_26-10.pdf-0001.png",
    "pit37_26-10.pdf-0002.png",
    "pit37_26-10.pdf-0003.png",
];

export interface ScanFormProps {
    page: number,
    formData: any,
    file: string
}


export class ScanForm extends React.Component<ScanFormProps> {

    static formInstances = {};

    scannedImgSize: any;
    templateImgSize: any;
    templateFormData: any;

    templateScaleFactor = 1;
    renderScaleFactor = 1;

    form = {};


    constructor(props) {
        super(props);

        ScanForm.formInstances[this.props.page] = this.form;
        window["formInstances"] = ScanForm.formInstances;
    }

    isHandWritten(word) {
        const indicatorFontSize = (423-399) * (this.scannedImgSize.height / 3506);
        let result = word.boundingBox.vertices[2].y - word.boundingBox.vertices[1].y > indicatorFontSize * 2;
        // if (!result) {
        //     console.log(indicatorFontSize*1.3,word.boundingBox.vertices[2].y - word.boundingBox.vertices[1].y)
        // }
        // console.log("handwritten",result, word.symbols.map(s=>s.text).join(""),indicatorFontSize* 1.3,word.boundingBox.vertices[2].y - word.boundingBox.vertices[1].y);
        return result;
    }

    getFormValue(id) {
        if (undefined !== this.props.formData.formData[id]) {
            return this.props.formData.formData[id];
        } else {
            // try template indicator box
            const templateObject = this.templateFormData.formDriver.dataObjects[id];
            if (undefined != templateObject) {
                const scaledBox = [];
                for(let i = 0;i < 4;i++) {
                    scaledBox.push( templateObject.box[i] / this.templateScaleFactor);
                }
                scaledBox[0] *= 0.98;
                scaledBox[1] *= 0.98;
                scaledBox[2] *= 1.02;
                scaledBox[3] *= 1.02;
                let result = [];

                for(const candidate of this.props.formData.form.elements) {
                    const center = [
                        candidate.box[0] + candidate.box[2] / 2,
                        candidate.box[1] + candidate.box[3] / 2,
                    ];

                    if (center[0] >= scaledBox[0]
                        && center[0] <= scaledBox[0] + scaledBox[2]
                        && center[1] >= scaledBox[1]
                        && center[1] <= scaledBox[1] + scaledBox[3]
                    ) {

                        result = result.concat(candidate.words
                            .filter(word => this.isHandWritten(word))
                            .map(word => word.symbols.map(s => s.text).join("")));
                    }
                }
                return result;
            }
        }
        return null;
    }

    getValue(id) {
        id = parseInt(id);
        if (undefined !== this.form[id]) {
            return this.form[id].value;
        } else {
            return "";
        }
    }


    async componentDidMount() {

        this.templateFormData = await getFormData(this.getFile());
        this.scannedImgSize = this.props.formData.form.imgSize;
        this.templateImgSize = this.templateFormData.form.imgSize;
        this.templateScaleFactor = this.templateImgSize.width / this.scannedImgSize.width;

        for(let id in this.templateFormData.formDriver.dataObjects) {

            if (!isIgnoredField(id)
                &&
                null !== getIndicatorPage(id)
                && parseInt(getIndicatorPage(id)) == this.props.page) {

                let value = "";
                const rawVal = this.getFormValue(id);
                if (null != rawVal) {
                    value = parseFormValue(id,rawVal);
                    console.log(value);
                }
                this.form[id] = {
                    value: value
                }

            }
        }




        const updateScaleFactor = () => {
            let width = window.innerWidth / 2;
            if (null != document.querySelector("img")) {
                width = document.querySelector("img").width;
            } else {
                setTimeout(() => updateScaleFactor(),100);
            }
            this.renderScaleFactor = width / this.templateImgSize.width ;
            this.setState({renderScaleFactor: this.renderScaleFactor});
        };

        updateScaleFactor();



        this.setState({
            form: this.form
        });
        window.addEventListener('resize', event => {
            updateScaleFactor()
        });
        if (undefined === window["ScanFormInstances"]) {
            window["ScanFormInstances"] = {};
        }
        window["ScanFormInstances"][this.props.page] = this;

    }




    getFile() {
        return templatePages[this.props.page]
    }

    getImgSrc() {
        return ScanDocument.getApiUrl()+"data/"+this.getFile()
    }

    onInputChange(id,e) {
        this.form[id].value = e.target.value;
        this.form[id].userChanged = true;
        this.setState({form: this.form});

    }

    scaledRender(value) {
        return this.renderScaleFactor * value;
    }

    taxIdImported = {1: false,2: false}

    async autoFillTaxId(id) {
        const taxId = this.getValue(id);
        if (!/^\d{11}$/.test(taxId)) {
            alert("Nieprawidłowy nr NIP");
            return;
        }
        const data = await getDataByTaxId(taxId);
        if (null == data || 0 == data.length) {
            alert("Nie znaleziono danych dla numeru NIP "+taxId);
            return;
        }
        const row = data[0];
        const map = getTaxIdUserFieldsMap(id);

        for(let key in row) {
            if (undefined !== map[key] && undefined != this.form[map[key]]) {
                console.log("set",map[key],row[key]);
                this.form[map[key]].oldValue = this.form[map[key]].value;
                this.form[map[key]].value = row[key];
                this.form[map[key]].imported = true;
            }
        }

        this.taxIdImported[id] = true;

        this.setState({form: this.form});

    }

    onUsChange(val) {
        console.log("us change",val);
        this.form[9].value = val;
    }

    onCheckboxChange(id,val) {
        console.log("checkbox change",id,val);
    }

    render() {

        const inputs = [];

        const buttons = [];



        switch(this.props.page) {
            case 0:
                if (this.getValue(1).length > 0) {
                    buttons.push(<button
                        className="btn btn-primary"
                        style={{top: this.renderScaleFactor * 70 + "px"}}
                        key={1} onClick={e => this.autoFillTaxId(1)} >
                        Importuj dane podatnika
                    </button>);
                }
                if (this.getValue(2).length > 0) {
                    buttons.push(<button
                        className="btn btn-primary"
                        style={{top: this.renderScaleFactor * 130 + "px"}}
                        key={2} onClick={e => this.autoFillTaxId(2)} >
                        Importuj dane małżonka
                    </button>);
                }

                break;
        }

        for(let id in this.form) {
            const placeholder = "Pole nr "+id+".";
            const object = this.templateFormData.formDriver.dataObjects[id];
            if (undefined === object) {
                console.error("no object on id",id);
                continue;
            }
            const style = {
                left: this.scaledRender(object.box[0]) + "px",
                top: this.scaledRender(object.box[1]) + "px",
                width: this.scaledRender(object.box[2]) + "px",
                height: this.scaledRender(object.box[3]) + "px",
            };
            let className = "scan-form-input";
            if (undefined !== this.form[id].userChanged) {
                className += " user-changed";
            }
            if (undefined !== this.form[id].imported) {
                className += " imported";
            }

            switch(parseInt(id)) {
                case 9:
                    inputs.push(<div key={id} className="us-select-container"

                                     style={style}
                    >

                        <UsSelect initialValue={this.form[id].value} onChange={value => this.onUsChange(value)} />
                    </div>);
                    break;
                default:
                    if (isCheckboxField(id)) {
                        inputs.push(<div key={id} className="checkboxes-container"
                                         style={style}

                        >

                            <Checkboxes
                            dataObject={object}
                                id={parseInt(id)} formData={this.props.formData} form={this.form}
                                        onChange={((id1, value) => this.onCheckboxChange(id1,value))}
                                        templateScaleFactor={this.templateScaleFactor}
                                        renderScaleFactor={this.renderScaleFactor}  />
                        </div>);
                    } else {
                        inputs.push(<input className={className}
                                           onChange={e => this.onInputChange(id,e)}
                                           key={id}
                                           style={style}
                                           pattern={getFormPattern(id)}
                                           placeholder={placeholder}
                                           title={placeholder}
                                           value={this.form[id].value}
                                           type="text" />);
                    }

            }


        }


        return <div >
            <div className="scan-control">
                {buttons}
            </div>
            <div className="scan-form">
                <form>{inputs}</form>
            </div>
            <img src={this.getImgSrc()} />
        </div>
    }
}
