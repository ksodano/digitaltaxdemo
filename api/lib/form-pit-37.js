const {Form,getWordText,FormDriver} = require("./form");

const numericOnly = [1,2,5];

const checkboxFields = [6,10,11,141,142,148,135];

const ignoreFields = [3,4,149,150,151];





class FormPit37 extends FormDriver {


    getData() {
        this.data = {};
        this.dataObjects = {};
        this.form.getFormInputs().forEach(formInput => {
            const indicator = parseInt(getWordText(formInput.getFormIndicator()));
            if (undefined === this.data[indicator]
                || formInput.formIndicatorDistance < this.data[indicator].formIndicatorDistance) {
                this.data[indicator] = formInput.getValue();
                this.dataObjects[indicator] = formInput;
            }
        });

        return this.data;
    }

     isIgnoredField(id) {
        id = parseInt(id);
        return -1 !== ignoreFields.indexOf(id)
            || -1 !== checkboxFields.indexOf(id)
            ;
    }

    isNumericField(id) {
        id = parseInt(id);
        return -1 !== numericOnly.indexOf(id)
            || id >= 36 && id <= 133

    }


}

module.exports = {FormPit37};