import React from 'react';
import './Navigation.css';

const Navigation = ({route, onNavChange})=> (
    <nav className={'navigation'}>
        {route === 'home'?
            <p className={"f4 link dim black underline pa3 pointer"} onClick={event=> onNavChange('logout')}>Sign Out</p>:
            route === 'login'?
            <p className={"f4 link dim black underline pa3 pointer"} onClick={event=> onNavChange('register')}>Sign Up</p>:
            <p className={"f4 link dim black underline pa3 pointer"} onClick={event=> onNavChange('login')}>Sign In</p>
        }
    </nav>
);

export default Navigation;
