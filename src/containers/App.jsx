import React, {Component} from 'react';
import 'tachyons';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from "../components/Navigation";
import ImageLinkForm from "../components/ImageLinkForm";
import ImageRender from "../components/ImageRender";
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

const clarifai = new Clarifai.App({apiKey: 'a59ba2e1355547f7a6a3636902cb7e8d'})

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null,
            boxes: [],
        }
    }

    render() {
        let {imageUrl} = this.state;
        return (
            <div className="App">
                <Particles params={particlesOptions} className={'particles'}/>
                <Navigation/>
                <Logo/>
                <Rank/>
                <ImageLinkForm onFaceDetect={ this.showPicture }/>
                {imageUrl? <ImageRender url={imageUrl} boxes={this.state.boxes} /> : <></>}
            </div>
        );
    }

    showPicture = (url) => {
        this.setState({imageUrl: url, boxes: []}, ()=> {
            // console.log(`Processing picture using AI: ${url}`);
            clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, url)
                .then(json=> {
                    // console.log('Success: ', json);
                    return json;
                })
                .then(this.parseResult)
                // .then(regions=> {
                //     console.log('Regions: ', regions);
                //     return regions;
                // })
                .then(boxes=> this.setState({boxes: boxes}))
                .catch(reason=> console.log(`Fail: ${reason}`));
        });
    }

    parseResult = (json)=> {
        let output = json.outputs[0]
        if (output.status.code !== 10_000) {
            console.log(`API Error (${output.status.code}): `, output.status.description);
            return [];
        }
        return output.data.regions.map(region=> {
            return region.region_info.bounding_box;
        });
    }

}

export default App;
