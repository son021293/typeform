import React from "react";

export class CustomCheckBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        let {label, checked, onCheck} = this.props;
        return(
            <label className="cb-c">
                {label}
                <input type="checkbox" checked={checked}
                       onChange={()=> onCheck(checked)}
                />
                <span className="check-mark"/>
            </label>
        );
    }
}