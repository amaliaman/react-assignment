import React, { Component, Fragment } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

import { API_KEY } from '../../constants/env';
import * as dim from '../../constants/dimensions';

class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {}
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    render() {
        // Show only error message (if there's one)
        if (this.props.error) {
            return (
                <Fragment>
                    <div className='title'>{this.props.title}</div>
                    <div className='map-error'>{this.props.error}</div>
                </Fragment>
            )
        }

        // Show only map (if everything's OK)
        const location = this.props.location ? this.props.location : dim.defaultLocation;
        const isVisible = this.props.location ? true : false;

        return (
            <div className='map-container'>
                <div className='title'>{this.props.title}</div>
                <div className='map-wrapper'>
                    <Map
                        google={this.props.google}
                        zoom={dim.initialZoom}
                        style={dim.mapStyles}
                        center={location}
                        visible={isVisible}
                    >
                        <Marker
                            onClick={this.onMarkerClick}
                            position={location}
                        />
                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}
                            onClose={this.onClose}
                        >
                            <div>{this.props.address}</div>
                        </InfoWindow>
                    </Map>
                </div>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: API_KEY
})(MapContainer);