import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ListColumn from './ListColumn';
import MapContainer from '../maps/MapContainer';

@inject(stores => {
    const { allCountries, selectCountry, selectedCountry,
        citiesByCountry, selectCity, selectedCity,
        companiesByCity, selectCompany, selectedCompanyId, currentAddress, currentLocation } = stores.store;
    return {
        allCountries, selectCountry, selectedCountry,
        citiesByCountry, selectCity, selectedCity,
        companiesByCity, selectCompany, selectedCompanyId, currentAddress, currentLocation
    };
})
@observer
class CustomerPicker extends Component {
    render() {
        return (
            <div className='picker-container'>
                <ListColumn
                    data={this.props.allCountries}
                    selectItem={this.props.selectCountry}
                    selectedItem={this.props.selectedCountry}
                />

                <ListColumn
                    data={this.props.citiesByCountry}
                    selectItem={this.props.selectCity}
                    selectedItem={this.props.selectedCity}
                />

                <ListColumn
                    data={this.props.companiesByCity}
                    selectItem={this.props.selectCompany}
                    selectedItem={this.props.selectedCompanyId}
                    isCompany={true}
                />
                <div>{this.props.currentAddress}</div>
                <div>{this.props.currentLocation && this.props.currentLocation.lat}</div>

                <MapContainer location={this.props.currentLocation} />
            </div>
        );
    }
}

export default CustomerPicker;