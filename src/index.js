import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import './index.css';
import customersStore from './stores/CustomersStore';
import App from './App';

ReactDOM.render(<Provider store={customersStore}><App /></Provider>, document.getElementById('root'));