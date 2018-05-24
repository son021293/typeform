import mongoose from "mongoose";
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    date: Date,
    date_display: String,
    hasError: Boolean,
    submissionID: String,
    pretty: String,
    username: String,
    rawRequest: String,
    errorMessage: String
});

export const Submission = mongoose.model("Submission", submissionSchema);

