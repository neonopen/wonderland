// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import Message from './Message';
import AjaxMixin from '../../mixins/Ajax';
import UTILS from '../../modules/utils';
import T from '../../modules/translation';
import E from '../../modules/errors';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var Integrations = React.createClass({
	mixins: [AjaxMixin], // ReactDebugMixin
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            errorMessageArray: [],
            isError: false,
            integrations: []
        }  
    },
    componentWillMount: function() {
        var self = this,
            options = {
                fields: ['integrations']
            }
        ;
        self.GET('', options)
            .then(function(res) {
                self.setState({
                    isError: false,
                    integrations: res.integrations || res.integration_ids || []
                });
            }).catch(function(err) {
                E.checkForError(err.statusText, false);
                self.setState({
                    isError: true
                });
            });
    },
    render: function() {
        var self = this,
            additionalClass = 'table is-striped' + (self.props.isLoading ? ' is-loading' : ''),
            messageNeeded = self.state.isError ? <Message header={T.get('copy.plugins.heading') + ' ' + T.get('error')} body={E.getErrors()} flavour="danger" /> : ''
        ;
        return (
            <table className={additionalClass}>
                <caption>
                    {messageNeeded}
                </caption>
                <tbody>
                    {
                        self.state.integrations.map(function(integration, i) {
                            var configureClick = function() {
                                    self.configure(integration);
                                };
                            // TEMP UNTIL API IS READY
                            integration = {
                                integration_id: integration,
                                type: 'brightcove'
                            };
                            return (
                                <tr key={integration.integration_id}>
                                    <td>
                                        <img src={T.get('copy.plugins.types.' + integration.type + '.img')} />
                                    </td>
                                    <td>
                                        {T.get('copy.plugins.types.' + integration.type + '.title')} - {integration.integration_id}
                                    </td>
                                    <td>
                                        <a className="button is-medium is-pulled-right" onClick={configureClick}>{T.get('configure')}</a>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan="3">
                            <a className="button is-primary is-medium is-pulled-right" onClick={self.addNew}>{T.get('add')}</a>
                        </th>
                    </tr>
                </tfoot>
            </table>
        );
    },
    configure: function(integration) {
        this.context.router.push('/integrations/' + integration.type + '/?id=' + integration.integration_id);
    },
    addNew: function() {
        // this.context.router.push(UTILS.DRY_NAV.PLUGINS_NEW.URL);
        // Temp until there are more types of integrations
        this.context.router.push(UTILS.DRY_NAV.PLUGINS_BRIGHTCOVE.URL);
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default Integrations;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
