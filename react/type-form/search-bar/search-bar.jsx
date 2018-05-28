import React from "react";

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };


    render() {
        let {val, onChange, placeholder} = this.props;
        return (
            <div className="search-bar">
                <input type="text"
                       onChange={e => onChange(e.target.value)}
                       value={val}
                       placeholder={placeholder}
                />
                <span className="line"/>
            </div>
        );
    }
}