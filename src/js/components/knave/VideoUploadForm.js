// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import AjaxMixin from '../../mixins/Ajax';
import UTILS from '../../modules/utils';
import T from '../../modules/translation';
import TRACKING from '../../modules/tracking';
import Account from '../../mixins/Account';
import cookie from 'react-cookie';
import VideoUploadOverlay from './VideoUploadOverlay';
import OverLayMessage from './OverLayMessage';
import SESSION from '../../modules/session';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var VideoUploadForm = React.createClass({
    mixins: [AjaxMixin, Account],
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getDefaultProps: function() {
        return {
            isOnboarding: false,
            videoCountServed: 0
        }
    },
    getInitialState: function() {
        var self = this;
        return {
            isOpen: false,
            error: null,
            isOpenMessage: false
        };
    },
    toggleOpen: function(e) {
        var self = this;
        e.preventDefault();
        self.setState({
            isOpen: !self.state.isOpen,
            error: null
        });
    },
    handleClose: function(e) {
        var self = this;
        e.preventDefault();
        self.setState({
            isOpen: false
        });
    },
    handleUpload: function(url) {
        var self = this;
        self.setState({
            isOpen: false,
            error: false,
            isOpenMessage: false
        }, function() {
            self.sendVideoUrl(url)
        });
    },
    sendVideoUrl: function(url) {
        var self = this,
            videoId = UTILS.generateId(),
            options = {
                data: {
                    external_video_ref: videoId,
                    url: UTILS.properEncodeURI(UTILS.dropboxUrlFilter(url)),
                }
            }
        ;
        if (!UTILS.validateUrl(url)) {
            self.setState({
                isOpen: true,
                error: T.get('copy.urlShortener.messageBody')
            });
        }
        else {
            self.POST('videos', options)
                .then(function(json) {
                    // if the a video is uploaded past the first page(greate than 1)
                    if (self.props.currentPage > 1) {
                        //we use the newsearch function in videos to adjust the page 
                        // 1 minus by the current page 
                        self.props.handleNewSearch('?', 1 - self.props.currentPage)
                    }
                    else if (self.props.postHookAnalysis) {
                        SESSION.setProcessing(json);
                        self.props.postHookAnalysis(json);
                    }
                    else {
                        if (self.props.postHookSearch) {
                            self.props.postHookSearch();
                        }
                        else {
                            self.context.router.push('/video/' + videoId + '/');
                        }
                    }
                })
                .catch(function(err) {
                    self.throwUploadError(err)
                });    
        }
        TRACKING.sendEvent(self, arguments, self.props.isOnboarding);
    },
    throwUploadError: function(err) {
        var self = this;
        switch(err.code) {
            case 401:
                self.context.router.replace(UTILS.DRY_NAV.SIGNIN.URL);
                break;
            case 402:
                self.setState({
                    isOpenMessage: true,
                });
                break;
            default:
                self.setState({
                    isOpen: true,
                    error: T.get('copy.onboarding.uploadErrorText')
                });
        }
    },
    render: function() {
        const { isOnboarding } = this.props;
        var self = this,
            className = ['xxUpload']
        ;
        if (self.state.isOpen) {
            className.push('is-open');
        };
        return (
            <div className={className.join(' ')}>
                    <OverLayMessage 
                        message={T.get('error.unpaidAccountLimit')}
                        messageFunction={self.props.openSignUp}
                        isOpenMessage={self.state.isOpenMessage}
                        type="limit"
                    />
                <a
                    className="xxUploadButton"
                    title={T.get('action.analyze')}
                    onClick={self.toggleOpen}
                >{T.get('action.analyze')}</a>
                {
                    self.state.isOpen ? (
                        <div className="xxOverlay xxOverlay--light">
                            <VideoUploadOverlay
                                handleUpload={self.handleUpload}
                                handleClose={self.handleClose}
                                isOnboarding={isOnboarding}
                                error={self.state.error || null}
                            />
                        </div>
                    ) : null
                }
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default VideoUploadForm;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
