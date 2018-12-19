import React, { Component } from 'react';

const ListItem = props => (
    <div onClick={props.handleClick} className={props.cssClass}>
        {props.label}
    </div>
);

class ListColumn extends Component {
    render() {
        const { data, isCompany, selectedItem, selectItem } = this.props;

        return (
            <div className='list'>
                {data && data.map(c => {
                    const value = isCompany ? c.id : c;
                    return (
                        <ListItem
                            key={value}
                            label={isCompany ? c.company : c}
                            handleClick={() => selectItem(value)}
                            cssClass={selectedItem === value ? 'selected' : null}
                        />
                    )
                })}
            </div>
        );
    }
}

export default ListColumn;