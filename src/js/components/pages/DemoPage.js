// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import AjaxMixin from '../../mixins/Ajax';
import UTILS from '../../modules/utils';
import SESSION from '../../modules/session';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var DemoPage = React.createClass({
    mixins: [AjaxMixin],

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    componentWillMount: function() {
        var self = this;
        if (SESSION.active()) {
            self.context.router.replace(UTILS.DRY_NAV.ONBOARDING_VIDEO_UPLOAD.URL);
        } else {
            self.POST('accounts', {
                host: CONFIG.AUTH_HOST
            })
            .then(function (res) {
                SESSION.set(res.access_token, res.refresh_token, res.account_ids[0]);

                self.context.router.replace(UTILS.DRY_NAV.ONBOARDING_VIDEO_UPLOAD.URL);
            })
            .catch(function (err) {
                // TODO: Error result?
                self.context.router.push(UTILS.DRY_NAV.DASHBOARD.URL);
            });
        }
    },

    render: function() {
        return false;
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default DemoPage;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
