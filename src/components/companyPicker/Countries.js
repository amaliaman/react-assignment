import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject(stores => {
    const { allCountries } = stores.store;
    return { allCountries };
})
@observer
class Countries extends Component {
    render() {
        return (
            <div>
                {this.props.allCountries.map(b => <div>{b}</div>)}
            </div>
        );
    }
}

export default Countries;