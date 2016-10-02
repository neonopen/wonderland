import React, { PropTypes } from 'react';
import _ from 'lodash';

import BaseCollection from './BaseCollection';
import MobileBaseCollection from './MobileBaseCollection';
import T from '../../modules/translation';
import {
    ShowMoreThumbnailList,
    ShowLessThumbnailList } from './ThumbnailList';
import {
    AddControl,
    AddPanel,
    ServingStatusControl,
    ServingStatusPanel } from './InfoActionPanels';
import RENDITIONS from '../../modules/renditions';
import FeatureThumbnail from './FeatureThumbnail';
import { SendActions, LoadActions } from '../../stores/CollectionStores';

class VideoCollection extends BaseCollection {

    static propTypes = {
        // Left and right large thumbnail
        leftFeatureThumbnail: PropTypes.shape({
            thumbnail_id: PropTypes.string.isRequired,
        }).isRequired,
        rightFeatureThumbnail: PropTypes.shape({
            thumbnail_id: PropTypes.string.isRequired,
        }).isRequired,
        smallBadThumbnails: PropTypes.arrayOf(PropTypes.object),
        timeRemaining: PropTypes.number,
        videoId: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            // What panel to display, based on user input by
            // clicking on the buttons (email/del/share) in the right panel
            selectedPanelIndex: 0,
            liftObjectId: null,
        };
        this.onAddControlClick = this.onControlClick.bind(this, 5);
        this.onDeleteControlClick = this.onControlClick.bind(this, 3);
        this.onEmailControlClick = this.onControlClick.bind(this, 2);
        this.onServingControlClick = this.onControlClick.bind(this, 4);
        this.onShareControlClick = this.onControlClick.bind(this, 1);

