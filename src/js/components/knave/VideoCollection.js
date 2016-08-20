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
    DeleteControl} from './InfoActionPanels';

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
        this.setState({ selectedPanel : panelId });  
    }, 
    render: function() {
        const panels = [
            <InfoDemoLiftPanel
                tagId={this.props.tagId}
                title={this.props.videoTitle}
                onDemographicChange={this.props.onDemographicChange}
                demographicOptions={this.props.demographicOptions}
                selectedDemographic={this.props.selectedDemographic}
            />,
            <FilterPanel />,
            <SharePanel />,
            <EmailPanel />,
            <DeletePanel  
                deleteCollection={this.props.deleteCollection}
                id={this.props.videoId}
                cancelClickHandler={()=>{this.setSelectedPanel(0)}} 
            />, 
        ];  
        const controls = [
            <ShareControl handleClick={()=>{this.setSelectedPanel(2)}} />,
            <EmailControl handleClick={()=>{this.setSelectedPanel(3)}} />,
            <DeleteControl handleClick={()=>{this.setSelectedPanel(4)}} />
        ] 
        return (
            <BaseCollection
                {...this.props}
                leftFeatureTitle={T.get('copy.currentThumbnail')}
                rightFeatureTitle={T.get('copy.topNeonImage')}
                infoActionPanels={panels}
                infoActionControls={controls}
                selectedPanel={this.state.selectedPanel}
            />
        );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default VideoCollection;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
