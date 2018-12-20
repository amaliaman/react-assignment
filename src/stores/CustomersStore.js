import { observable, action, computed, reaction } from 'mobx';

import clients from '../data/clients.json';
import googleApiUtils from '../utils/GoogleApiUtils';
import * as strings from '../constants/strings';
import jsUtils from '../utils/JsUtils';

class CustomersStore {
    /** The original customers array from the external file */
    @observable customers = [];

    /** The currently selected country */
    @observable selectedCountry = '';

    /** The currently selected city */
    @observable selectedCity = '';

    /** The currently selected company's id */
    @observable selectedCompanyId = '';

    /** The currently selected company's coordinates, retrieved from geocoding service */
    @observable currentLocation = null;

    /** The currently selected company's address, retrieved from geocoding service */
    @observable fetchedAddress = '';

    /** An error message in case the address was not found in the map */
    @observable mapErrorMessage = '';

    constructor() {
        this.loadCustomers();
        this.setDefaults();
    }

    // ------------------------------------------------------------
    // Computed values
    // ------------------------------------------------------------

    /** Return an array of countries and their cities, ordered by number of cities */
    @computed get countriesWithCities() {
        const countriesWithCities = this.customers
            .reduce((acc, curr) => {
                if (acc.findIndex(c => c.country === curr.Country) === -1) {
                    acc.push({ country: curr.Country, cities: [curr.City] });
                }
                else if (!acc.find(c => c.country === curr.Country).cities.includes(curr.City)) {
                    acc.find(e => e.country === curr.Country).cities.push(curr.City);
                }
                return acc;
            }, [])
            .sort((a, b) => {
                const numeric = b.cities.length - a.cities.length;
                if (numeric !== 0) {
                    return numeric;
                }
                return jsUtils.sortStrings(a.country, b.country);
            });
        return countriesWithCities;
    }

    /** Return an array of all country names */
    @computed get allCountries() {
        return this.countriesWithCities
            .map(c => c.country);
    }

    /** 
     * Return an array of cities and their companies, ordered by number of companies,
     * whenever a new country is chosen
     */
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
                    if (numeric !== 0) {
                        return numeric;
                    }
                    return jsUtils.sortStrings(a.city, b.city);
                });
        return citiesByCountryWithCompanies;
    }

    /** Return an array of city names matching current country*/
    @computed get citiesByCountry() {
        return this.citiesByCountryWithCompanies &&
            this.citiesByCountryWithCompanies
                .map(c => c.city);
    }

    /**
     * Return an array of company name & ids, ordered alphabetically,
     * whenever a new city is chosen
     */
    @computed get companiesByCity() {
        return this.selectedCity &&
            this.citiesByCountryWithCompanies
                .find(c => c.city === this.selectedCity)
                .companies
                .sort((a, b) => jsUtils.sortStrings(a.company, b.company));
    }

    /** Return the full address of the current company */
    @computed get currentAddress() {
        if (this.selectedCompanyId) {
            const customer = this.customers.find(c => c.Id === this.selectedCompanyId);
            const address = `${customer.Address}, ${customer.City}, ${customer.Country}`;
            return address;
        }
        return null;
    };

    // ------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------

    /** Load all customers from external file */
    @action loadCustomers = () => {
        this.customers = clients.Customers;
    };

    /** Set the initial selected values */
    @action setDefaults = () => {
        if (this.selectedCountry === '') {
            this.selectedCountry = this.allCountries[0];
            this.selectedCity = this.citiesByCountry[0];
            this.selectedCompanyId = this.companiesByCity[0].id;
        }
    };

    /** Select a country */
    @action selectCountry = country => {
        this.selectedCountry = country;
        this.selectedCity = '';
        this.selectedCompanyId = '';
    };

    /** Select a city */
    @action selectCity = city => {
        this.selectedCity = city;
        this.selectedCompanyId = '';
    };

    /** Select a company */
    @action selectCompany = id => {
        this.selectedCompanyId = id;
    };

    // ------------------------------------------------------------
    // Reactions - side effects
    // ------------------------------------------------------------

    /** 
     * Make an ajax call to geocoding service whenever the current address 
     * changes, and get location object (coordinates) 
     */
    getGeocode = reaction(
        () => this.currentAddress,
        async address => {
            this.mapErrorMessage = '';
            if (address) {
                const response = await googleApiUtils.geocodeAddress(address);
                if (response.status === 'OK') {
                    this.currentLocation = response.results[0].geometry.location;
                    this.fetchedAddress = response.results[0].formatted_address;
                }
                else {
                    this.mapErrorMessage = `${strings.MAP_ERROR}${this.currentAddress}.`;
                }
            }
            else {
                this.currentLocation = null;
            }
        }
    );
}

const customersStore = new CustomersStore();
export default customersStore;