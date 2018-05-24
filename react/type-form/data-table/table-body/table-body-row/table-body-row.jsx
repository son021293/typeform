import React from "react";
import {rowData} from "../../../table-config";
import {EachRow} from "./each-row/each-row";

export class TableBodyRow extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {data, config} = this.props;
        return(
            <tr className="t-b">
                {config.map((each, i) => (
                    <EachRow
                        {...each}
                        key={i}
                        data={data}
                    />
                ))

                }
            </tr>
        );
    }
}