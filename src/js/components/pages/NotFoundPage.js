// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
import SiteHeader from '../wonderland/SiteHeader';
import SiteFooter from '../wonderland/SiteFooter';
import T from '../../modules/translation';
import Helmet from 'react-helmet';
import UTILS from '../../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var NotFoundPage = React.createClass({
    render: function() {
        var body1 = T.get('copy.notFound.body1'),
            body2 = T.get('copy.notFound.body2'),
            body3 = T.get('copy.notFound.body3', {
                '@link': UTILS.CORP_EXTERNAL_URL
            })
        ;
        return (
            <div>
                <Helmet
                    title={UTILS.buildPageTitle(T.get('copy.notFound.title'))}
                />
                <SiteHeader />
                <section className="section columns is-desktop">
                    <div className="column is-half is-offset-quarter">
                        <h1 className="title is-2">{T.get('copy.notFound.heading')}</h1>
                        <div className="content">
                            <p>{body1}</p>
                            <p><span dangerouslySetInnerHTML={{__html: body2}} /></p>
                            <p>{body3}</p>
                        </div>
                    </div>
                </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default NotFoundPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
