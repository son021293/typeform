import React from "react";

export class TableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {titles} = this.props;
        return (
            <thead>
                <tr className="t-h">
                    {titles.map(({title, className}, i) => (
                        <th className={`t-col ${className ? className : ""}`}
                            key={i}
                        >
                            {title}
                        </th>
                    ))}
                </tr>
            </thead>
        );
    }
}