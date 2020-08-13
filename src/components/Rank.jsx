import React from 'react';

const Rank = ({name, rank})=> {
    return <>
        <div className={'white f3'}>{`${name}, you are ranked #${rank}`}</div>
    </>;
}

export default Rank;
