import React from "react";

export class EachRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check: false
        };
    };

    handleReLog = () =>{

    };

    handleSelected = cur =>{
        this.setState({check: !cur});
    };

    render() {
        let {render, className, data} = this.props;
        return (
            <td
                className={`t-col ${className ? className : ""}`}
            >
                {
                    render({
                        check: this.state.check,
                        data,
                        action: {
                            onClick: this.handleReLog,
                            onCheck: this.handleSelected
                        }
                    })
                }
            </td>
        );
    }
}