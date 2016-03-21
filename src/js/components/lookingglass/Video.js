// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import Thumbnails from './Thumbnails';
import Notification from './Notification';
import UTILS from '../../utils';
import AJAX from '../../ajax';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var Video = React.createClass({
	getInitialState: function() {
		return {
			thumbnails: [],
			accessToken: '',
			refreshToken: '',
			videoId: this.props.params.videoId,
			status: 200,
			message: '',
			videoState: 'unknown',
			videoStateMapping: UTILS.VIDEO_STATE['unknown'].mapping,
			title: '',
			duration: 0,
			url: '',
			error: '',
			publishDate: '',
			created: '',
			updated: '',
			intervalId: '',
			mode: 'silent' // silent/loading/error
		}
	},
	checkStatus: function() {
		var self = this,
        options = {
          data: {
            video_id: self.state.videoId,
            fields: [ 'title', 'publish_date', 'created', 'updated', 'duration', 'state', 'url', 'thumbnails' ]
          }
        };

		self.setState({
			mode: 'loading'
		});

    AJAX.doGet('videos', options)
      .then(function(json) {
        var video = json.videos[0];
        if ((video.state === 'serving' && self.state.videoState == 'serving') 
            || (video.state === 'failed' && self.state.videoState == 'failed')) {
          clearInterval(self.state.intervalId);
          self.setState({
            mode: 'silent',
            intervalId: ''
          });
          return;
        }
        if (video.state !== self.state.videoState) {
          // Only bother if the state has changed
          var newThumbnails = video.thumbnails.map(function (t) {
            var neonScoreData = UTILS.getNeonScoreData(t.neon_score),
                newT = {
                  url: t.url,
                  rawNeonScore: t.neon_score,
                  cookedNeonScore: neonScoreData.neonScore,
                  emoji: neonScoreData.emoji,
                  enabled: t.enabled,
                  type: t.type
                };
            return newT;
          });
          newThumbnails.sort(function (a, b) {
            return (b.cookedNeonScore === '?' ? 0 : b.cookedNeonScore) - (a.cookedNeonScore === '?' ? 0 : a.cookedNeonScore);
          });
          self.setState({
            thumbnails: newThumbnails,
            videoState: video.state,
            videoStateMapping: UTILS.VIDEO_STATE[video.state].mapping,
            title: video.title,
            duration: video.duration,
            url: video.url,
            error: video.error ? video.error : '',
            publishDate: video.publish_date,
            created: video.created,
            updated: video.updated,
            mode: 'silent'
          });
        } else {
          self.setState({
            mode: 'silent'
          });
        }
      })
      .catch(function(ex) {
        console.log(ex.message);
        clearInterval(self.state.intervalId);
        self.setState({
          status: 404,
          message: ex.message,
          intervalId: ''
        });
      });
	},
	componentDidMount: function() {
		var self = this,
			intervalId = setInterval(self.checkStatus, 10000)
		;
		setTimeout(self.checkStatus, 0);
		self.setState({
			intervalId: intervalId
		});
	},
	render: function() {
		if (this.state.status === 401) {
			return (
				<section className="section">
					<div className="container">
						<h1 className="title">Video ID: { this.props.params.videoId }</h1>
						<div className="message is-danger">
							<div className="message-header">
								Unable to login
							</div>
							<div className="message-body">
								{ this.state.message }
							</div>
						</div>
					</div>
				</section>
			);
		}
		if (this.state.status === 404) {
			return (
				<section className="section">
					<div className="container">
						<h1 className="title">Video ID: { this.props.params.videoId }</h1>
						<div className="message is-warning">
							<div className="message-header">
								Not Found
							</div>
							<div className="message-body">
								{ this.state.message }
							</div>
						</div>
					</div>
				</section>
			);
		}
		if (this.state.status === 200) {
			var additionalClass = 'button is-' + this.state.videoStateMapping + ' is-medium is-' + this.state.mode,
				displayTitle = this.state.title || this.state.videoId,
				notificationNeeded = this.state.error == '' ? '' : <Notification message={ this.state.error } />
			;
			return (
				<section className="section">
					<div className="container">
						<nav className="navbar">
							<div className="navbar-left">
								<div className="navbar-item">
									<button className={ additionalClass }>{ this.state.videoState }</button>
								</div>
								<div className="navbar-item">
									<h2 className="title is-3">{ displayTitle }</h2>
								</div>
							</div>
							<div className="navbar-right">
								<div className="navbar-item">
									<span className="tag is-medium">ID: { this.state.videoId }</span>
								</div>
								<div className="navbar-item">
									<span className="tag is-medium">Time: { Math.floor(this.state.duration) }<abbr title="seconds">s</abbr></span>
								</div>
							</div>
						</nav>
						<div className="navbar-item">
							<span className="tag is-medium">Publish Date: { this.state.publishDate }</span>
						</div>
						<div className="navbar-item">
							<span className="tag is-medium">Created: { this.state.created }</span>
						</div>
						<div className="navbar-item">
							<span className="tag is-medium">Updated: { this.state.updated }</span>
						</div>
						<div><span className="tag is-medium">URL: { this.state.url }</span></div>
						{ notificationNeeded }
						<Thumbnails videoStateMapping={ this.state.videoStateMapping } thumbnails={ this.state.thumbnails } />
					</div>
				</section>
			);
		}
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default Video;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
