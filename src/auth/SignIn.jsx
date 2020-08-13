import React, {Component} from 'react';

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pw: ''
        }
    }

    handleSubmit = (event)=> {
        event.preventDefault();
        let {onSubmit} = this.props;
        let {email, pw} = this.state;
        if (!email) return;
        onSubmit(email, pw);
        this.setState({email: '', pw: ''});
    }

    handleRegister = event=> {
        event.preventDefault();
        let {onRegister} = this.props;
        onRegister();
    }

    render = () => {
        return <article className="br3 ba b--black-10 mv7-l mv4-m w-100 w-50-m w-25-l mw6 center shadow-5">
            <main className="pa4 black-80">
                <form className="measure" onSubmit={this.handleSubmit}>
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0 center">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                   type="email" name="email-address" id="email-address"
                                   value={this.state.email}
                                   onChange={event=> this.setState({email: event.target.value})}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                   type="password" name="password" id="password"
                                   value={this.state.pw}
                                   onChange={event => this.setState({pw: event.target.value})} />
                        </div>
                        {/*<label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> Remember me</label>*/}
                    </fieldset>
                    <div className="">
                        <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                               type="submit" value="Sign in"/>
                    </div>
                    <div className="lh-copy mt3">
                        <a href="#" className="f6 link dim black db" onClick={this.handleRegister}>Register</a>
                        {/*<a href="#0" className="f6 link dim black db">Forgot your password?</a>*/}
                    </div>
                </form>
            </main>
        </article>;
    }

}


export default SignIn;
