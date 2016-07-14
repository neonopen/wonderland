// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import SiteHeader from '../wonderland/SiteHeader';
import URLShortenerForm from '../forms/URLShortenerForm';
import SiteFooter from '../wonderland/SiteFooter';
import Helmet from 'react-helmet';
import T from '../../modules/translation';
import UTILS from '../../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var URLShortenerPage = React.createClass({
    render: function() {
        return (
            <div>
                <Helmet
                    title={UTILS.buildPageTitle(T.get('copy.urlShortener.title'))}
                />
                <SiteHeader />
                <section className="wonderland-section section">
                    <div className="columns is-desktop">
                        <div className="column is-half is-offset-one-quarter">
                            <h1>{T.get('copy.urlShortener.heading')}</h1>
                            <div className="content">
                                <p>{T.get('copy.urlShortener.body')}</p>
                            </div>
                            <URLShortenerForm />
                        </div>
                    </div>
                </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default URLShortenerPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
