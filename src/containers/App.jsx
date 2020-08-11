import React from 'react';
import 'tachyons';
import Particles from 'react-particles-js';
import Navigation from "../components/Navigation";
import ImageLinkForm from "../components/ImageLinkForm";
import Logo from '../components/Logo';
import Rank from '../components/Rank';
import './App.css';

const particlesOptions = {
    particles: {
        number: {
            value: 34,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#000000'
        },
        line_linked: {
            enable: true,
            color: '#000000'
        }
    },
    interactivity: {
        detectsOn: 'window',
        events: {
            onHover: {
                enable: true,
                mode: 'repulse'
            },
            onClick: {
                enable: true,
                mode: 'push'
            }
        }
    }
}

function App() {
  return (
    <div className="App">
      <Particles params={particlesOptions} className={'particles'}/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
    </div>
  );
}

export default App;
