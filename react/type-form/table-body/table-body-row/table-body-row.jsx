import React from "react";
import {rowData} from "./row-data";
import {EachRow} from "./each-row/each-row";

export class TableBodyRow extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {data} = this.props;
        return(
            <tr className="t-b">
                {rowData.map((each, i) => (
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