// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
// import ReactDebugMixin from 'react-debug-mixin';
import Dropzone from 'react-dropzone'
import AjaxMixin from '../../mixins/Ajax';
import Account from '../../mixins/Account';
import reqwest from 'reqwest';
import SESSION from '../../modules/session';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var DragDropComponent = React.createClass({
        mixins: [AjaxMixin, Account],
        getInitialState: function() {
            var self = this;
            return {
                mode: 'silent', //silent/error/success/error/
            }
        },
        onDrop: function (files) {
            var self = this;
            debugger 
            self.setState({
                mode: 'loading'
            },
                self.formatData(files)
            );
        },
        formatData: function(files) {
            var self = this,
                formData = new FormData()
            ;
            files.forEach((file)=> {
                formData.append('upload', file)
            });
            self.sendFormattedData(formData);
        },
        sendFormattedData: function(formData) {
            var self = this;
            self.POST('thumbnails', {
                contentType: 'multipart/form-data',
                data: formData
            })
                .then(function (res) {
                    console.log(res);
                    self.setState({
                        mode:'success'
                    }, setTimeout( 
                        self.setState({
                            mode:'silent'
                        }), 30)
                    )
                })
                .catch(function (err) {
                    // TODO: Handle error
                    console.log(err);
                });
        },
        render: function () {
            var self = this,
                DropzoneContents
            ;
            switch(self.state.mode) {
                case 'silent':
                    DropzoneContents = 'Try dropping some files here, or click to select files to upload.';
                    break;
                case 'loading':
                    DropzoneContents = (
                        <span className="icon">
                            <i className="fa fa-cog fa-spin"></i>
                        </span>
                    );
                    break;
                case 'success':
                    DropzoneContents = (
                        <span className="icon">
                            <i className="fa fa-check"></i>
                        </span>
                    );
                    break;
            }
            return (
                <div>
                    <Dropzone 
                        className="dragdrop box"
                        multiple={false}
                        accept="image/*"
                        activeClassName="dragdrop-active"
                        encType="multipart/form-data" 
                        onDrop={this.onDrop}
                    >
                        {DropzoneContents}
                    </Dropzone>
                </div>
            );
        }
    });

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default DragDropComponent;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -