import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const BackButton = () => {
    const history = useHistory();
    return (
        <FeatherIcon icon="chevron-left" onClick={() => history.goBack()} className={"cursor-pointer"} />
    )
}

export default BackButton