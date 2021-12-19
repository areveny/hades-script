import React from 'react';
import Header from '../header/header';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    Routes,
    Link
  } from 'react-router-dom';

function About() {
    return (
        <p>About page</p>
    )
}

export default About;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Header />
    <About />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
