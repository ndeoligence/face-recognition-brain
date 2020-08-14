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
import SignIn from "../auth/SignIn";
import Register from "../auth/Register";

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

const accounts = new Map();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null,
            boxes: [],
            route: 'login',
            currentUser: null,
        }
    }

    render() {
        let {imageUrl, route, currentUser} = this.state;
        return (
            <div className="App">
                <Particles params={particlesOptions} className={'particles'}/>
                {route === 'register'?
                <Register onSubmit={this.handleRegistration} onLoginPressed={()=> this.setRoute('login')}/> :
                route === 'home'?
                <>
                    <Navigation route={route} onNavChange={this.setRoute}/>
                    <Logo/>
                    <Rank name={currentUser.name} rank={currentUser.rank}/>
                    <ImageLinkForm onFaceDetect={ this.showPicture }/>
                    {imageUrl? <ImageRender url={imageUrl} boxes={this.state.boxes} /> : <></>}
                </> :
                <SignIn onSubmit={this.handleLogin} onRegister={()=> this.setRoute('register')}/>
                }
            </div>
        );
    }

    handleRegistration = (email, pw, name)=> {
        accounts[email] = {email: email, pw: pw, name: name, rank: 0};
        this.setRoute('login');
    }

    handleLogin = (email, pw)=> {
        console.log(`Authenticating ${email}...`);
        let user = this.getUser(email, pw);
        if (user) {
            this.login(user)
        } else {
            console.log("We don't know you. Do you wanna register?");
        }
    }

    login = (user)=> {
        this.setState({
            currentUser: (user? user : this.state.currentUser),
            route: 'home',
            imageUrl: null,
            boxes: [],
        })
    }

    getUser = (email, pw)=> {
        let user = accounts[email];
        return (user && user.pw === pw) ? user : null;
    }

    setRoute = (route)=> {
        switch (route) {
            case 'home':
                this.login(null);
                break;
            case 'login':
            case 'register':
                this.setState({route: route});
                break;
            case 'logout':
                this.setState({route: 'login', currentUser: null});
                break;
            default:
                console.log(`Unknown route: /${route}`);
        }
    }

    showPicture = (url) => {
        this.setState({imageUrl: url, boxes: []}, ()=> {
            console.log(`Doing some hectic AI stuff on image: ${url}`);
            clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, url)
                .then(json=> {
                    // console.log('Success: ', json);
                    return json;
                })
                .then(this.parseResult)
                .then(regions=> {
                    console.log(`Found ${regions.length} faces`);
                    return regions;
                })
                .then(boxes=> {
                    let {currentUser} = this.state;
                    currentUser.rank += 1;
                    return boxes;
                })
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
