// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
import SiteHeader from '../lookingglass/SiteHeader';
import SiteFooter from '../lookingglass/SiteFooter';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var HomePage = React.createClass({
    render: function() {
        return (
            <div>
                <SiteHeader />
                    <section className="section">
                        <div className="container">
                            TODO
                        </div>
                    </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default HomePage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
