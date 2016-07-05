// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import UTILS from '../../modules/utils';
import T from '../../modules/translation';
import Lift from './Lift';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var VideoInfo = React.createClass({
    render: function() {
        var self = this;
        return (
            <div>
                <h1 className="xxCollection-title">
                    {self.props.title}
                </h1>
                <a className="xxCollectionFilterToggle"
                    data-action-label="refilter"
                    onClick={self.props.handleMenuChange} >
                    <span>Refilter</span>
                </a>
                <div className="xxCollectionFilters has-dropdown">
                    <strong className="xxCollectionFilters-title">Filters</strong>
                    <span className="xxCollectionFilters-value">None</span>
                </div>
                <Lift/>
            </div>
        );
    }
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default VideoInfo

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -