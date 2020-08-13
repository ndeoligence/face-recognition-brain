import React, {Component} from 'react';
import './ImageRender.css';

class ImageRender extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        let {url, boxes} = this.props;
        let faces = this.locateFaces(boxes);
        return <div className={'ma'}>
            <div className={'image-render center mt2'}>
                <img src={url} id={'input-image'} className={'image-render'} alt={'face render'}/>
                {faces ? faces.map(quad =>
                        <div className={'bounding-box absolute'}
                             style={{top: quad.topRow, right: quad.rightCol, bottom: quad.bottomRow, left: quad.leftCol}}/>)
                    // style={{top: 501, right: 10, bottom: 10, left: 501}}/>)
                    // style={{inset: `${quad.topRow}px ${quad.rightCol}px ${quad.bottomRow}px ${quad.leftCol}px`}}/>)
                    // style={{inset: `10px 10px 10px  10px `}}/>)
                    : <></>}
            </div>
        </div>
    }

    locateFaces = (boundingBoxes)=> {
        let image = document.querySelector('#input-image');
        if (!image) return [];
        let w = Number(image.width), h = Number(image.height);
        // console.log(`Image size = ${w}x${h}`);
        return boundingBoxes.map(box=> ({
            topRow: box.top_row * h + image.offsetTop,
            leftCol: box.left_col * w + image.offsetLeft,
            bottomRow: window.innerHeight - image.offsetTop - box.bottom_row * h,
            rightCol: window.innerWidth - image.offsetLeft - box.right_col * w,
        }));
    }

}

export default ImageRender;
