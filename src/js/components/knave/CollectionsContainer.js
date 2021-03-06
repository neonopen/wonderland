 'use strict';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React, {PropTypes} from 'react';

import _ from 'lodash';

import UTILS from '../../modules/utils';
import RENDITIONS from '../../modules/renditions';
import TRACKING from '../../modules/tracking';

import VideoProcessing from './VideoProcessing';
import ImageCollection from './ImageCollection';
import VideoCollection from './VideoCollection';
import ThumbnailOverlay from '../knave/ThumbnailOverlay';

import { SendActions } from '../../stores/CollectionStores';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const CollectionsContainer = React.createClass({

    propTypes: {

        // Ask the store to load resources for a tag's thumbnails
        // for a given demographic.
        loadTagForDemographic: PropTypes.func.isRequired,

        // Ask the store to load thumbnailFeatures and features
        // for a given tag and demographic.
        loadFeaturesForTag: PropTypes.func.isRequired,

        // Sorted list of collection ids to show
        shownIds: PropTypes.array.isRequired,

        // Map of store identifying key to the store,
        // which is a map of object id to object.
        stores: PropTypes.object.isRequired,

        // Defaults to Function to delete/hide a collection from
        // both the backend and frontend display
        deleteCollection: PropTypes.func,

        // ClickHandler for social sharing buttons
        socialClickHandler: PropTypes.func,

        // Allows a collection to send results email
        sendResultsEmail: PropTypes.func,
        sendGifResultsEmail: PropTypes.func,

        // Minimal UI for share.
        infoPanelOnly: PropTypes.bool,

        // Pops the side bar module given a recognized string
        setSidebarContent: PropTypes.func.isRequired,

        // the accountid that owns these containers
        ownerAccountId: PropTypes.string,

        // Flag for viewing a shared collection
        isMine: PropTypes.bool.isRequired,
    },

    getInitialState: function() {
        return {

            // Map of tag id to integer index of gender, then age.
            // Uses FILTER_GENDER_COL_ENUM, FILTER_AGE_COL_ENUM.
            // By default, the demographic is [0,0] meaning gender=none, age=none.
            selectedDemographic: {},

            // If a demographic was selected but it isn't available yet, and a
            // request has been made to load it, then this will set it
            // if it becomes loaded.
            nextSelectedDemographic: {},

            // Setting a tag will render the modal overlay thumbnail zoom.
            overlayTagId: null,
            overlayThumbnailId: null
        };
    },

    componentWillReceiveProps: function(nextProps) {
        // If the next props have a queued selected
        // demographic (in indexes 2-3), then move the queued selected
        // to the selected one.
        const selectedDemographic = this.state.selectedDemographic;
        _.map(selectedDemographic, (selDemo, tagId) => {
            if (selDemo.length === 4) {
                const nextGender = selDemo[2];
                const nextAge = selDemo[3];
                const tag = nextProps.stores.tags[tagId];
                const video = nextProps.stores.videos[tag.video_id];
                const demos = video.demographic_clip_ids.length ?
                    video.demographic_clip_ids :
                    video.demographic_thumbnails;

                const foundDemo = UTILS.findDemographicObject(demos, nextGender, nextAge);
                if (foundDemo) {
                    selectedDemographic[tagId] = [nextGender, nextAge];
                }
            }
        });
        this.setState({ selectedDemographic });
    },

    // Return array of gender,age enum array based
    // on state of collection.
    getDemoOptionArray: function(tagId) {
        const tag = this.props.stores.tags[tagId];
        switch(tag.tag_type) {
        case UTILS.TAG_TYPE_IMAGE_COL:
            // All factor posibilities are available.
            // TODO? do statically as class behavior.
            return UTILS.productOfArrays(
                _.values(UTILS.FILTER_GENDER_COL_ENUM),
                _.values(UTILS.FILTER_AGE_COL_ENUM)
            );
        case UTILS.TAG_TYPE_VIDEO_COL:
            const video = this.props.stores.videos[tag.video_id];
            const demos = video.demographic_clip_ids.length ?
                video.demographic_clip_ids :
                video.demographic_thumbnails;
            return demos.map(demo => {
                return [
                    UTILS.FILTER_GENDER_COL_ENUM[demo.gender],
                    UTILS.FILTER_AGE_COL_ENUM[demo.age]
                ];
            }).sort();
        }
        return [[0,0]];
    },

    getSelectedDemographic: function(tagId) {
        if (this.state.selectedDemographic[tagId]) {
            return this.state.selectedDemographic[tagId];
        }
        return [0, 0];
    },

    // Given a tag id, build a valid Collection
    // component instance and return it.
    //
    // Else return an error component.
    getCollectionComponent: function(tagId) {

        const collection = this.props.stores.tags[tagId];

        if (collection.thumbnail_ids.length < 1 && collection.tag_type !== 'video') {
            return <div key={tagId}/>;
        }
        switch(collection.tag_type) {
            case UTILS.TAG_TYPE_IMAGE_COL:
                return this.buildImageCollectionComponent(tagId);
            case UTILS.TAG_TYPE_VIDEO_COL:
                return this.buildVideoCollectionComponent(tagId);
        }
        // TODO? try-catch: if components fail prop validation, catch
        // and return an error component.
        return <div key={tagId}/>;
    },

    // True if a demographic thumbnail map is loaded for
    // the given arguments.
    hasDemographicLoaded: function(thumbnailIds, demoMap) {
        // Check if one of the thumbnails is loaded and set
        // assume the rest are.
        return _.every(thumbnailIds, id => {return id in demoMap});
    },

    // On demographic selector change, fill in stores.
    onDemographicChange: function(tagId, demoKey) {
        const selectedDemographic = this.state.selectedDemographic;
        const gender = demoKey[0];
        const age = demoKey[1];

        let newDemographic = [gender, age];

        // If this is a video and the demographic isn't in the
        // video store, then put the gender and age in the "next"
        // bucket indexes at 2, 3. In the videocollection willReceiveProps,
        // we check if the next demos are ready and switch to them.
        const tag = this.props.stores.tags[tagId];
        if (tag.tag_type === UTILS.TAG_TYPE_VIDEO_COL) {
            const video = this.props.stores.videos[tag.video_id];
            const demos = video.demographic_clip_ids.length ?
                video.demographic_clip_ids :
                video.video.demographic_thumbnails;
            if (!UTILS.findDemographicObject(demos, gender, age)) {
                const prevDemo = this.getSelectedDemographic(tagId);
                newDemographic = prevDemo.slice(0, 2);
                newDemographic.push(gender, age);
            }
        }

        selectedDemographic[tagId] = newDemographic;

        // Ask stores to load missing values.
        // And change our state when done.
        const callback = () => {
            this.setState({selectedDemographic});
        };
        this.props.loadTagForDemographic(tagId, gender, age, callback);
    },

    // Given tag id and demo, gives array of
    //   left feature thumbnail
    //   right feature thumbnail
    //   rest of thumbnails
    //   [and more thumbnails]
    getLeftRightRest: function(tagId, gender, age) {
        const getLeftRightRestVideo = () => {

            const tag = this.props.stores.tags[tagId];
            const video = this.props.stores.videos[tag.video_id];

            let genderLabel = _.invert(UTILS.FILTER_GENDER_COL_ENUM)[gender];
            if(genderLabel == 'null') {
                genderLabel = null;
            }
            let ageLabel = _.invert(UTILS.FILTER_AGE_COL_ENUM)[age];
            if(ageLabel == 'null') {
                ageLabel = null;
            }
            let videoDemo = _.find(
                video.demographic_thumbnails,
                t => {
                    return (t.gender == genderLabel && t.age == ageLabel);
                }
            );
            if (videoDemo === undefined) {
                return [];
            }
            let allThumbnailMap = [];
            if (videoDemo.thumbnails) {
                allThumbnailMap = _.pick(
                    this.props.stores.thumbnails[gender][age],
                    videoDemo.thumbnails.map(t => {
                        return t.thumbnail_id;
                }));
            }
            if (_.isEmpty(allThumbnailMap)) {
                // Get the thumbnails on the tag for clips.
                tag.thumbnail_ids.forEach(thumbnail_id => {
                    allThumbnailMap[thumbnail_id] = this.props.stores.thumbnails[gender][age][thumbnail_id];
                });
            }

            if (_.isEmpty(allThumbnailMap)) {
                return [];
            }

            // default
            const _default = UTILS.findDefaultThumbnail(
                {thumbnails: _.values(allThumbnailMap)}
            );

            // For the left, find a default thumbnail or use the worst.
            const left = _default || UTILS.worstThumbnail(_.values(allThumbnailMap));

            // For the right, use the best scoring OR fallback to the default
            const right = UTILS.bestThumbnail(_.values(allThumbnailMap)) || _default;

            const rest = _
                .chain(allThumbnailMap)
                // Remove the feature thumbnails from the small list.
                .omit([right.thumbnail_id, left.thumbnail_id])
                .values()
                // Order by score, best to worst, then created time for stability.
                .orderBy(['neon_score', 'created'], ['desc', 'asc'])
                .value();

            // Do the same for the bad thumbnail list.
            let allBadThumbnailMap = [];
            if (videoDemo.bad_thumbnails) {
                allBadThumbnailMap = _.pick(
                    this.props.stores.thumbnails[gender][age],
                    videoDemo.bad_thumbnails.map(t => {
                        return t.thumbnail_id;
                    })
                );
            }
            const more = _
                .chain(allBadThumbnailMap)
                .values()
                .orderBy(['neon_score', 'created'], ['desc', 'asc'])
                .value();
            return [left, right, rest, more];
        };

        const getLeftRightRestImage = () => {
            const tag = this.props.stores.tags[tagId];
            const allThumbnailMap = _.pick(
                this.props.stores.thumbnails[gender][age],
                tag.thumbnail_ids)
            const right = UTILS.bestThumbnail(_.values(allThumbnailMap));
            const left = UTILS.worstThumbnail(_.values(allThumbnailMap));

            // Build the list of thumbnails to display below.
            const rest = _
                .chain(allThumbnailMap)
                // Remove the feature thumbnails from the small list.
                .omit([right.thumbnail_id, left.thumbnail_id])
                .values()
                // Order by score, best to worst, then created time for stability.
                .orderBy(['neon_score', 'created'], ['desc', 'asc'])
                .value();
            return [left, right, rest, []];
        };

        const tag = this.props.stores.tags[tagId];
        switch(tag.tag_type) {
            case UTILS.TAG_TYPE_VIDEO_COL:
                return getLeftRightRestVideo();
            case UTILS.TAG_TYPE_IMAGE_COL:
            default:
                return getLeftRightRestImage();
        }

    },

    sendResultsEmail(email, tagId, callback) {
        const self = this;
        const [gender, age] = self.getSelectedDemographic(tagId);
        const [, bestThumb, goodThumbs] = self.getLeftRightRest(
            tagId, gender, age);
        const fourThumbs = _.flatten([bestThumb, goodThumbs]).slice(0, 4);
        let i = 0;
        while (fourThumbs.length < 4) {
            // Repeat until the required number is set.
            fourThumbs.push(fourThumbs[i++]);
        }
        self.props.sendResultsEmail(
            email, tagId, gender, age, fourThumbs, callback);
    },

    sendGifResultsEmail(email, tagId, callback) {
        const self = this;
        const [gender, age] = self.getSelectedDemographic(tagId);
        self.props.sendGifResultsEmail(email, tagId, gender, age, callback);
    },

    buildImageCollectionComponent: function(tagId) {
        const collection = this.props.stores.tags[tagId];

        const demo = this.getSelectedDemographic(tagId);
        const gender = demo[0];
        const age = demo[1];

        const thumbArrays = this.getLeftRightRest(tagId, gender, age);
        const left = thumbArrays[0];
        const right = thumbArrays[1];
        const smallThumbnails = thumbArrays[2];

        const thumbLiftMap = !_.isEmpty(this.props.stores.lifts[gender][age][tagId]) ?
            this.props.stores.lifts[gender][age][tagId] : {};

        const shareUrl = (tagId in this.props.stores.tagShares)?
            this.props.stores.tagShares[tagId].url:
            undefined;

        const emailThumbnails = _.flatten([right, smallThumbnails]);
        const thumbsLength = collection.thumbnail_ids.length;

        return (
            <ImageCollection
                key={tagId}
                isMine={this.props.isMine}
                title={collection.name}
                tagId={tagId}
                leftFeatureThumbnail={left}
                rightFeatureThumbnail={right}
                smallThumbnails={smallThumbnails}
                thumbnailLength={thumbsLength}
                onThumbnailClick={this.onThumbnailClick.bind(null, tagId)}
                onDemographicChange={this.onDemographicChange.bind(null, tagId)}
                demographicOptions={this.getDemoOptionArray(tagId)}
                selectedDemographic={[gender, age]}
                infoPanelOnly={this.props.infoPanelOnly}
                deleteCollection={SendActions.deleteCollectionByTagId.bind(null, tagId)}
                socialClickHandler={this.props.socialClickHandler}
                shareUrl={shareUrl}
                sendResultsEmail={this.sendResultsEmail}
                thumbLiftMap={thumbLiftMap}
                setTooltipText={this.props.setTooltipText}
            />
        );
    },

    buildVideoCollectionComponent(tagId) {
        const tag = this.props.stores.tags[tagId];
        const video = this.props.stores.videos[tag.video_id];

        let isRefiltering = false;
        if (['submit', 'processing', 'failed'].includes(video.state)) {
            if (video.state == 'submit') {
                return this.buildVideoProcessingComponent(tagId);
            }
            if (video.state == 'failed' && !video.demographic_clip_ids.length) {
                return this.buildVideoFailedComponent(tagId);
            }

            if (tag.thumbnail_ids.length === 1) {
                // if it's just the default thumbnail, we have a video
                // that's still processing.
                const tid = tag.thumbnail_ids[0];
                const thumbnail = this.props.stores.thumbnails[0][0][tid];
                // we can't find the thumbnail in our stores, meaning it's
                // older or the default just hasn't showed up yet.
                if (!thumbnail || thumbnail.type == 'default') {
                    return this.buildVideoProcessingComponent(tagId);
                }
            }
            if (tag.thumbnail_ids.length === 0) {
                return this.buildVideoProcessingComponent(tagId);
            } else if ('processing' == video.state) {
                isRefiltering = true;
            }
        }

        const demo = this.getSelectedDemographic(tagId);
        const gender = demo[0];
        const age = demo[1];

        const thumbLiftMap = !_.isEmpty(this.props.stores.lifts[gender][age][tagId]) ?
            this.props.stores.lifts[gender][age][tagId] : {};

        const shareUrl = (tagId in this.props.stores.tagShares)?
            this.props.stores.tagShares[tagId].url:
            undefined;

        const account = this.props.ownerAccountId ?
            this.props.stores.accounts[this.props.ownerAccountId]:
            null;

        const clipDemo = UTILS.findDemographicObject(video.demographic_clip_ids, gender, age);
        let thumbArrays;
        let clipIds = [];
        let clips = [];
        let clipThumbs = {};
        if (clipDemo && clipDemo.clip_ids.length > 0 ) {
            clipIds = clipDemo.clip_ids;
            clips = this.props.stores.clips[gender][age];
            // The assumption that thumbnails stores are set up
            // demographically for clip videos is problematic, so
            // just use the defaults.
            clipThumbs = this.props.stores.thumbnails[0][0];
            thumbArrays = this.getLeftRightRest(tagId, 0, 0);
        } else {
            thumbArrays = this.getLeftRightRest(tagId, gender, age);
        }

        if (thumbArrays.length == 0) {
            // we can't find any thumbnails this thing is likely failed
            return this.buildVideoFailedComponent(tagId);
        }

        const left = thumbArrays[0];
        const right = thumbArrays[1];
        const smallThumbnails = thumbArrays[2];
        const badThumbnails = thumbArrays[3];
        const goodThumbnails = _.flatten([right, smallThumbnails]);

        const sendResultsEmail = _.isEmpty(clips) ?
            this.sendResultsEmail :
            this.sendGifResultsEmail;

        return (
            <VideoCollection
                key={tagId}
                title={tag.name}
                leftFeatureThumbnail={left}
                rightFeatureThumbnail={right}
                goodThumbnails={goodThumbnails}
                smallThumbnails={smallThumbnails}
                smallBadThumbnails={badThumbnails}
                onThumbnailClick={this.onThumbnailClick.bind(null, tagId)}
                videoId={video.video_id}
                tagId={tagId}
                clips={clips}
                clipsIds={clipIds}
                clipThumbs={clipThumbs}
                getGifClipPosition={this.getGifClipPosition}
                onDemographicChange={this.onDemographicChange.bind(null, tagId)}
                demographicOptions={this.getDemoOptionArray(tagId)}
                selectedDemographic={demo}
                infoPanelOnly={this.props.infoPanelOnly}
                deleteCollection={SendActions.deleteCollectionByTagId.bind(null, tagId)}
                socialClickHandler={this.props.socialClickHandler}
                shareUrl={shareUrl}
                sendResultsEmail={sendResultsEmail}
                thumbLiftMap={thumbLiftMap}
                setTooltipText={this.props.setTooltipText}
                isRefiltering={isRefiltering}
                timeRemaining={video.estimated_time_remaining}
                enableThumbnail={this.props.enableThumbnail}
                disableThumbnail={this.props.disableThumbnail}
                account={account}
            />
       );
    },

    buildVideoProcessingComponent(tagId) {
        const tag = this.props.stores.tags[tagId];
        const video = this.props.stores.videos[tag.video_id];
        return (
            <VideoProcessing
                key={tagId}
                title={video.title}
                videoState={video.state}
                estimatedTimeRemaining={video.estimated_time_remaining}
                duration={video.duration}
                tagId={tagId}
                videoId={video.video_id}
                selectedDemographic={this.getSelectedDemographic(tagId)}
                deleteVideo={SendActions.deleteCollectionByTagId.bind(null, tagId)}
            />
        );
    },
    buildVideoFailedComponent(tagId) {
        const tag = this.props.stores.tags[tagId];
        const video = this.props.stores.videos[tag.video_id];
        return (
            <VideoProcessing
                key={tagId}
                tagId={tagId}
                title={tag.name}
                videoState={'failed'}
                estimatedTimeRemaining={video.estimated_time_remaining}
                duration={video.duration}
                videoId={video.video_id}
                deleteVideo={SendActions.deleteCollectionByTagId.bind(null, tagId)}
            />
        );
    },

    // Gets the Thumbnail resource for the
    // current demographic for a collection for a thumbnail id.
    getThumbnail: function(tagId, thumbnailId) {
        return this.getThumbnailMap(tagId)[thumbnailId];
    },
    // Get all the Thumbnail resources for the
    // current demographic for a collection as map of id to thumbnail.
    //
    // (If a video, this is the union of good and bad thumbs.)
    getThumbnailMap: function(tagId) {
        let gender = 0;
        let age = 0;
        if (this.state.selectedDemographic[tagId] !== undefined) {
            [gender, age] = this.state.selectedDemographic[tagId];
        }
        const tag = this.props.stores.tags[tagId];
        let associatedThumbnailIds;
        if(tag.tag_type === UTILS.TAG_TYPE_VIDEO_COL) {
            const video = this.props.stores.videos[tag.video_id];
            const demo = UTILS.findDemographicObject(
                video.demographic_thumbnails,
                gender,
                age);
            associatedThumbnailIds = _.union(
                demo.thumbnails.map(t => { return t.thumbnail_id }),
                demo.bad_thumbnails ? demo.bad_thumbnails.map(
                    t => { return t.thumbnail_id }) : []
            );
        } else {
            associatedThumbnailIds = tag.thumbnail_ids;
        }
        return _.pick(
            this.props.stores.thumbnails[gender][age],
            associatedThumbnailIds);
    },

    onThumbnailClick: function(overlayTagId, overlayThumbnailId) {
        const self = this;
        self.setState({overlayTagId, overlayThumbnailId});
        TRACKING.sendEvent(self, arguments, !!self.state.overlayTagId);
    },

    onOverlayClickNextPrev: function(newThumbnailId, e) {
        e.preventDefault();
        const self = this;
        const thumbnail = self.getThumbnail(self.state.overlayTagId, self.state.overlayThumbnailId);
        TRACKING.sendEvent(self, arguments, thumbnail);
        self.setState({
            overlayThumbnailId: newThumbnailId
        });
    },

    onOverlayClose: function(e) {
        e.preventDefault();
        const self = this;
        self.setState({
            overlayTagId: null,
            overlayThumbnailId: null
        });

    },

    getOverlayComponent: function() {
        // If no tag, the overlay hasn't been opened.
        const tagId = this.state.overlayTagId;
        if (!tagId) {
            return null;
        }
        const tag = this.props.stores.tags[tagId];

        // Get score sorted thumbnails for collection.
        const demo = this.getSelectedDemographic(tagId);
        const gender = demo[0];
        const age = demo[1];

        // Begin loading features.
        this.props.loadFeaturesForTag(tagId, gender, age);

        // Get the same order of list that the collections uses.
        const sortedThumbnails = _(this.getLeftRightRest(tagId, gender, age))
            .flatten()
            .sortedUniqBy('thumbnail_id')
            .value();

        // Deal with when the best and worst is the same.
        if(sortedThumbnails[0] == sortedThumbnails[1]) {
            sortedThumbnails.shift();
        }

        // Find the current thumbnail index or default to first.
        const thumbnailIndex = _.findIndex(sortedThumbnails, t => {
            return t.thumbnail_id == this.state.overlayThumbnailId;
        }) || 0;
        const thumbnailId = sortedThumbnails[thumbnailIndex].thumbnail_id;

        // Find the next and previous thumbnail ids for navigation.
        // Use modulo to ensure index is in [0, <length of thumbnails>).
        const thumbnailCount = sortedThumbnails.length;
        const nextThumbnailIndex = ( 1 + thumbnailIndex) % thumbnailCount;
        const prevThumbnailIndex = (-1 + thumbnailIndex + thumbnailCount) % thumbnailCount;
        const nextThumbnailId = sortedThumbnails[nextThumbnailIndex].thumbnail_id;
        const prevThumbnailId = sortedThumbnails[prevThumbnailIndex].thumbnail_id;

        // Find lift for the displayed thumb.
        const lift = this.props.stores.lifts
            [gender]
            [age]
            [tagId]
            [thumbnailId] || 0;

        // Build a map of thumbnail id to array of feature names.
        const thumbnailMap = this.getThumbnailMap(tagId);
        const thumbnailFeatures = _(this.props.stores.thumbnailFeatures
                [gender]
                [age])
            .pick(_.keys(thumbnailMap))
            .value();

        const thumbnailFeatureNameMap = {};
        _.map(thumbnailFeatures, (featureIds, thumbnailId) => {
            thumbnailFeatureNameMap[thumbnailId] = featureIds.map(id => {
                return this.props.stores.features[id];
            });
        })

        const copyOverrideMap = {};
        if (tag.tag_type === UTILS.TAG_TYPE_IMAGE_COL) {
            copyOverrideMap['copy.lift.explanation'] = 'copy.lift.explanation.images';
        }

        return (
            <ThumbnailOverlay
                thumbnails={sortedThumbnails}
                selectedItem={thumbnailIndex}
                displayThumbLift={lift}
                tagType={tag.tag_type}
                // Bind next/prev functions to store the next/prev thumb id
                handleClickNext={this.onOverlayClickNextPrev.bind(null, nextThumbnailId)}
                handleClickPrevious={this.onOverlayClickNextPrev.bind(null, prevThumbnailId)}
                closeThumbnailOverlay={this.onOverlayClose}
                openLearnMore={this.props.setSidebarContent.bind(null, 'learnMore')}
                thumbnailFeatureNameMap={thumbnailFeatureNameMap}
                copyOverrideMap={copyOverrideMap}
            />
        );

    },
    render: function() {
        const collections = this.props.shownIds.map(tagId => {
            return this.getCollectionComponent(tagId);
        });
        return (
            <div>
                {this.getOverlayComponent()}
                <ul>{collections}</ul>
            </div>
        );
    },
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default CollectionsContainer;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
