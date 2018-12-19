import { observable, action, computed, reaction } from 'mobx';

import clients from '../data/clients.json';
import googleApiUtils from '../utils/GoogleApiUtils';
import * as strings from '../constants/strings';

class CustomersStore {
    @observable customers = [];
    @observable selectedCountry = '';
    @observable selectedCity = '';
    @observable selectedCompanyId = '';
    @observable currentLocation = null;
    @observable fetchedAddress = '';
    @observable mapErrorMessage = '';

    constructor() {
        this.loadCustomers();
        this.setDefaults();
    }

    @action loadCustomers = () => {
        this.customers = clients.Customers;
    };

    @action setDefaults = () => {
        if (this.selectedCountry === '') {
            this.selectedCountry = this.allCountries[0];
            this.selectedCity = this.citiesByCountry[0];
            this.selectedCompanyId = this.companiesByCity[0].id;
        }
    };

    @computed get countriesWithCities() {
        const countriesWithCities = this.customers
            .map(c => ({ country: c.Country, city: c.City }))
            .reduce((acc, curr) => {
                if (acc.findIndex(e => e.country === curr.country) === -1) {
                    acc.push({ country: curr.country, cities: [curr.city] });
                }
                else if (!acc.find(e => e.country === curr.country).cities.includes(curr.city)) {
                    acc.find(e => e.country === curr.country).cities.push(curr.city);
                }
                return acc;
            }, [])
            .sort((a, b) => {
                const numeric = b.cities.length - a.cities.length;
                if (numeric === 0) {
                    if (a.country < b.country) { return -1; }
                    if (a.country > b.country) { return 1; }
                    return 0;
                }
                return numeric;
            });
        return countriesWithCities;
    }

    @computed get allCountries() {
        return this.countriesWithCities
            .map(c => c.country);
    }





    @computed get citiesByCountryWithCompanies() {
        const citiesByCountryWithCompanies = this.selectedCountry &&
            this.countriesWithCities
                .find(country => country.country === this.selectedCountry)
                .cities
                .map(city => ({
                    city: city,
                    companies: this.customers
                        .filter(cust => cust.City === city)
                        .map(cust => ({ id: cust.Id, company: cust.CompanyName }))
                }))
                .sort((a, b) => {
                    const numeric = b.companies.length - a.companies.length;
                    if (numeric === 0) {
                        if (a.city < b.city) { return -1; }
                        if (a.city > b.city) { return 1; }
                        return 0;
                    }
                    return numeric;
                });
        return citiesByCountryWithCompanies;
    }

    @computed get citiesByCountry() {
        return this.citiesByCountryWithCompanies &&
            this.citiesByCountryWithCompanies
                .map(c => c.city);
    }

    @computed get companiesByCity() {
        return this.selectedCity ?
            this.citiesByCountryWithCompanies
                .find(c => c.city === this.selectedCity)
                .companies
                .sort((a, b) => {
                    if (a.city < b.city) { return -1; }
                    if (a.city > b.city) { return 1; }
                    return 0;
                })
            : null;
    }

    @computed get currentAddress() {
        if (this.selectedCompanyId) {
            const customer = this.customers.find(c => c.Id === this.selectedCompanyId);
            const address = `${customer.Address}, ${customer.City}, ${customer.Country}`;
            return address;
        }
        return null;
    };

    getGeocode = reaction(
        () => this.currentAddress,
        async address => {
            if (address) {
                const response = await googleApiUtils.geocodeAddress(address);
                if (response.status === 'OK') {
                    this.currentLocation = response.results[0].geometry.location;
                    this.fetchedAddress = response.results[0].formatted_address;
                }
                else {
                    this.mapErrorMessage = `${strings.MAP_ERROR}${this.currentAddress} `
                }
            }
            else {
                this.currentLocation = null;
            }
        }
    );

    @action selectCountry = country => {
        this.selectedCountry = country;
        this.selectedCity = '';
        this.selectedCompanyId = '';
    };

    @action selectCity = city => {
        this.selectedCity = city;
        this.selectedCompanyId = '';
    }

    @action selectCompany = id => {
        this.selectedCompanyId = id;
    }
}

const customersStore = new CustomersStore();
export default customersStore;