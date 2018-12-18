import { observable, action, computed, reaction } from 'mobx';

import clients from '../data/clients.json';

class CustomersStore {
    @observable customers = [];
    @observable selectedCountry = '';
    @observable selectedCity = '';
    @observable selectedCompanyId = '';

    @observable isLoading = true;///////////// implement

    constructor() {
        this.loadCustomers();
    }

    /**
     * Fetches all customers from the json file
     */
    @action loadCustomers = () => {
        this.isLoading = true;
        this.customers = clients.Customers;
        this.isLoading = false;
    }

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
                if (!numeric) {
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

    defaultCountry = reaction(
        () => this.allCountries.map(c => c),
        countries => { this.selectedCountry = countries[0]; }
    );

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
                    if (!numeric) {
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