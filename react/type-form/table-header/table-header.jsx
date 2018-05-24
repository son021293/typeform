import React from "react";

export class TableHeader extends React.Component{
    constructor(props){
        super(props);
        this.state={
        };
    };
    render(){
        const lines = [
            {
                title: "",
                className: "s-section"
            } ,{
                title: "Submission ID"
            } ,{
                title: "Date Time"
            } ,{
                title: "Name"
            } ,{
                title: "Status"
            } , {
                title: "Actions"
            }
        ];
        return(
            <thead>
                <tr className="t-h">
                    {lines.map(({title, className}, i) => (
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