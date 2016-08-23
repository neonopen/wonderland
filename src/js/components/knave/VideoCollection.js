// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';

import BaseCollection from './BaseCollection';

import T from '../../modules/translation';

import {
    InfoDemoLiftPanel,
    InfoLiftPanel,
    FilterPanel,
    EmailPanel,
    EmailControl,
    SharePanel,
    ShareControl,
    DeletePanel,
    DeleteControl
} from './InfoActionPanels';

import { DeleteActions } from '../../stores/CollectionStores';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const VideoCollection = React.createClass({

    getInitialState: function() {
        return {
            // What panel to display, based on user input by
            // clicking on the buttons (email/del/share) in the right panel
            selectedPanel: 0
        };
    },
    setSelectedPanel: function(panelId) {
        var self = this;
        self.setState({
            selectedPanel: panelId
        });
    },
    getPanels() {
        var self = this;
        if (this.props.infoPanelOnly) {
            return [
                <InfoLiftPanel
                    title={this.props.title}
                />
            ];
        }
        return [
            <InfoDemoLiftPanel
                title={this.props.title}
                onDemographicChange={this.props.onDemographicChange}
                demographicOptions={this.props.demographicOptions}
                selectedDemographic={this.props.selectedDemographic}
                handleFiltersClick={self.setSelectedPanel(1)}
            />,
            <FilterPanel
                cancelClickHandler={this.setSelectedPanel(0)}
            />,
            <SharePanel
                cancelClickHandler={()=>{this.setSelectedPanel(0)}}
                socialClickHandler={this.props.socialClickHandler}
                getShareUrl={this.props.getShareUrl}
                id={this.props.videoId}
                type={'video'} // TODO extract
            />,
            <EmailPanel
                cancelClickHandler={()=>{this.setSelectedPanel(0)}}
                getShareUrl={this.props.getShareUrl}
                sendResultsEmail={this.props.sendResultsEmail}
                id={this.props.videoId}
                type={'video'}
            />,
            <DeletePanel
                deleteCollection={this.props.deleteCollection}
                cancelClickHandler={()=>{this.setSelectedPanel(0)}}
            />,
        ];
    },

    getControls() {
        if (this.props.infoPanelOnly) {
            return [];
        }
        return [
            <ShareControl handleClick={()=>{this.setSelectedPanel(2)}} />,
            <EmailControl handleClick={()=>{this.setSelectedPanel(3)}} />,
            <DeleteControl handleClick={()=>{this.setSelectedPanel(4)}} />
        ];
    },

    render: function() {

        // Apply Video component-specific labels.
        const overrideMap = {
            'copy.worstThumbnail': 'copy.currentThumbnail',
            'copy.bestThumbnail': 'copy.topNeonImage',
            'action.showMore': 'copy.thumbnails.low',
            'action.showLess': 'copy.thumbnails.high'
        };

        return (
            <BaseCollection
                {...this.props}
                translationOverrideMap={overrideMap}
                infoActionPanels={this.getPanels()}
                infoActionControls={this.getControls()}
                selectedPanel={this.state.selectedPanel}
                wrapperClassName={'xxCollection xxCollection--video'}
            />
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default VideoCollection;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
