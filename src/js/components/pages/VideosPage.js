// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
import Helmet from 'react-helmet';
import UTILS from '../../modules/utils';
import SiteHeader from '../wonderland/SiteHeader';
import SiteFooter from '../wonderland/SiteFooter';
import Videos from '../wonderland/Videos';
import Account from '../../mixins/Account';
import Secured from '../../mixins/secured';
import T from '../../modules/translation';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var VideosPage = React.createClass({
    mixins: [Secured, Account],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render: function() {
        var self = this,
            heading = T.get('copy.videosPage.heading'),
            body = T.get('copy.videosPage.body', {
                // '@username': 'TODO'
            })
        ;
        return (
            <div>
                <Helmet
                    title={UTILS.buildPageTitle(T.get('copy.videosPage.title'))}
                />
                <SiteHeader />
                <section className="section">
                    <div className="container">
                        <h1 className="title is-2">{heading}</h1>
                        <div className="content">
                            {body}
                        </div>
                        <Videos
                            isAccountServingEnabled={self.state.isAccountServingEnabled}
                        />
                    </div>
                </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default VideosPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
