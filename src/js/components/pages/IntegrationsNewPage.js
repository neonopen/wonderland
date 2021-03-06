// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import SiteHeader from '../wonderland/SiteHeader';
import SiteFooter from '../wonderland/SiteFooter';
import Secured from '../../mixins/Secured';
import Helmet from 'react-helmet';
import UTILS from '../../modules/utils';
import T from '../../modules/translation';
import Icon from '../core/Icon';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var IntegrationsNewPage = React.createClass({
    mixins: [Secured],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    addBrightcove: function () {
        this.context.router.push(UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE.URL);
    },
    render: function() {
        return (
            <div>
                <Helmet
                    title={UTILS.buildPageTitle(T.get('copy.plugins.new.title'))}
                />
                <SiteHeader />
                <section className="wonderland-section section">
                    <div className="container">
                        <h1>{T.get('copy.plugins.new.heading')}</h1>
                        <div className="content">
                            {T.get('copy.plugins.new.body')}
                        </div>
                        <div className="columns">
                            <div className="card column is-one-third">
                                <div className="card-content">
                                    <img src={T.get('copy.plugins.types.brightcove.img')} />
                                    <div>
                                        <a className="button is-primary is-medium" onClick={this.addBrightcove}>
                                            <Icon type="plus-circle" />
                                            {T.get('add')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default IntegrationsNewPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
