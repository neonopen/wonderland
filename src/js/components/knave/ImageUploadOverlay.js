// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import UTILS from '../../modules/utils';
import T from '../../modules/translation';
import Message from '../wonderland/Message'

import AjaxMixin from '../../mixins/Ajax';

import Dropzone from 'react-dropzone'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var ImageUploadOverlay = React.createClass({
    render: function() {
        var self = this,
            submitClassName = ['xxButton', 'xxButton--highlight'],
            className = ['xxUploadDialog'],
            dragDropClassKey,
            dropzoneContent,
            messageNeeded = self.props.error ? <Message message={self.props.error} type={'formError'}/> : null,
            isValid = self.props.photoUploadMode === 'initial' &&  self.props.photoUploadThumbnailIds.length > 0 && self.props.photoCollectionName !== '',
            instructions = self.props.photoCollectionName !== '' ? T.get('imageUpload.dragInstructions.two') : T.get('imageUpload.dragInstructions.one')
        ;
            if (isValid) { 
                submitClassName.push('xxButton--important');
                instructions = T.get('imageUpload.dragInstructions.three')
            }

        switch(self.props.photoUploadMode) {
            case 'initial':
                dragDropClassKey = 'hint';
                dropzoneContent = <div>{T.get('imageUpload.draglocation')}<br/> {T.get('imageUpload.folders')}<br/></div>;
                break;
            case 'loading':
                dragDropClassKey = 'progress';
                dropzoneContent = (
                    <div>
                        <span className="xxDragAndDrop-progressCounter">
                            {`${Math.round((self.props.numberUploadedCount) / self.props.photoUploadCount * 100)}%`}
                        </span>
                        {"Uploading (" + self.props.photoUploadCount + ") files."}<br/>
                        {self.props.photoErrorCount > 0 ? ("Unable to upload (" + self.props.photoErrorCount + ") files due to file type/size." ) : null}
                    </div>
                );
                break;
            case 'success': 
                dragDropClassKey = 'complete';
                dropzoneContent = <div>{"Uploaded (" + self.props.photoUploadCount + ") files" }<br/></div>;
                break; 
            default: 
                dragDropClassKey = 'hint';
                dropzoneContent = <div>{T.get('imageUpload.draglocation')}<br/> {T.get('imageUpload.folders')}<br/></div>;
        }
        return (
            <div className="xxUploadDialog">
                <div className="xxUploadDialog-drag-drop">
                    <div className="xxUploadDialog-intro">
                        <h2 className="xxTitle">{T.get('imageUpload.uploadImage')}</h2>
                    </div>
                    <div className="xxDragAndDrop">
                         <ReactCSSTransitionGroup transitionName="xxFadeInOutFast" transitionEnterTimeout={UTILS.UPLOAD_TRANSITION}transitionLeaveTimeout={UTILS.UPLOAD_TRANSITION}>
                             <div className={"xxDragAndDrop-content xxDragAndDrop-" + dragDropClassKey } key={"drag-and-drop-"+ dragDropClassKey}>
                                 {dropzoneContent}
                             </div>
                         </ReactCSSTransitionGroup>
                    </div>
                    <div className="xxUploadDialog-block">
                    {self.props.photoUploadThumbnailIds.length + "/100 uploaded" }
                    </div>
                    <div className="xxUploadDialog-block">
                        <button className="xxButton xxButton--highlight">local</button>
                        <button className="xxButton xxButton-center" disabled>OR</button>
                        <button className="xxButton xxButton--highlight">dropbox</button>
                    </div>
                    <div className="xxUploadDialog-block">
                        <input 
                            className="xxInputText xxInputText-upload" 
                            placeholder={"What's this gallery called?"}
                        />
                        <button className="xxButton xxButton--highlight">submit</button>
                    </div>

                </div>
            </div>
        );
    },
    onDrop: function (files) {
        var self = this;
        self.props.formatData(files);
    },
    propTypes: {
        error: React.PropTypes.string, 
        key: React.PropTypes.func,
        formatData: React.PropTypes.func,
        grabDropBox: React.PropTypes.func,
        sendLocalPhotos: React.PropTypes.func,
        sendFormattedData: React.PropTypes.func,
        toggleOpen: React.PropTypes.func,
        photoUploadMode: React.PropTypes.string,
        photoUploadCount: React.PropTypes.number,
        photoErrorCount: React.PropTypes.number,
        updateField: React.PropTypes.func,
        photoCollectionName: React.PropTypes.string,
        photoUploadThumbnailIds: React.PropTypes.array
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default ImageUploadOverlay;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





// <div className="xxDragAndDrop">
//     <ReactCSSTransitionGroup transitionName="xxFadeInOutFast" transitionEnterTimeout={UTILS.UPLOAD_TRANSITION}transitionLeaveTimeout={UTILS.UPLOAD_TRANSITION}>
//         <div className={"xxDragAndDrop-content xxDragAndDrop-" + dragDropClassKey } key={"drag-and-drop-"+ dragDropClassKey}>
//             {dropzoneContent}
//             {self.props.photoUploadThumbnailIds.length + "/100 uploaded" }
//         </div>
//     </ReactCSSTransitionGroup>
// </div>
// <div className="xxUploadDialog-drag-drop">
//     <div className="xxUploadDialog-intro">
//         <h2 className="xxTitle">{T.get('imageUpload.uploadImage')}</h2>
//         <p>{instructions}</p>
//         <p>{messageNeeded}</p>
//     </div>
//     <div className="xxDragAndDrop">
//     </div>
//     <div className="xxFormField">
//         <label className="xxLabel">{T.get('imageUpload.collectionName')}</label>
//         <input
//             className="xxInputText"
//             type="text"
//             required
//             onChange={e => self.props.updateField('photoCollectionName', e.target.value)}
//         />
//     </div>

//             <div>
//             <div className="xxFormField">
//                 <label className="xxLabel">{T.get('imageUpload.chooseSource')}</label>
//                 <div className="xxButton xxButton--uploadDialog xxButton--highlight xxButton--file">
//                     {T.get('imageUpload.local')}
//                     <input
//                         disabled={self.props.photoUploadMode === 'loading'}
//                         type="file"
//                         name="upload"
//                         multiple
//                         accept= "image/*"
//                         className="xxButton-fileInput"
//                         onChange={self.props.sendLocalPhotos}
//                     />

//                 </div>
//                 <button 
//                     id="dropBoxSDK"
//                     disabled={self.props.photoUploadMode === 'loading'}
//                     className="xxButton xxButton--uploadDialog xxButton--highlight"
//                     onClick={self.props.grabDropBox}
//                 >
//                 {T.get('imageUpload.dropBox')}
//                 </button>
//             </div>
//             <button
//                 className={submitClassName.join(' ')}
//                 type="button"
//                 onClick={isValid ? self.props.toggleOpen : null}
//                 data-send-tag={true}
//                 disabled={!isValid}
//             >{T.get('upload.submit')}</button>
//             </div>
//     </div>

//<Dropzone 
//     className={'xxUploadDialog'}
//     multiple={true}
//     disableClick={true}
//     activeClassName='has-dragAndDropHover'
//     encType="multipart/form-data" 
//     onDrop={self.onDrop}
// >
// </Dropzone>



