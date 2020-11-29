import React from 'react';
import {ScanImg} from "./ScanImg";
import {ScanPage} from "./ScanPage";
import {ScanForm} from "./ScanForm";
import {DocumentList} from "./DocumentList";

declare var ScanFormInstances;


export interface ScanDocumentProps {
    files: string[]
}

export class ScanDocument extends React.Component<ScanDocumentProps> {

    static getApiUrl() {
        return document.location.protocol + "//" + document.location.host.replace(/3000/,"2000")+"/";

    }

    constructor(props) {
        super(props);
        window["ScanDocument"] = this;
    }


    async export() {
         const form = {};
         for(let page = 0;page < 4; page++) {
             if (undefined === ScanFormInstances[page]) {
                 alert("Brakuje strony "+page+" do eksportu");
                 return;
             }
             for(let id in ScanFormInstances[page].form) {
                 form[id] = ScanFormInstances[page].form[id];
             }
         }
         const formDom = document.createElement("form");
         formDom.method = "POST";
         formDom.action = ScanDocument.getApiUrl() + "export";
         formDom.target = "_blank";
         const input = document.createElement("input");
         input.type = "hidden";
         input.name = "form";
         input.value = JSON.stringify(form);
        formDom.appendChild(input);
         document.body.appendChild(formDom);
         formDom.submit();
        console.log("export",form,formDom);


    }

    render() {

        if (0 === this.props.files.length) {
            return <DocumentList />;
        }

        const scans = [];

        this.props.files.forEach((file,key) => scans.push(<ScanPage key={key} file={file} />));

        return <div className="document">
            {scans}

            <button onClick={() => this.export()} className="btn btn-primary btn-xl">Eksportuj XML</button>
        </div>
    }
}
