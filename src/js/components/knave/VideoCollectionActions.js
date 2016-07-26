// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import SESSION from '../../modules/session';
import T from '../../modules/translation';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var VideoCollectionActions = React.createClass({
    getInitialState: function() {
        return {
            isSaveHidden: false
        }
    },
    componentWillMount: function() {
        var self = this;
        SESSION.user()
            .then(function(userData) {
                if (userData.hasOwnProperty('username')) {
                    self.setState({
                        isSaveHidden: true
                    })
                }
            })
            .catch(function(err) {
                console.log(err)
            })
        ;
    },
    render: function() {
        var self = this;
        return (
            <ul className="xxCollectionActions">
                <li className="xxCollectionActions-item">
                    <a
                        data-tip={T.get('label.emailMe')}
                        data-for="staticTooltip"
                        data-place="bottom"
                        data-action-label="email"
                        onClick={self.handleClick}
                        className="xxCollectionActions-anchor xxCollectionActions-email">
                        <span>Email</span>
                    </a>
                </li>
                <li className="xxCollectionActions-item">
                    <a
                        data-tip={T.get('copy.share.main')}
                        data-for="staticTooltip"
                        data-place="bottom"
                        data-action-label="share"
                        onClick={self.handleClick}
                        className="xxCollectionActions-anchor xxCollectionActions-share">
                        <span>Share</span>
                    </a>
                </li>
                {
                    self.state.isSaveHidden ? null : (
                        <li className="xxCollectionActions-item">
                            <a
                                data-tip={T.get('action.saveMyImages')}
                                data-for="staticTooltip"
                                data-place="bottom"
                                data-action-label="save"
                                onClick={self.props.openSignUp}
                                className="xxCollectionActions-anchor xxCollectionActions-save">
                                <span>Save</span>
                            </a>
                        </li>
                    )
                }
                <li className="xxCollectionActions-item">
                    <a
                        data-tip={T.get('delete')}
                        data-for="staticTooltip"
                        data-place="bottom"
                        data-action-label="delete"
                        onClick={self.handleClick}
                        className="xxCollectionActions-anchor xxCollectionActions-delete">
                        <span>Delete</span>
                    </a>
                </li>
            </ul>
        );
    },
    handleClick: function(e) {
        var self = this;
        self.props.handleMenuChange(e);
    }
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default VideoCollectionActions

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
