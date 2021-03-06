// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React, {PropTypes} from 'react';

import _ from 'lodash';

import FeatureThumbnail from './FeatureThumbnail';
import InfoActionContainer from './InfoActionContainer';
import {
    ThumbnailList,
    ShowMoreThumbnailList,
    ShowLessThumbnailList,
    ShowMoreLessThumbnailList } from './ThumbnailList';

import Lift from '../knave/Lift';
import GifClip  from './GifClip';
import RENDITIONS from '../../modules/renditions';
import T from '../../modules/translation';
import UTILS from '../../modules/utils';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const MobileBaseCollection = React.createClass({

    propTypes: {

        // Left and right large thumbnail
        leftFeatureThumbnail: PropTypes.object.isRequired,
        rightFeatureThumbnail: PropTypes.object.isRequired,

        // A map of T get key string to T get key
        // e.g., {'action.showMore': 'copy.thumbnails.low', ...}
        // overrides "Show More" with "View Low Scores"
        copyOverrideMap: PropTypes.object,

        infoActionPanels: PropTypes.array.isRequired,
        infoActionControls: PropTypes.array.isRequired,

        // List of thumbnails to be displayed as small items
        smallThumbnails: PropTypes.array.isRequired,

        // Handlers for image events
        onThumbnailClick: PropTypes.func,
        setLiftThumbnailId: PropTypes.func,

        // class name for the wrapper around the
        // component defaults to xxCollection
        wrapperClassName: PropTypes.string,
        onRightThumbnailClick: PropTypes.func,
        isSoloImage: PropTypes.bool,
        isMine: PropTypes.bool,
    },

    getDefaultProps() {
        return {
            wrapperClassName: 'xxCollection',
            onThumbnailClick: () => {},
            setLiftThumbnailId: () => {},
            smallBadThumbnails: [],
            isMine: true,
        }
    },

    getInitialState() {
        return {
            open: false,
            displayInfo: false
        };
    },

    getThumbnailList() {
        if (this.props.smallThumbnails.length == 0) {
            return null;
        }

        const self = this;
        const onMoreLess = (e) => {
            e.preventDefault();
            self.setState({
                open: !this.state.open
            });
        };

        const toggleLabel = this.state.open?
            T.get('action.showLess'):
            T.get('action.showMore');

        const children = [];

        if (this.state.open) {
            children.push((
                <span key="0">
                    {T.get('copy.videos.topSelects')}
                </span>
            ));
            children.push((
                <ThumbnailList
                    key="1"
                    thumbnails={self.props.smallThumbnails}
                    onClick={self.props.onThumbnailClick}
                    classname="xxThumbnail--highLight"
                />
            ));
            if (self.props.smallBadThumbnails.length > 0) {
                children.push((
                    <span key="2">
                        {T.get('copy.videos.lowest')}
                    </span>
                ));
                children.push((
                    <ThumbnailList
                        key="3"
                        thumbnails={self.props.smallBadThumbnails}
                        onClick={self.props.onThumbnailClick}
                        classname="xxThumbnail--lowLight"
                    />
                ));
            }
        }
        children.push((
            <div key="4" className="xxShowMore" onClick={onMoreLess}>
                <a href="#">{toggleLabel}</a>
            </div>
        ));
        return <div>{children}</div>;
    },

    onRightThumbnailClick() {
        if (this.props.onRightThumbnailClick) {
            this.props.onRightThumbnailClick();
        } else {
            const rightThumbnailId = this.props.rightFeatureThumbnail.thumbnail_id;
            this.props.onThumbnailClick(rightThumbnailId);
        }
    },

    onLeftThumbnailClick() {
        const leftThumbnailId = this.props.leftFeatureThumbnail.thumbnail_id;
        this.props.onThumbnailClick(leftThumbnailId);
    },

    handleDisplayInfo() {
        this.setState({ displayInfo: !this.state.displayInfo });
    },

    getOnClick(isLeft) {
        if (isLeft) {
            return this.onLeftThumbnailClick;
        }
        if (this.props.isSoloImage) {
            if (!this.props.isMine) {
                return null;
            }
        }
        return this.onRightThumbnailClick;
    },

    getFeatureThumbnail(thumbnail, isLeft) {
        const title = isLeft ? T.get('copy.worstThumbnail') : T.get('copy.bestThumbnail');
        const blurText = this.props.isMine ?
            T.get('imageUpload.addMoreBlurText') :
            '';
        const className = isLeft ? "xxThumbnail--lowLight" : "";
        return (
            <FeatureThumbnail
                title={title}
                score={thumbnail.neon_score}
                dominantColor={thumbnail.dominant_color}
                enabled={thumbnail.enabled}
                className={className}
                blurText={blurText}
                src={RENDITIONS.findRendition(thumbnail)}
                onClick={this.getOnClick(isLeft)}
                isSoloImage={!isLeft && this.props.isSoloImage}
            />
        );
    },

    render() {
        // Let mapped labels be overriden.
        const unapplyOverride = UTILS.applyTranslationOverride(this.props.copyOverrideMap);

        const displayClassName = this.state.displayInfo ? ' xxPagingControls-next--mobileGifClosed' : ''
        const renderedMedia = !this.props.clip ? (
                <div>
                    <div className="xxCollection-content">
                        <InfoActionContainer
                            children={this.props.infoActionPanels}
                            controls={this.props.infoActionControls}
                            selectedPanel={this.props.selectedPanel}
                        />
                    </div>
                    <div className="xxCollectionImages">
                        {this.getFeatureThumbnail(this.props.leftFeatureThumbnail, true)}
                        {this.getFeatureThumbnail(this.props.rightFeatureThumbnail, false)}
                        <Lift
                            displayThumbLift={this.props.liftValue}
                            copyOverrideMap={this.props.copyOverrideMap}
                        />
                        {this.getThumbnailList()}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="xxCollection-content xxCollection-content--mobileGif">
                        <h1 className="xxCollection-title xxCollection-title--mobileGif ">{this.props.title}</h1>
                        <div className={"xxPagingControls-next xxPagingControls-next--GifClip" + displayClassName} onClick={this.handleDisplayInfo}></div>
                    </div>
                    <div className="xxCollectionImages">
                        <GifClip
                            url={this.props.clip.renditions[2].url}
                            score={this.props.clip.neon_score}
                            poster={this.props.clipPoster}
                            id={this.props.clip.clip_id}
                        />
                        {
                            this.props.clipsIds.length > 1 ? (
                                <nav className="xxPagingControls-navigation xxPagingControls-navigation--GifClip">
                                    <div
                                        className="xxPagingControls-prev xxPagingControls-prev--GifClip" 
                                        onClick={this.props.onGifClickPrev}>
                                    </div>
                                    <div className="xxPagingControls-navigation-item xxPagingControls-item--GifClip" >
                                        {(this.props.selectedGifClip + 1) + ' of '+ this.props.clipsIds.length}
                                    </div>
                                    <div
                                        className="xxPagingControls-next xxPagingControls-next--GifClip" 
                                        onClick={this.props.onGifClickNext}>
                                    </div>
                                </nav>
                            ) : null
                        }
                        {
                            this.state.displayInfo ? (
                                <div className="xxCollection-content">
                                    <InfoActionContainer
                                        children={this.props.infoActionPanels}
                                        controls={this.props.infoActionControls}
                                        selectedPanel={this.props.selectedPanel}
                                    />
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            )


        const result = (
            <div className={this.props.wrapperClassName}>
                {renderedMedia}
            </div>
        );

        // Remove translation override.
        unapplyOverride();

        return result;
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default MobileBaseCollection;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
