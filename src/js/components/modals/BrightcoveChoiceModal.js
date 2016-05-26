// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import AjaxMixin from '../../mixins/Ajax';
import UTILS from '../../modules/utils';
import T from '../../modules/translation';
import E from '../../modules/errors';
import Account from '../../mixins/Account';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var BrightcoveChoiceModal = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render: function() {
        var self = this;
        return (
            <section className="box wonderland-box is-desktop">
                <h1 className="title is-4">
                    Which type of Brightcove account do you have?
                </h1>
                <div className={'box wonderland-brick'} onClick={self.handleGalleryClick}>
                    <img src="/img/gallerylogo.png" alt="" title=""  />
                </div>
                <div className={'box wonderland-brick'} onClick={self.handleBrightcoveClick}>
                    <img src="/img/videocloudlogo.png" alt="" title="" />
                </div>
            </section>
        );
    },
    handleGalleryClick: function() {
        var self = this;
        self.context.router.push( UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE.URL + 'gallery/');
    },
    handleBrightcoveClick: function() {
        var self = this;
        self.context.router.push(UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE.URL + 'videocloud/');
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default BrightcoveChoiceModal;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
