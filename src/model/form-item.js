import mongoose from "mongoose";
const Schema = mongoose.Schema;

const formItemSchema = new Schema({
    date: Date,
    date_display:String,
    hasError: Boolean,
    formID: String,
    submissionID: String,
    webhookURL: String,
    ip: String,
    formTitle: String,
    pretty: String,
    username: String,
    rawRequest: String,
    type: String
});

export const FormItem = mongoose.model("FormItem", formItemSchema);

