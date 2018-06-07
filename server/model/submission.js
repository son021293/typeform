import mongoose from "mongoose";
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    date: Date,
    date_display: String,
    hasError: Boolean,
    submissionID: String,
    username: String,
    errorMessage: String,
    sheet: String
});

export const Submission = mongoose.model("Submission", submissionSchema);

