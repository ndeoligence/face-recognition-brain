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

const backend = {url: 'http://localhost:3001'};

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
        this.post('/register', {email: email, pw: pw, name: name, rank: 0})
            .then(json=> {
                if (json.error) {
                    console.log('User registration failed:', json.error);
                    this.setRoute('register');
                } else {
                    console.log('Account registered:', json.user);
                    this.setRoute('login');
                }
            });
    }

    handleLogin = (email, pw)=> {
        console.log(`Authenticating ${email}...`);
        this.put('/login', {email: email, password: pw})
            .then(json=> {
                if (json.error) {
                    console.log("Login failed");
                } else {
                    if (!json.user) {
                        console.log("Something went wrong");
                        return;
                    }
                    this.login(json.user)
                }
            })
    }

    login = (user)=> {
        this.setState({
            currentUser: (user? user : this.state.currentUser),
            route: 'home',
            imageUrl: null,
            boxes: [],
        })
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
                .then(boxes=> this.setState({boxes: boxes}))
                .then(_=> {
                    this.put('/image', {user: this.state.currentUser, url: url})
                        .then(resp=> {
                            if (!resp.error) {
                                this.setState({currentUser: resp.user})
                            }
                        });
                })
                .catch(reason=> {
                    console.log(`Fail: ${reason}`);
                    this.setState({imageUrl: null});
                });
        });
    }

    parseResult = (json)=> {
        let output = json.outputs[0]
        if (output.status.code !== 10_000) {
            console.log(`API Error (${output.status.code}): `, output.status.description);
            return [];
        }
        let regions = output.data.regions;
        return regions? output.data.regions.map(region=> {
            return region.region_info.bounding_box;
        }): [];
    }

    post = async function(route, data = {}) {
        console.log('debug: POST ', route);
        let resp = await fetch(`${backend.url}${route}`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        return resp.json();
    }

    put = async function(route, data = {}) {
        console.log('debug: PUT ', route);
        let resp = await fetch(`${backend.url}${route}`, {
            method: 'PUT',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            referrerPolicy: 'same-origin',
            body: JSON.stringify(data),
        });
        return resp.json();
    }

}

export default App;
