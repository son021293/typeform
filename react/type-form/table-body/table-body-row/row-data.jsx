import React from "react";

import {CustomCheckBox} from "../../../common/custom-checkbox/custom-checkbox";

export const rowData = [
    {
        render: ({action, check}) => (
            <div className="c-b-w">
                <CustomCheckBox
                    onCheck={action.onCheck}
                    checked={check}
                />
            </div>

        ),
        className: "s-section"
    }, {
        render: ({data}) => data.submissionID
    } , {
        render: ({data}) => data.date_display
    } , {
        render: ({data}) => data.username
    } , {
        render: ({data}) => !data.hasError ? "Success" : "Fail"
    } , {
        render: ({action}) => (
            <button className="btn r-l"
                    onClick={action.onClick}
            >
                RE-LOG
            </button>
        )
    }
];