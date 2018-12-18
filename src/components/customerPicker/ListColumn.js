import React, { Component } from 'react';

class ListColumn extends Component {
    
    getListItem = (value, label) => (
        <div
            key={value}
            onClick={() => this.props.selectItem(value)}
            className={this.props.selectedItem === value ? 'selected' : null}
        >
            {label}
        </div>
    )

    render() {
        const { data, isCompany } = this.props;

        return (
            <div className='list'>
                {data && data.map(c => {
                    const value = isCompany ? c.id : c;
                    const label = isCompany ? c.company : c;
                    return this.getListItem(value, label);
                })}
            </div>
        );
    }
}

export default ListColumn;