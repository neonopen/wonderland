// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import SESSION from '../../modules/session';
import E from '../../modules/errors';
import AJAX from '../../modules/ajax';
import Message from '../wonderland/Message';
import SaveButton from '../buttons/SaveButton';
import T from '../../modules/translation';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

var UserSettingsTab2 = React.createClass({
    // mixins: [ReactDebugMixin],
    getInitialState: function() {
        var self = this;
        return {
            isLoading: true,
            username: '',
            firstName: '',
            lastName: '',
            title: ''
        }  
    },
    componentWillMount: function() {
        var self = this;
        SESSION.user()
            .then(function(userData) {
                self.setState({
                    isLoading: false,
                    username: userData.username,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    title: userData.title
                })
            })
            .catch(function(err) {
                self.setState({
                    isLoading: false
                })
            })
        ;
    },
    componentDidMount: function() {
        var self = this;
        self._isSubmitted = false;
        self._isMounted = true;
    },
    componentWillUnmount: function() {
        var self = this;
        self._isMounted = false;
        E.clearErrors();
    },
    handleSubmit: function(e) {
        var self = this;
        e.preventDefault();
        if (!self._isSubmitted) {
            self._isSubmitted = true; 
            if (self._isMounted) {
                self.setState({
                    isLoading: true
                }, self.doSubmit);
            }
        }
    },
    doSubmit: function() {
        var self = this,
            options = {
                data: {
                    username: self.state.username,
                    first_name: self.state.firstName,
                    last_name: self.state.lastName,
                    title: self.state.title
                }
            }
        ;
        E.clearErrors();
        AJAX.doPut('users', options)
            .then(function(json) {
                SESSION.user(json);
                if (self._isMounted) {
                    self.setState({
                        isLoading: false
                    }, function() {
                        self._isSubmitted = false;
                    });
                }
            })
            .catch(function(err) {
                E.raiseError(JSON.parse(err.responseText).error.message);
                if (self._isMounted) {
                    self.setState({
                        isLoading: false
                    }, function() {
                        self._isSubmitted = false;
                    });
                }
            })
        ;
    },
    handleChangeFirstName(e) {
        var self = this;
        self.setState({
            firstName: e.target.value
        })
    },
    handleChangeLastName(e) {
        var self = this;
        self.setState({
            lastName: e.target.value
        })
    },
    handleChangeTitle(e) {
        var self = this;
        self.setState({
            title: e.target.value
        })
    },
    render: function() {
        var self = this,
            messageNeeded = E.getErrorsCount() ? <Message header={'User Settings'} body={E.getErrors()} flavour="danger" /> : ''
        ;
        return (
            <form onSubmit={self.handleSubmit}>
                <fieldset>
                    <label className="label">{T.get('label.firstName')}</label>
                    <p className={'control' + (self.state.isLoading ? ' is-disabled is-loading' : '')}>
                        <input
                            ref="firstName"
                            className={'input'}
                            type="text"
                            value={self.state.firstName}
                            disabled={self.state.isLoading ? 'disabled' : ''}
                            onChange={self.handleChangeFirstName}
                        />
                    </p>
                    <label className="label">{T.get('label.lastName')}</label>
                    <p className={'control' + (self.state.isLoading ? ' is-disabled is-loading' : '')}>
                        <input
                            ref="lastName"
                            className={'input'}
                            type="text"
                            value={self.state.lastName}
                            disabled={self.state.isLoading ? 'disabled' : ''}
                            onChange={self.handleChangeLastName}
                        />
                    </p>
                    <label className="label">{T.get('label.title')}</label>
                    <p className={'control' + (self.state.isLoading ? ' is-disabled is-loading' : '')}>
                        <input
                            ref="title"
                            className={'input'}
                            type="text"
                            value={self.state.title}
                            disabled={self.state.isLoading ? 'disabled' : ''}
                            onChange={self.handleChangeTitle}
                        />
                    </p>
                    <p className="has-text-centered">
                        <SaveButton
                            isLoading={self.state.isLoading}
                        />
                    </p>
                </fieldset>
            </form>
        )
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

export default UserSettingsTab2;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
