import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Query from './query/query.tsx';
import Header from './header/header.tsx';
import Conversation from './conversation/conversation';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter,
    Route,
    Routes,
    Link,
    useParams
  } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Query />} />
        <Route path='about' element={<About />} />
        <Route path='conversation/:conversationName' element={<Conversation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function About() {
    return (
        <p>About page</p>
    )
}