import React, {Fragment} from "react";
import {TableBody} from "./table-body/table-body";
import {TableHeader} from "./table-header/table-header";
import {formItemApi} from "../api/common/form-item-api";

export class TypeForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data: []
        };
        formItemApi.getForms().then(data => this.setState({data}))
    };
    render(){
        let {data} = this.state;
        return(
            <Fragment>
                <div className="container t-c">
                    <div className="rl-s-w">
                        <button className="rl-s btn"
                                onClick={()=>{
                                    // postForms(formData);
                                }}
                        >
                            RE-LOG SELECTED
                        </button>
                    </div>
                    <div className="t-w">
                        <table>
                            <TableHeader/>
                            <TableBody
                                list={data}
                            />
                        </table>
                    </div>

                </div>
            </Fragment>
        );
    }
}