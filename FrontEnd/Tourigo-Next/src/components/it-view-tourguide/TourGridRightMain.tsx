// TourGridRightMain.tsx

import React from 'react';
import TourGridRight from './TourGridRightTourGuide';
import Breadcrumb from '../common/breadcrumb/BreadCrumb';


const TourGridRightMain = () => {
    return (
        <>
            <Breadcrumb titleOne='Upcoming Itineraries' titleTwo='Explore upcoming itineraries' />
            
            <TourGridRight />
        </>
    );
};

export default TourGridRightMain;