import React, { Component } from 'react';

import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
    width: '60%',
    height: '100%'
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
        const location = this.props.location ? this.props.location : { lat: 0, lng: 0 };
        return (
            <Map
                google={this.props.google}
                zoom={17}
                style={mapStyles}
                center={location}
                >
                <Marker
                    onClick={this.onMarkerClick}
                    name={'Kenyatta International Convention Centre'}
                    title='sdfsdf'
                    position={location}
                />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBDgy2yW_NWIkjA9IkIx2Z1VpSu8AUSGV0'
})(MapContainer);