import React, { Component, Fragment } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

import { API_KEY } from '../../constants/env';

const mapStyles = {
    width: '415px',
    height: '260px'
};

class MapContainer extends Component {
    state = {
        showingInfoWindow: false,  //Hides or the shows the infoWindow
        activeMarker: {},          //Shows the active marker upon click
        selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
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
        if (this.props.error) {
            return (
                <Fragment>
                    <div className='title'>{this.props.title}</div>
                    <div className='map-error'>{this.props.error}</div>
                </Fragment>
            )
        }

        const location = this.props.location ? this.props.location : { lat: 0, lng: 0 };
        const isVisible = this.props.location ? true : false;

        return (
            <div className='map-container'>
                <div className='title'>{this.props.title}</div>
                <div className='map-wrapper'>
                    <Map
                        google={this.props.google}
                        zoom={17}
                        style={mapStyles}
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