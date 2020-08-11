import React from 'react';
import Tilt from 'react-tilt';
import logo from './brain-bw.png';
import './Logo.css';

const Logo = ()=> (
    <div className={'pl3'}>
        <Tilt className={'Tilt br2 shadow-2 tc'} options={ {max: 55} } style={{height: 150, width: 150}}>
            <div className={'Tilt-inner pa3'}>
                <img className={'logo-image'} alt={'logo'} src={logo} />
            </div>
        </Tilt>
    </div>
);

export default Logo;
