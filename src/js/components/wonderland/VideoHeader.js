// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
import TimeAgoWrapper from '../core/TimeAgoWrapper';
import T from '../../modules/translation';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var VideoHeader = React.createClass({
    propTypes: {
        handleToggle: React.PropTypes.func.isRequired,
        forceOpen: React.PropTypes.bool.isRequired,
        title: React.PropTypes.string,
        videoId: React.PropTypes.string.isRequired
    },
    handleToggle: function(e) {
        var self = this;
        e.preventDefault();
        self.props.handleToggle();
    },
    render: function() {
        var self = this,
            toggleButtonContent = self.props.forceOpen ? <i className="fa fa-chevron-down"></i> : <i className="fa fa-chevron-up"></i>,
            toggleButton = <a className="button" onClick={self.handleToggle}>{toggleButtonContent}</a>, 
            title = '',
            videoTranslatedState = T.get('copy.' + self.props.videoState + 'State'),
            displayTitle = self.props.title || self.props.videoId
        ;
        if (self.props.forceOpen) {
            title = displayTitle;
        }
        else {
            title = <a href={self.props.videoLink}>{displayTitle}</a>;
        }
        return (
            <nav className="navbar is-marginless">
                <div className="navbar-left">
                    <div className="navbar-item">
                        <a className={self.props.additionalClass} title={self.props.videoState}>
                            {videoTranslatedState}
                        </a>
                    </div>
                    <div className="navbar-item">
                        <h2 className="title is-5" title={self.props.videoId}>{title}</h2>
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="navbar-item">
                        <span className="subtitle is-6"><TimeAgoWrapper date={self.props.created} /></span>
                    </div>
                    <div className="navbar-item">
                        {toggleButton}
                    </div>
                </div>
            </nav>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default VideoHeader;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
