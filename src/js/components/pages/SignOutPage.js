// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
import SiteHeader from '../wonderland/SiteHeader';
import SiteFooter from '../wonderland/SiteFooter';
import SESSION from '../../modules/session';
import T from '../../modules/translation';
import Secured from '../../mixins/secured';
import Helmet from 'react-helmet';
import UTILS from '../../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var SignOutPage = React.createClass({
    mixins: [ Secured ],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    componentWillMount: function() {
        SESSION.end();
    },
    render: function() {
        return (
            <div>
                <Helmet
                    title={UTILS.buildPageTitle('Sign Out')}
                />
                <SiteHeader />
                    <section className="section">
                        <div className="container">
                            TODO - {T.get('signOutSuccess')}
                        </div>
                    </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default SignOutPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
