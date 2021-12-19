import './header.css';
import {
    BrowserRouter,
    Route,
    Routes,
    Link,
    Outlet
  } from 'react-router-dom';

function Header() {
    return (
        <div className='header'>
    <h1>hades-script</h1>
    <div className='nav'>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
    </div>
</div>
    )
}

export default Header;