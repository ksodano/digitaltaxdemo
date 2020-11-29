import React from 'react';
import {ScanImg} from "./ScanImg";
import {ScanPage} from "./ScanPage";
import {ScanForm} from "./ScanForm";
import {ScanDocument} from "./ScanDocument";


export interface DocumentListProps {

}

export class DocumentList extends React.Component<DocumentListProps> {


    demoLinks = [
        {
            "link": "/pit-37_5.pdf-0000.jpg/pit-37_5.pdf-0001.jpg/pit-37_5.pdf-0002.jpg/pit-37_5.pdf-0003.jpg",
            "title": "pit-37_5",
            "img":  "pit-37_5.pdf-0000.jpg"
        },
        {
            "link": "/pit-37_4.pdf-0000.jpg/pit-37_4.pdf-0001.jpg/pit-37_4.pdf-0002.jpg/pit-37_4.pdf-0003.jpg",
            "title": "pit-37_4",
            "img":  "pit-37_4.pdf-0000.jpg"
        },
        {
            "link": "/PIT-37_6.pdf-0000.jpg/PIT-37_6.pdf-0001.jpg/PIT-37_6.pdf-0002.jpg/PIT-37_6.pdf-0003.jpg",
            "title": "PIT-37_6",
            "img":  "PIT-37_6.pdf-0000.jpg"
        },
        {
            "link": "/PIT-37_7.pdf-0000.jpg/PIT-37_7.pdf-0001.jpg/PIT-37_7.pdf-0002.jpg/PIT-37_7.pdf-0003.jpg",
            "title": "PIT-37_7",
            "img":  "PIT-37_7.pdf-0000.jpg"
        },
    ]

    constructor(props) {
        super(props);

    }


    render() {

        const demoLinks = [];
        this.demoLinks.forEach((link,i) => {
            demoLinks.push(<div className="col-md-3" key={i}>
                <h2>{link.title}</h2>
                <img src={ScanDocument.getApiUrl()+"data/"+link.img} />
                <br/>
                <a className="btn btn-primary"
                   href={link.link}>
                    Otwórz
                </a>
            </div>);
        });

        return <div className="hello">
            <br/>
            <h1>Digital Tax Demo</h1>

            <br/>
            <br/>
            <br/>

            <div className="row">
                {demoLinks}
            </div>
        </div>
    }
}
