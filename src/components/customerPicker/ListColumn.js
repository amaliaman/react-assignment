import React, { Component } from 'react';

const ListItem = props => (
    <div
        onClick={() => props.selectItem(props.value)}
        className={props.selectedItem === props.value ? 'selected' : null}
    >
        {props.label}
    </div>
);

class ListColumn extends Component {
    render() {
        const { data, isCompany } = this.props;

        return (
            <div className='list'>
                {data && data.map(c => {
                    const value = isCompany ? c.id : c;
                    const label = isCompany ? c.company : c;
                    return (
                        <ListItem
                            key={value}
                            value={value}
                            label={label}
                            selectItem={this.props.selectItem}
                            selectedItem={this.props.selectedItem}
                        />
                    )
                })}
            </div>
        );
    }
}

export default ListColumn;