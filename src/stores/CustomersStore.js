import { observable, action, computed } from 'mobx';

import clients from '../data/clients.json';

class CustomersStore {
    @observable customers = [];

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

    @computed get allCountries() {
        const a = this.customers
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
        console.log(a);
        return a.map(c => c.country);
    }
}

const customersStore = new CustomersStore();
export default customersStore;