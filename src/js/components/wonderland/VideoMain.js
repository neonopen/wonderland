// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import Thumbnails from './Thumbnails';
import VideoInfoBox from './VideoInfoBox';
import VideoSharer from './VideoSharer';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var VideoMain = React.createClass({
    // mixins: [ReactDebugMixin],
    propTypes: {
        isGuest: React.PropTypes.bool.isRequired,
        accountId: React.PropTypes.string,
        videoId: React.PropTypes.string.isRequired,
        forceOpen: React.PropTypes.bool.isRequired,
        messageNeededComponent: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool, React.PropTypes.object]).isRequired,
        thumbnails: React.PropTypes.array.isRequired,
        videoState: React.PropTypes.string.isRequired,
        videoLink: React.PropTypes.string,
        duration: React.PropTypes.number.isRequired,
        url: React.PropTypes.string.isRequired,
        created: React.PropTypes.string,
        isServingEnabled: React.PropTypes.bool.isRequired,
        shareToken: React.PropTypes.string.isRequired,
        experimentState: React.PropTypes.string,
        winnerThumbnail: React.PropTypes.string
    },
    render: function() {
        var self = this,
            additionalClass = self.props.forceOpen ? 'is-shown' : 'is-hidden'
        ;
        return (
            <div className={additionalClass}>
                <br />
                <div className="columns is-desktop">
                    <div className="column is-12-mobile is-10-desktop">
                        {self.props.messageNeededComponent}
                        <Thumbnails
                            isGuest={self.props.isGuest}
                            thumbnails={self.props.thumbnails}
                            videoState={self.props.videoState}
                            forceOpen={self.props.forceOpen}
                            isServingEnabled={self.props.isServingEnabled}
                            videoId={self.props.videoId}
                        />
                    </div>
                    <aside className="column is-12-mobile is-2-desktop">
                        <VideoInfoBox
                            isGuest={self.props.isGuest}
                            videoLink={self.props.videoLink}
                            duration={self.props.duration}
                            url={self.props.url}
                            experimentState={self.props.experimentState}
                            winnerThumbnail={self.props.winnerThumbnail}
                            shareToken={self.props.shareToken}
                            videoId={self.props.videoId}
                            accountId={self.props.accountId}
                        />
                        <VideoSharer
                            isGuest={self.props.isGuest}
                            shareToken={self.props.shareToken}
                            videoId={self.props.videoId}
                            accountId={self.props.accountId}
                        />
                    </aside>
                </div>
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default VideoMain;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