        this.bindMore(props);
    }

    // Overriden in child.
    bindMore(props) {
        this.onLeftThumbnailClick = this.onThumbnailClick.bind(
            this, props.leftFeatureThumbnail.thumbnail_id);
        this.onRightThumbnailClick = this.onThumbnailClick.bind(
            this, props.rightFeatureThumbnail.thumbnail_id);
        this.onSetLiftThumbnailId = this.onSetLiftObjectId.bind(this);
        this.onSetLiftThumbnailToDefault = this.onSetLiftObjectId.bind(
            null, null);
        this.onSetLiftThumbnailToLeft = this.onSetLiftThumbnailId.bind(
            null, props.leftFeatureThumbnail.thumbnail_id);
        this.onWhyClick = this.onWhyClick.bind(this);
    }

    componentDidMount() {
        this.setProcessingMonitor();
    }

    componentWillUpdate() {
        this.setProcessingMonitor();
    }

    componentWillUnmount() {
        this.clearProcessingMonitor();
    }

    renderFeatureContent() {
        const left = this.props.leftFeatureThumbnail;
        const right = this.props.rightFeatureThumbnail;
        return (
            <div>
                <FeatureThumbnail
                    thumbnailId={left.thumbnail_id}
                    title={T.get('copy.currentThumbnail')}
                    score={left.neon_score}
                    enabled={left.enabled}
                    className={'xxThumbnail--lowLight'}
                    src={RENDITIONS.findRendition(left)}
                    onClick={this.onLeftThumbnailClick}
                    onMouseEnter={this.onSetLiftThumbnailToLeft}
                    onMouseLeave={this.onSetLiftThumbnailToDefault}
                />
                <FeatureThumbnail
                    thumbnailId={right.thumbnail_id}
                    title={T.get('copy.topNeonImage')}
                    score={right.neon_score}
                    enabled={right.enabled}
                    src={RENDITIONS.findRendition(right)}
                    isSoloImage={!right}
                    onClick={this.onRightThumbnailClick}
                    onMouseEnter={this.onSetLiftThumbnailToDefault}
                    onMouseLeave={this.onSetLiftThumbnailToDefault}
                />
            </div>
        );
    }

    setProcessingMonitor() {
        if (this.props.isRefiltering) {
            const tagId = this.props.tagId;
            const monitorFunction = LoadActions.loadTags.bind(
                null, [tagId], this.props.selectedDemographic[0],
                this.props.selectedDemographic[1]);
            if (this.props.timeRemaining > 10) {
                this.clearProcessingMonitor();
                const timeout = 1000 * this.props.timeRemaining;
                setTimeout(monitorFunction, timeout);
                return;
            }

            // Only set one setInterval per video.
            if (this.processingMonitor) {
                return;
            }

            // Let's set a monitor until the video is out of processing.
            const interval = 1000 * 10;
            this.processingMonitor = setInterval(monitorFunction, interval);
            return;
        }

        // Else, the video is processed so clear a monitor.
        this.clearProcessingMonitor();
    }

    clearProcessingMonitor() {
        if (this.processingMonitor) {
            clearInterval(this.processingMonitor);
            delete this.processingMonitor;
        }
    }

    onWhyClick() {
        this.props.onThumbnailClick(
            this.props.tagId,
            this.props.rightFeatureThumbnail.thumbnail_id);
    }

    getPanels() {
        const copyOverrideMap = {
            'copy.lift.explanation': 'copy.lift.explanation',
            'copy.lift.explanation.solo': 'copy.lift.explanation' };

        const panels = super.getBasePanels(copyOverrideMap);
        if (this.props.isViewOnly) {
            return panels;
        }

        if (this.props.isServingEnabled) {
            panels.push(
                <ServingStatusPanel
                    goodThumbnails={this.props.goodThumbnails}
                    onToggleThumbnailEnabled={this.props.onToggleThumbnailEnabled}
                    onCancelClick={this.onControlCancelClick}
                />,
                <AddPanel
                    isMobile={this.context.isMobile}
                    panelType={'video'}
                    tagId={this.props.tagId}
                    videoId={this.props.videoId}
                    onCancelClick={this.onControlCancelClick}
                />,
            );
        }
        return panels;
    }

    onRefilterVideo(gender, age, callback) {
        return SendActions.refilterVideo(
            this.props.tagId, gender, age, callback.bind(null, gender, age));
    }

    getControls() {
        if (this.props.infoPanelOnly) {
            return [];
        }
        const controls = super.getBaseControls();
        const nextIndex = controls.length + 1;
        if (this.props.servingEnabled) {
            controls.push(
                <ServingStatusControl
                    index={nextIndex}
                    onClick={this.onServingControlClick}
                />);
            controls.push(
                <AddControl
                    panelType={'video'}
                    index={nextIndex + 1}
                    onClick={this.onAddControlClick}
                />);
        }
        return controls;
    }

    renderMobile() {
        return (
            <MobileBaseCollection
                {...this.props}
                featureContent={this.renderFeatureContent()}
                subContent={this.renderThumbnailList()}
                infoActionPanels={this.getPanels()}
                infoActionControls={this.getControls()}
                selectedPanelIndex={this.state.selectedPanelIndex}
                wrapperClassName={'xxCollection xxCollection--video'}
                liftValue={this.getLiftValue()}
                onSetLiftThumbnailId={this.onSetLiftThumbnailId}
            />
        );
    }

    renderDesktop() {
        return (
            <BaseCollection
                {...this.props}
                featureContent={this.renderFeatureContent()}
                subContent={this.renderThumbnailList()}
                infoActionPanels={this.getPanels()}
                infoActionControls={this.getControls()}
                selectedPanelIndex={this.state.selectedPanelIndex}
                wrapperClassName={'xxCollection xxCollection--video'}
            />
        );
    }

    renderThumbnailList() {
        // Number of rows of item to display.
        const rows = this.state.smallThumbnailRows;

        // 2 cases for video:
        // Expanded: ShowLess with more than one row
        // Initial: ShowMore with one row
        if (rows > 1) {
            // Constrain good thumbnails to 5.
            const truncatedSmallThumbnails = this.props.smallThumbnails.slice(0, 5);
            const thumbnails = _.flatten([
                truncatedSmallThumbnails,
                this.props.smallBadThumbnails.slice(0, 6),
            ]);
            return (<ShowLessThumbnailList
                thumbnails={thumbnails}
                lessLabel={T.get('copy.thumbnails.high')}
                onLess={this.onLess}
                onMouseEnter={this.onSetLiftThumbnailId}
                onMouseLeave={this.setDefaultLiftThumbnail}
                onClick={this.onThumbnailClick}
                firstClassName="xxThumbnail--highLight"
                secondClassName="xxThumbnail--lowLight"
            />);
        }
        return (<ShowMoreThumbnailList
            thumbnails={this.props.smallThumbnails}
            numberToDisplay={5}
            moreLabel={T.get('copy.thumbnails.low')}
            onMore={this.onMore}
            onMouseEnter={this.onSetLiftThumbnailId}
            onMouseLeave={this.setDefaultLiftThumbnail}
            onClick={this.onThumbnailClick}
        />);
    }

    getDefaultLiftObjectId() {
        return this.props.rightFeatureThumbnail.thumbnail_id;
    }

    render() {
        if (this.context.isMobile) {
            return this.renderMobile();
        }
        return this.renderDesktop();
    }
}

export default VideoCollection;
