// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import DragDropComponent from '../forms/DragDropComponent';
import DropBoxHolder from './DropBoxHolder';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var ImageUpload = React.createClass({
    render: function() {
        var self = this;
        return (
            <div className="box Drop-Container">
                <p className="subtitle is-3">Photo Source</p>
                <DropBoxHolder />
                <DragDropComponent />
            </div>
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default ImageUpload;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
