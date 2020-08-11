import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ()=> (
    <>
        <p>{'We will detect faces in your pictures. Give it a try!'}</p>
        <div className={'center'}>
            <div className={'pa4 br3 shadow-5 form center'}>
                <input className={'f4 pa2 w-70 center'} type={'text'} placeholder={'Enter image URL'}/>
                <button className={'w-30 grow f4 link ph3 pv2 dib white bg-light-purple'}>Detect</button>
            </div>
        </div>
    </>
);

export default ImageLinkForm;
