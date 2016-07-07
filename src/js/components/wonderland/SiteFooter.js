// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import T from '../../modules/translation';
import UTILS from '../../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var SiteFooter = React.createClass({
    // mixins: [ReactDebugMixin],
    render: function() {
        return (
            <footer className="Footer">
                <p>
                    {T.get('copy.copyright', {'@name': T.get('app.companyLongName')})} 
                    <a className="xxNav-anchor" href={UTILS.DRY_NAV.TERMS.URL} content="terms"> {T.get('nav.terms')}</a>
                </p>
            </footer>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default SiteFooter;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
