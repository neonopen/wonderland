// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import SiteHeader from '../wonderland/SiteHeader';
import SiteFooter from '../wonderland/SiteFooter';
import Video from '../wonderland/Video';
import Secured from '../../mixins/Secured';
import Helmet from 'react-helmet';
import Account from '../../mixins/Account';
import AJAX from '../../mixins/AJAX';
import UTILS from '../../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var VideoPage = React.createClass({
    mixins: [Secured, Account, AJAX], // ReactDebugMixin
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes: {
        videoId: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            isServingEnabled: false
        };
    },
    componentWillMount: function() {
        var self = this;
        self.getAccount()
            .then(function (account) {
                self.setState({
                    isServingEnabled: account.isServingEnabled
                });
            })
            .catch(function (err) {
                E.raiseError(JSON.parse(err.responseText).error.message);
            });
    },
    render: function() {
        var self = this;
        return (
            <div>
                <Helmet
                    title={UTILS.buildPageTitle('Video')}
                />
                <SiteHeader />
                <section className="section">
                    <div className="container">
                        <Video
                            videoId={self.props.params.videoId}
                            pingInitial={true}
                            pingInterval={true}
                            forceOpen={true}
                            isServingEnabled={self.state.isServingEnabled}
                        />
                    </div>
                </section>
                <SiteFooter />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default VideoPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
