import React from "react";
import {TableBodyRow} from "./table-body-row/table-body-row";

export class TableBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {list, config} = this.props;
        return (
            <tbody>
            {list.map((each, i) => (
                <TableBodyRow
                    data={each}
                    key={i}
                    config={config}
                />
            ))

            }
            </tbody>
        );
    }
}