import React, {Fragment} from "react";
import {formItemApi} from "../api/common/appApi/api-list/form-item-api";
import {DataTable} from "./data-table/data-table";
import {tableConfig} from "./table-config";
import {SearchBar} from "./search-bar/search-bar";
import {simpleSearchArr} from "../utils/search-utils";

export class TypeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            search: ""
        };
        formItemApi.getForms().then(data => this.setState({data}))
    };

    render() {
        let {data, search} = this.state;
        let list = simpleSearchArr(data, ["submissionID", "username"], search);
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
                    <SearchBar
                        val={search}
                        onChange={search => this.setState({search})}
                        placeholder="Search"
                    />
                    <div className="t-w">
                        {/* todo search */}
                        <DataTable
                            list={list}
                            config={tableConfig}
                        />
                    </div>

                </div>
            </Fragment>
        );
    }
}