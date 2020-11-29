import React from 'react';
import {ScanImg} from "./ScanImg";
import {ScanDocument} from "./ScanDocument";
import {ScanForm} from "./ScanForm";
import {getFormData,guessPage} from "./form-lib";

import Select from 'react-select';

export interface CheckboxesProps {
    form: any,
    formData: any,
    id: number,
    renderScaleFactor: number,
    templateScaleFactor: number,
    onChange: (id: any,value: any) => void,
    dataObject: any
}
export interface CheckboxesState {

}

export class Checkboxes extends React.Component<CheckboxesProps,CheckboxesState> {

    static instances = [];

    async componentDidMount() {
        console.log("checkboxes",this.props.formData.form.checkboxes);
        this.initialCheck();
    }

    constructor(props) {
        super(props);

        if (undefined === window["checkboxesInstances"]) {
            window["checkboxesInstances"] = {};
        }
        window["checkboxesInstances"][this.props.id] = this;

    }

    findCheckboxes() {

        const container = this.props.dataObject.box;

        const scale = val => val * this.props.templateScaleFactor;

        const isIn = checkbox => {
            const x = scale(checkbox[0][0]);
            const y = scale(checkbox[0][1]);
            return x >= container[0]
                && x <= container[0] + container[2]
                && y >= container[1]
                && y <= container[1] + container[3];
        };

        return this.props.formData.form.checkboxes.filter(checkbox => isIn(checkbox));
    }

    findCheckboxCheckedIndex() {
        const checkboxes = this.findCheckboxes();
        if (checkboxes.length > 0) {
            for(let index in checkboxes) {
                if (checkboxes[index][1] == true) {
                    return index;
                }
            }
        }
        return null;
    }

    onCheckboxChange(e,id,value) {
        console.log("checkbox chamge",e,value);
        if (undefined === this.props.form[id]) {
            this.props.form[id] = {value: ""};
        }
        this.props.form[id].value = value;
        this.setState({form: this.props.form});
        this.props.onChange(id,value);

    }

    initialCheck() {
        switch(this.props.id) {
            case 135:
                if (null !== this.findCheckboxCheckedIndex()) {
                    this.onCheckboxChange(null,135,true);

                }
                break;
            case 6:
                const checkedIndex = this.findCheckboxCheckedIndex();

                if (null !== checkedIndex) {

                    setTimeout(() => {
                        this.onCheckboxChange(null,6,parseInt(checkedIndex)+1);
                    },100);


                }
                break;
        }
    }

    // scaledRender(value) {
    //     return value * this.props.templateScaleFactor * this.props.renderScaleFactor;
    // }

    isChecked(id) {
        return undefined != this.props.form[id] && true == this.props.form[id].value;
    }

    isRadioChecked(id,val) {
        id = parseInt(id);
        return undefined != this.props.form[id] && parseInt(this.props.form[id].value) === val;
    }

