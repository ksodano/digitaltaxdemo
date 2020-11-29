import React from 'react';
import {ScanImg} from "./ScanImg";
import {ScanDocument} from "./ScanDocument";
import {ScanForm} from "./ScanForm";
import {getFormData,guessPage} from "./form-lib";

import Select from 'react-select';

export interface UsSelectProps {
    initialValue: string,
    onChange: (value: string) => void,
}
export interface UsSelectState {
    list: any[],
    value: any
}

export class UsSelect extends React.Component<UsSelectProps,UsSelectState> {


    list = []

    value = null

    async componentDidMount() {
        const url = ScanDocument.getApiUrl()+"api/uslist?value="+this.props.initialValue;
        const data = await (await fetch(url)).json();
        for(let row of data.data) {
            this.list.push({
                label: row.t + " ["+row.id+"]",
                value: row.id
            });
        }
        if (null != data.proposition) {
            this.value = this.list.find(el => el.value === data.proposition.id);
            // this.value = data.proposition.id;
            this.props.onChange(this.value.value);
        }
        console.log("value",this.value);
        this.setState({
            list: this.list,
            value: this.value
        });

    }

    handleChange(value) {
        console.log("value",value);
        this.setState({value: value})
        this.props.onChange(value.value);
    }


    constructor(props) {
        super(props);

    }


    render() {
        let select = <div>Wczytywanie..</div>
        if (this.list.length > 0) {
            select = <div className="us-select">
                <Select
                    defaultValue={this.value}
                    value={this.state.value}
                    onChange={value => this.handleChange(value)}
                    options={this.list}
                />
            </div>
        }
        return select
    }
}
