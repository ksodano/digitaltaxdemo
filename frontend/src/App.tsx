import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ScanImg} from "./ScanImg";
import {ScanDocument} from "./ScanDocument";

function App() {


    const files = document.location.pathname.split("/").filter(el => 0 < el.trim().length);


  return (
    <div className="App">

      <ScanDocument files={files} />


    </div>
  );
}

export default App;
