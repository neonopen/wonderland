// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import {ShareButtons, generateShareIcon} from 'react-share';
import UTILS from '../../modules/utils';
import E from '../../modules/errors';
import AjaxMixin from '../../mixins/Ajax';
import Account from '../../mixins/Account';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} = ShareButtons

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const LinkedinIcon = generateShareIcon('linkedin');

var ShareSection = React.createClass({
    mixins: [AjaxMixin, Account],
    propTypes: {
        shareToken: React.PropTypes.string.isRequired,
        videoId: React.PropTypes.string.isRequired,
    },
    getInitialState: function() {
        var self = this;
        return {
            mode: 'silent', // silent/loading/error/success/bonus
            shareToken: self.props.shareToken,
            videoId: self.props.videoId,
            shortUrl: '' // TODO
        }
    },
    componentWillMount: function() {
        var self = this;
        self.generateShareUrl();
    },
    render: function() {
        //the variables below are used to make the formatting consistent with the React Share package
        var self = this,
            urlToDisplay = self.determineUrl(),
            title = 'Check out this Awesome NEON IMAGE!',
            customColorBackground = {fill:'#aaa'}
        ;
        return (
            <div className='columns container'>
                <FacebookShareButton
                    onMouseEnter={self.handleMouseEnter}
                    url={urlToDisplay}
                    title={'I LOVE NEON LABS FACEBOOK !'}
                    className={'column is-3 share-section-icon-color'}
                    >
                    <FacebookIcon
                        onMouseEnter={self.handleMouseEnter}
                        iconBgStyle={customColorBackground}
                        size={32}
                        round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={urlToDisplay}
                    title={'Thanks @neon, you rock!'}
                    className={'column is-3 share-section-icon-color'}
                     >
                    <TwitterIcon
                        iconBgStyle={customColorBackground}
                        size={32}
                        round />
                </TwitterShareButton>
                <LinkedinShareButton
                    url={urlToDisplay}
                    title={"Hey friends and colleagues, check out NEON!!!"}
                    className={'column is-3 share-section-icon-color'}
                     >
                    <LinkedinIcon
                        iconBgStyle={customColorBackground}
                        size={32}
                        round />
                </LinkedinShareButton>
                <a  className="column is-3 share-section-icon-color" href={"mailto:?to=&subject=Check%20out%20this%20Neon%20Image&body="+ title + " Link: " + urlToDisplay} target="_top">
                        <div className="share-section-div-circle-svg">
                            <svg viewBox="0 0 64 64" className="share-section-circle-svg">
                                <g><circle cx="32" cy="32" r="31" style={customColorBackground}></circle></g>
                                <g><path d="M17,22v20h30V22H17z M41.1,25L32,32.1L22.9,25H41.1z M20,39V26.6l12,9.3l12-9.3V39H20z"></path></g>
                            </svg>
                    </div>
                </a>
            </div>
        )
    },
    generateShareUrl: function() {
        var self = this;
        self.getAccount()
            .then(function (account) {
                self.setState({
                    accountId: account.accountId,
                }, function() {
                        self.GET('videos/share', {
                            data: {
                                video_id: self.state.videoId
                            }
                        })
                            .then(function(json) {
                                self.setState({
                                    shareToken: json.share_token,
                                },
                                    function(){
                                        self.shortenUrlWithBitly()
                                    }
                                );
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                });
            })
            .catch(function (err) {
                console.log(err);
            });
    },
    returnLongUrl: function() {
        //return long form url for initial processing OR if bitly fails
        var self = this;
        return window.location.origin + '/share/video/' + self.state.videoId + '/account/' + self.state.accountId + '/token/' + self.state.shareToken + '/'        
    },
    shortenUrlWithBitly: function() {
        //Shorten Long form with bitly UTILITY
        var self = this
        UTILS.shortenUrl(self.returnLongUrl(), self.handleUrlCallback)
        // function below to test bitly until loginless is complete
        // UTILS.shortenUrl('https://development-app.neon-lab.com/share/video/' + self.state.videoId + '/account/' + self.state.accountId + '/token/' + self.state.shareToken + '/', self.handleUrlCallback)
    },
    handleUrlCallback: function(response) {
        //if Bitly response OK then update set state of shortURL
        var self = this;
        response.status_code === 200 && self.setState({shortUrl: response.data.url});
    },
    determineUrl: function() {
        // logic to determine if URL should be set to short or long URL 
        var self = this;
        return self.state.shortUrl !== '' ? self.state.shortUrl : self.returnLongUrl()
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default ShareSection;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
