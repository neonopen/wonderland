// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
import UTILS from '../../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var Xylophone = React.createClass({
    render: function() {
        var sortedThumbnails = this.props.thumbnails.sort(function(a, b) {
            return (b.neon_score === '?' ? 0 : b.neon_score) - (a.neon_score === '?' ? 0 : a.neon_score);
        });
        return (
            <div className="wonderland-xylophone">
                <div
                    className="wonderland-xylophone__slot is-dummy"
                >
                    <div
                        style={{'height': '100%'}}
                        key="dummy"
                        className="wonderland-xylophone__bar is-dummy">
                    </div>
                </div>
                {
                    sortedThumbnails.map(function(thumbnail, i) {
                        if (thumbnail.type != 'random' && thumbnail.type !='centerframe') {
                            var neonScoreData = UTILS.getNeonScoreData(thumbnail.neon_score),
                                inlineStyle = {'height': neonScoreData.neonScore + '%'}
                            ;
                            var rating;
                            // 0 - 59 : red
                            // 60 - 84 : yellow
                            // 85 - 99 : green
                            if (neonScoreData.neonScore < 60) {
                                rating = 'bad';
                            }
                            else if (neonScoreData.neonScore < 85) {
                                rating = 'ok';
                            }
                            else {
                                rating = 'good';
                            }
                            var className = 'wonderland-xylophone__bar is-' + rating + (thumbnail.enabled ? '' : ' is-disabled');
                            return (
                                <div
                                    className="wonderland-xylophone__slot"
                                    key={thumbnail.thumbnail_id}
                                >
                                    <div
                                        style={inlineStyle}
                                        className={className}
                                        title={'Neonscore of ' + neonScoreData.neonScore}
                                    >
                                    </div>
                                </div>
                            );
                        }
                        else {
                            return false;
                        }
                    })
                }
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default Xylophone;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
