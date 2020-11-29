import React from 'react';
import {ScanDocument} from "./ScanDocument";



export interface ScanImgProps {
    file: string
}

export class ScanImg extends React.Component<ScanImgProps> {

    constructor(props) {
        super(props);
        window["ScanImg"] = this;

    }

    getImgSrc() {
        return ScanDocument.getApiUrl()+"data/"+this.props.file;
    }




    render() {
        return <div>
            <img src={this.getImgSrc()} />
        </div>
    }
}
