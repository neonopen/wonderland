// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import AJAX from '../../modules/ajax';
import UTILS from '../../modules/utils';
import TRACKING from '../../modules/tracking';
import T from '../../modules/translation';
import ModalWrapper from '../core/ModalWrapper';
import Message from '../wonderland/Message';
import TutorialPanels from '../wonderland/TutorialPanels';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var AnalyzeVideoForm = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getDefaultProps: function() {
        postHook: React.PropTypes.func
    },
    getInitialState: function() {
        var self = this;
        return {
            accessToken: '',
            refreshToken: '',
            mode: 'silent', // silent/loading/error
            url: '',
            isModalActive: false,
            // currentVideoCount: self.props.currentVideoCount,
            maxVideoCount: self.props.maxVideoCount,
            //left at zero to demonstrate that it works
            currentVideoCount: 0, // TODO
            maxVideoCount: 10 // TODO
        };
    },
    render: function() {
        var self = this,
            tutorialComponent,
            panels = {
                'youtube-play': T.get('copy.analyzeVideoPanel.panel.1'),
                'files-o': T.get('copy.analyzeVideoPanel.panel.2'),
                'upload': T.get('copy.analyzeVideoPanel.panel.3'),
                'eye': T.get('copy.analyzeVideoPanel.panel.4')
            }
        ;
        if (self.state.currentVideoCount >= self.state.maxVideoCount) {
            return (
                <Message header={T.get('copy.analyzeVideo.heading')} body={T.get('copy.analyzeVideo.maxLimitHit', {
                    '%limit': self.state.maxVideoCount
                })} flavour="danger" />
            );
        }
        else {
            if (self.state.mode === 'loading') {
                var buttonClassName = 'button is-primary is-medium is-disabled is-loading',
                    inputClassName = 'input is-medium is-disabled'
                ;
            }
            else if (!self.state.url && self.state.mode === 'silent') {
                var buttonClassName = 'button is-medium is-primary is-disabled',
                    inputClassName = 'input is-medium'
            }
            else {
                var buttonClassName = 'button is-medium is-primary',
                    inputClassName = 'input is-medium'
                ;
            }
            tutorialComponent = self.state.currentVideoCount === 0 ? <TutorialPanels panels={panels}/> : '';
            return (
                <div>
                    {tutorialComponent}
                    <form onSubmit={self.handleSubmit}>
                        <fieldset>
                            <legend className="subtitle is-5">{T.get('copy.analyzeVideo.heading')}</legend>
                            <p className="control is-grouped">
                                <input required className={inputClassName} type="url" ref="url"  onChange={self.handleChangeUrl} value={self.state.url} placeholder={T.get('analyze.addVideoUrl')} />
                            </p>
                            <p className="control">
                                <input className={inputClassName} type="text" ref="title" placeholder={T.get('analyze.optionalTitle')} />
                            </p>
                            <p className="is-text-centered">
                                <button className={buttonClassName} type="submit">{T.get('analyze')}</button>
                            </p>
                        </fieldset>
                    </form>
                </div>
            );
        }

    },
    handleChangeUrl: function(e) {
        this.setState({
            url: e.target.value
        });
    },
    handleSubmit: function (e) {
        var url = this.refs.url.value.trim();
        e.preventDefault();
        TRACKING.sendEvent(this, arguments, url);
        this.analyzeVideo(UTILS.dropboxUrlFilter(url), this.refs.title.value.trim());
    },
    analyzeVideo: function (url, title) {
        var self = this,
            videoId = UTILS.generateId(),
            options = {
                data: {
                    external_video_ref: videoId,
                    url: UTILS.properEncodeURI(url),
                    title: title
                }
            }
        ;
        AJAX.doPost('videos', options)
            .then(function(json) {
                if (self.props.postHook) {
                    self.props.postHook();
                }
                else {
                    self.context.router.push('/video/' + videoId + '/');
                }
            })
            .catch(function(err) {
                console.error(err.responseText);
                if (self.props.postHook) {
                    self.props.postHook();
                }
                else {
                    self.context.router.push('/video/' + videoId + '/');
                }
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default AnalyzeVideoForm;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
