import React from 'react';
import {ScanImg} from "./ScanImg";
import {ScanDocument} from "./ScanDocument";
import {ScanForm} from "./ScanForm";
import {getFormData,guessPage} from "./form-lib";



export interface ScanPageProps {
    file: string,
}
export interface ScanPageState {
    formData: string,
    page: number
}

export class ScanPage extends React.Component<ScanPageProps,ScanPageState> {

    public formData: any;
    public page: number;

    async componentDidMount() {
        // const url = ScanDocument.getApiUrl()+"formData/"+this.props.file+".json";
        // const data = await fetch(url
        //     ,
        //     {
        //         // mode: "no-cors",
        //         method: "GET",
        //         headers: {
        //             Accept: 'application/json',
        //         },
        //     }
        //
        // );
        //
        // this.formData = await data.json();
        this.formData = await getFormData(this.props.file);
        this.page = guessPage(this.formData.formData);
        window["formData"] = this.formData;
        this.setState({
            formData: this.formData,
            page: this.page
        });

    }


    constructor(props) {
        super(props);
        window["ScanPage"] = this;

    }


    guessPage(formData) {

    }


    render() {


        let form = <h3 className="form-loading">
             Trwa wczytywanie... <br/>
            <i className="fa fa-spinner fa-spin"></i>
        </h3>;
        if (undefined != this.page) {
            form = <div className="col-md-6">
                Formularz (strona {1+this.page})
                <ScanForm file={this.props.file} page={ this.page } formData={ this.formData } />
            </div>;
        }

        return <div className="scan-page row">
            <div className="col-md-6">
                Oryginał
                <ScanImg file={this.props.file} />
            </div>
            {form}
        </div>
    }
}
