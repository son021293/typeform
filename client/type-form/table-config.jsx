import React from "react";

import {CustomCheckBox} from "../common/custom-checkbox/custom-checkbox";

export const tableConfig = [
    {
        render: ({action, check}) => (
            <div className="c-b-w">
                <CustomCheckBox
                    onCheck={action.onCheck}
                    checked={check}
                />
            </div>

        ),
        className: "s-section",
        title: ""
    }, {
        render: ({data}) => data.submissionID,
        title: "Submission ID"
    }, {
        render: ({data}) => data.date_display,
        title: "Date Time"
    }, {
        render: ({data}) => data.username,
        title: "Name"
    }, {
        render: ({data}) => !data.hasError ? "Success" : "Fail",
        title: "Status"
    }, {
        render: ({action}) => (
            <button className="btn r-l"
                    onClick={action.onClick}
            >
                RE-LOG
            </button>
        ),
        title: "Actions"
    }
];