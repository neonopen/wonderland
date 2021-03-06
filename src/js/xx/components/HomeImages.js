// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// animation requires 9 images since it's finely tuned for specific
// timings which would need to be re-worked

var images = [
    '/img/xx/temporary/thumbnail-5.jpg',
    '/img/xx/temporary/thumbnail-4.jpg',
    '/img/xx/temporary/thumbnail-3.jpg',
    '/img/xx/temporary/thumbnail-5.jpg',
    '/img/xx/temporary/thumbnail-4.jpg',
    '/img/xx/temporary/thumbnail-5.jpg',
    '/img/xx/temporary/thumbnail-5.jpg',
    '/img/xx/temporary/thumbnail-3.jpg',
    '/img/xx/temporary/thumbnail-4.jpg',
];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default () => (
    <div className="xxHomeImages">
        <div className="xxHomeImages-inner">
            {
                images.map((image, index) => (
                    <img src={image} className="xxHomeImages-image" key={index} />
                ))
            }
        </div>
    </div>
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
