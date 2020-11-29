import {ScanDocument} from "./ScanDocument";


export async function getFormData(file) {
    const url = ScanDocument.getApiUrl()+"formData/"+file+".json";
    const data = await fetch(url
        ,
        {
            // mode: "no-cors",
            method: "GET",
            headers: {
                Accept: 'application/json',
            },
        }

    );

    return await data.json();
}




const pageIds = [
    [1,35],
    [36,105],
    [106,131],
    [132,151]
];


const numericOnly = [1,2,5,140];

const checkboxFields = [6,10,11,141,142,144,148,135];

const ignoreFields = [3,4,149,150,151];

export function isIgnoredField(id) {
    id = parseInt(id);
    return -1 !== ignoreFields.indexOf(id)
        // || -1 !== checkboxFields.indexOf(id)
        ;
}


export function isCheckboxField(id) {
    id = parseInt(id);
    return -1 !== checkboxFields.indexOf(id)
        // || -1 !== checkboxFields.indexOf(id)
        ;
}

export function isNumericField(id) {
    id = parseInt(id);
    return -1 !== numericOnly.indexOf(id)
        || id > 36 && id < 133

}

export  function getIndicatorPage(id) {
    for(let page in pageIds) {
        if (id >= pageIds[page][0] && id <= pageIds[page][1]) {
            return page;
        }
    }
    return null;
};

export function guessPage (formData) {
    const pagePoints = [0,0,0,0];
    for(const id in formData) {
        const page = getIndicatorPage(id);
        if (null !== page) {
            pagePoints[page]++;
        }
    }
    return pagePoints.indexOf(Math.max.apply(null,pagePoints));

};

export function parseFormValue(id,values: string[]) {
    id = parseInt(id);
    if (isNumericField(id)) {
        return values.join("")
            .replace(/o/g,'0')
            .replace(/n/gi,'11')
            .replace(/\D/g,'');
    }
    if (isCheckboxField(id)) {
        return "0";
    }
    return values.join(" ");
}



export function getFormPattern(id) {
    id = parseInt(id);
    if (-1 !== [1,2].indexOf(id)) {
        return "^[0-9]{11}$";
    } else {

    }
}

export async function requestApi(type,column,query) {
    return await (await fetch(ScanDocument.getApiUrl()+"api/"+type+"/"+column+"/"+query)).json();
}


export async function getDataByTaxId(taxId) {
    if (!/^\d{11}$/.test(taxId)) {
        return null;
    }
    return await requestApi("crpkep","PESEL",taxId);
}

export function getTaxIdUserFieldsMap(id){
    let result = {
        "data ur": 14,
        gmina: 18,
        "imię": 13,
        "kod pocztowy": 23,
        kraj: 15,
        "miejscowość": 22,
        nazwisko: 12,
        "nr domu": 20,
        "nr lokalu": 21,
        powiat: 17,
        ulica: 19,
        "województwo": 16
    };
    if (2 == id) {
        for(let k in result) {
            result[k] += 12;
        }
    }
    return result;
}

export async function autoFixFormMainTaxId(form) {
    const mainTaxId = form[1];
    if (undefined != mainTaxId) {
        console.log("main tax id",mainTaxId);
        const userData = await getDataByTaxId(mainTaxId.value);
        if (null != userData && undefined !== userData[0]) {
            console.log("user data",userData);
        }
    }
}