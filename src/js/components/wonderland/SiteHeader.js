import React, {PropTypes} from 'react';
import SiteBanner from './SiteBanner';
import AccountMasqueradeBar from './AccountMasqueradeBar';
import T from '../../modules/translation';
import Sidebar from './Sidebar';

var SiteHeader = React.createClass({

    propTypes: {
        sidebarContent: PropTypes.oneOf([
            'learnMore',
            'contact',
            'signUp',
            'account',
            'primaryNavigation'
        ]),
        setSidebarContent: PropTypes.func
    },

    getInitialState() {
        return {sidebarContent: null};
    },

    getContent() {
        // Prefer the parent's sidebarContent.
        if (this.props.sidebarContent) {
            return this.props.sidebarContent;
        }
        return this.state.sidebarContent;
    },

    getContentFunction() {
        if (this.props.setSidebarContent) {
            return this.props.setSidebarContent;
        }
        const self = this;
        return (sidebarContent) => {
            self.setState({sidebarContent})
        }
    },

    render: function() {
        return (
            <div>
                <AccountMasqueradeBar />
                <SiteBanner
                    setSidebarContent={this.getContentFunction()}
                    sidebarContent={this.getContent()}
                />
                <Sidebar
                    content={this.getContent()}
                    setContent={this.getContentFunction()}
                />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default SiteHeader;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
