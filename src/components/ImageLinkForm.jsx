import React, {Component} from 'react';
import './ImageLinkForm.css';

class ImageLinkForm extends Component {
    constructor(props) {
        super(props);
        this.state = {url: ''};
    }

    handleUrlInput = (event)=> {
        this.setState({url: event.target.value});
    }

    onDetectPress = (_)=> {
        let {onFaceDetect} = this.props;
        onFaceDetect(this.state.url);
    }

    render() {
        return (
            <>
                <p>{'We will detect faces in your pictures. Give it a try!'}</p>
                <div className={'center'}>
                    <div className={'pa4 br3 shadow-5 form center'}>
                        <input className={'f4 pa2 w-70 center'} type={'text'} placeholder={'Enter image URL'}
                                value={this.state.url} onChange={this.handleUrlInput}/>
                        <button className={'w-30 grow f4 link ph3 pv2 dib white bg-light-purple'}
                                onClick={this.onDetectPress}>Detect</button>
                    </div>
                </div>
            </>
        );
    }
}

export default ImageLinkForm;