    render() {

        let checkboxes = <span/>;



        switch(this.props.id) {
            case 6:

                checkboxes = <div>
                    <br/>
                        <div className="row">
                            <div className="col-md-3">
                                <input type="radio"
                                       name="form-radio-6"
                                       id="form-radio-6.1"
                                       onChange={e => this.onCheckboxChange(e,6,1)}
                                       checked={this.isRadioChecked(6,1)}
                                       />
                                <label htmlFor="form-radio-6.1">1. Indywidualnie</label>
                            </div>
                            <div className="col-md-3">
                                <input type="radio"
                                       name="form-radio-6"
                                       id="form-radio-6.2"
                                       onChange={e => this.onCheckboxChange(e,6,2)}

                                       checked={this.isRadioChecked(6,2)}
                                />
                                <label htmlFor="form-radio-6.2"> 2. Wspólnie z małżonkiem (..)</label>
                            </div>
                            <div className="col-md-3">
                                <input type="radio"
                                       name="form-radio-6"
                                       id="form-radio-6.3"
                                       onChange={e => this.onCheckboxChange(e,6,3)}

                                       checked={this.isRadioChecked(6,3)}
                                />
                                <label htmlFor="form-radio-6.3"> 3. (..) dla wdów i wdowców</label>
                            </div>
                            <div className="col-md-3">
                                <input type="radio"
                                       name="form-radio-6"
                                       id="form-radio-6.4"
                                       onChange={e => this.onCheckboxChange(e,6,4)}

                                       checked={this.isRadioChecked(6,4)}
                                />
                                <label htmlFor="form-radio-6.4">4. (..) dla osób samotnie wychowujących dzieci</label>
                            </div>
                        </div>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="checkbox"
                                   id="form-checkbox-7"
                                   onChange={e => this.onCheckboxChange(e,7,!this.isChecked(7))}
                                   checked={this.isChecked(7)}
                            />
                            <label htmlFor="form-checkbox-7">7. (..) - podatnik</label>
                        </div>
                        <div className="col-md-6">
                            <input type="checkbox"
                                   id="form-checkbox-8"
                                   onChange={e => this.onCheckboxChange(e,8,!this.isChecked(8))}
                                   checked={this.isChecked(8)}
                            />
                            <label htmlFor="form-checkbox-8">8. (..) - małżonek</label>
                        </div>

                    </div>
                    </div>;
                break;


            case 10:

                checkboxes = <div className="row">
                    <div className="col-md-6">
                        <input type="radio"
                               name="form-radio-10"
                               id="form-radio-10.1"
                               onChange={e => this.onCheckboxChange(e,10,1)}
                               checked={this.isRadioChecked(10,1)}
                        />
                        <label htmlFor="form-radio-10.1">1. złożenie zeznania</label>
                    </div>
                    <div className="col-md-6">
                        <input type="radio"
                               name="form-radio-10"
                               id="form-radio-10.2"
                               onChange={e => this.onCheckboxChange(e,10,2)}

                               checked={this.isRadioChecked(10,2)}
                        />
                        <label htmlFor="form-radio-10.2"> 2. korekta zeznania </label>
                    </div>
                </div>
                break;

            case 11:

                checkboxes = <div className="">
                    {/*<div className="col-md-6">*/}
                        <input type="radio"
                               name="form-radio-11"
                               id="form-radio-11.1"
                               onChange={e => this.onCheckboxChange(e,11,1)}
                               checked={this.isRadioChecked(11,1)}
                        />
                        <label htmlFor="form-radio-11.1">1. korekta zeznania o której mowa w art 81 Ordynacji podatkowej</label>
                    <br/>
                    {/*</div>*/}
                    {/*<div className="col-md-6">*/}
                        <input type="radio"
                               name="form-radio-11"
                               id="form-radio-11.2"
                               onChange={e => this.onCheckboxChange(e,11,2)}

                               checked={this.isRadioChecked(11,2)}
                        />
                        <label htmlFor="form-radio-11.2"> 2. korekta zeznania skłądana w toku postępowania podatkowego w sprawie unikania opodatkowania</label>
                    {/*</div>*/}
                </div>
                break;



            case 135:

                checkboxes = <div >
                    <label htmlFor="form-checkbox-135">135.</label>
                    <input type="checkbox"
                           id="form-checkbox-135"
                           onChange={e => this.onCheckboxChange(e,135,!this.isChecked(135))}
                           checked={this.isChecked(135)}
                    />
                </div>
                break;



            case 141:

                checkboxes = <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="form-radio-141.1">1. </label>
                        <input type="radio"
                               name="form-radio-141"
                               id="form-radio-141.1"
                               onChange={e => this.onCheckboxChange(e,141,1)}
                               checked={this.isRadioChecked(141,1)}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="form-radio-141.2"> 2. </label>
                        <input type="radio"
                               name="form-radio-141"
                               id="form-radio-141.2"
                               onChange={e => this.onCheckboxChange(e,141,2)}

                               checked={this.isRadioChecked(141,2)}
                        />
                    </div>
                </div>
                break;

            case 142:

                checkboxes = <div className="row">

                    <div className="col-md-4">
                        <label htmlFor="form-radio-142.1">1. </label>
                        <input type="radio"
                               name="form-radio-142"
                               id="form-radio-142.1"
                               onChange={e => this.onCheckboxChange(e,142,1)}
                               checked={this.isRadioChecked(142,1)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="form-radio-142.2"> 2. </label>
                        <input type="radio"
                               name="form-radio-142"
                               id="form-radio-142.2"
                               onChange={e => this.onCheckboxChange(e,142,2)}

                               checked={this.isRadioChecked(142,2)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="form-radio-142.3"> 3. </label>
                        <input type="radio"
                               name="form-radio-142"
                               id="form-radio-142.3"
                               onChange={e => this.onCheckboxChange(e,142,3)}

                               checked={this.isRadioChecked(142,3)}
                        />
                    </div>

                </div>
                break;

            case 144:

                checkboxes = <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="form-radio-144.1">1. </label>
                        <input type="radio"
                               name="form-radio-144"
                               id="form-radio-144.1"
                               onChange={e => this.onCheckboxChange(e,144,1)}
                               checked={this.isRadioChecked(144,1)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="form-radio-144.2"> 2. </label>
                        <input type="radio"
                               name="form-radio-144"
                               id="form-radio-144.2"
                               onChange={e => this.onCheckboxChange(e,144,2)}

                               checked={this.isRadioChecked(144,2)}
                        />
                    </div>

                </div>
                break;
            case 148:

                checkboxes = <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="form-radio-148.1">1. </label>
                        <input type="radio"
                               name="form-radio-148"
                               id="form-radio-148.1"
                               onChange={e => this.onCheckboxChange(e,148,1)}
                               checked={this.isRadioChecked(148,1)}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="form-radio-148.2"> 2. </label>
                        <input type="radio"
                               name="form-radio-148"
                               id="form-radio-148.2"
                               onChange={e => this.onCheckboxChange(e,148,2)}

                               checked={this.isRadioChecked(148,2)}
                        />
                    </div>

                </div>
                break;



        }
        return <div title={"checkboxes"+this.props.id}>

            {checkboxes}

        </div>
    }
}
