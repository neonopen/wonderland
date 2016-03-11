// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import Thumbnail from './Thumbnail';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var Thumbnails = React.createClass({
	render: function() {
		var self = this;
		return (
			<section className="section">
				<div className="columns is-multiline is-mobile">
					{
						this.props.thumbnails.map(function(thumbnail, i) {
							if (thumbnail.type != 'random' && thumbnail.type !='centerframe') {
								return (
									<div className="column is-half-mobile is-third-tablet is-quarter-desktop" key={i}>
										<Thumbnail videoStateMapping={ self.props.videoStateMapping } thumbnail={thumbnail} />
									</div>
								);
							}
							else {
								return;
							}
						})
					}
				</div>
			</section>
		);
	}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default Thumbnails;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
