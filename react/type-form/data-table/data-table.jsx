import React from "react";
import {TableHeader} from "./table-header/table-header";
import {TableBody} from "./table-body/table-body";

export class DataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        let {list, config} = this.props;
        console.log(config);
        return (
            <table>
                <TableHeader
                    titles={config.map(({title, className}) =>
                        ({title, className})
                    )}
                />
                <TableBody
                    list={list}
                    config={config}
                />
            </table>
        );
    }
}