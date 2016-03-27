// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
import SiteHeader from '../lookingglass/SiteHeader';
import SiteFooter from '../lookingglass/SiteFooter';
import SignInForm from '../lookingglass/SignInForm';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var SignInPage = React.createClass({
    render: function() {
        return (
            <div>
                <SiteHeader />
                <section className="section columns">
                    <div className="column is-half is-offset-quarter">
                        <SignInForm />
                    </div>
                </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default SignInPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
