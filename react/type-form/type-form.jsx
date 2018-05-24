import React, {Fragment} from "react";
import {formItemApi} from "../api/common/form-item-api";
import {DataTable} from "./data-table/data-table";
import {tableConfig} from "./table-config";

export class TypeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        formItemApi.getForms().then(data => this.setState({data}))
    };

    render() {
        let {data} = this.state;
        return (
            <Fragment>
                <div className="container t-c">
                    <div className="rl-s-w">
                        <button className="rl-s btn"
                                onClick={() => {
                                    // postForms(formData);
                                }}
                        >
                            RE-LOG SELECTED
                        </button>
                    </div>
                    <div className="t-w">
                        {/* todo search */}
                        <DataTable
                            list={data}
                            config={tableConfig}
                        />
                    </div>

                </div>
            </Fragment>
        );
    }
}