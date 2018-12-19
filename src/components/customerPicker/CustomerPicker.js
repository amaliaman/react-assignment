import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ListColumn from './ListColumn';
import MapContainer from '../maps/MapContainer';

@inject(stores => {
    const { allCountries, selectCountry, selectedCountry,
        citiesByCountry, selectCity, selectedCity,
        companiesByCity, selectCompany, selectedCompanyId,
        fetchedAddress, currentLocation, mapErrorMessage } = stores.store;
    return {
        allCountries, selectCountry, selectedCountry,
        citiesByCountry, selectCity, selectedCity,
        companiesByCity, selectCompany, selectedCompanyId,
        fetchedAddress, currentLocation, mapErrorMessage
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

                <MapContainer location={this.props.currentLocation} address={this.props.fetchedAddress} error={this.props.mapErrorMessage} />
            </div>
        );
    }
}

export default CustomerPicker;