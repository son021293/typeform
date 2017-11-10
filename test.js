const {parseForm} = require("./dist/libs/utils");
const {applySheetRule, getFormRule} = require("./dist/controllers/sheets-rules");

const listTestForms = [
    // A
    {
        "date": "11/08/2017 @ 13:11 EST",
        "formID": "70936128142151",
        "submissionID": "3859755280104305944",
        "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
        "ip": "173.91.0.10",
        "formTitle": "Development Support",
        "pretty": "1. Name:Joe Griffin, 2. Is this an issue, a feature idea/request, or a new ISM?:Issue, 18. Is this issue any of the following::None of the above, 19. Was this issue found by you or a client?:Me, 26. Summarize the issue:Opt-ins are not showing up on downloaded buyer reports, 27. List steps taken to replicate the issue in painstaking detail::1. Go to &quot;Spursgang&quot; outing\r\n2. Go to Buyer Report and check out Luis Ramos and Mac Pena\r\n3. Download the report\r\n4. These opt-ins are not listed on the downloaded spreadsheet., 28. What is the known scope of the issue?:All opt-ins/buyer reports, 32. Browser:Chrome, 33. Describe any known ways around the issue::Relying on the Opt-Ins area/report, 34. Is there anything else worth mentioning before submitting?:This may require a different form, but when you go to the buyer report area for this outing, you cannot click on &quot;View All 27 Opt-Ins&quot;.  I think this should be hyperlinked.",
        "username": "Josh_Groupmatics",
        "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Joe Griffin\",\"q39_2Is\":\"Issue\",\"q7_5Please\":\"\",\"q9_7Please\":\"\",\"q18_16Please\":\"\",\"q19_17How\":\"\",\"q20_18Is\":[\"None of the above\"],\"q21_19Was\":\"Me\",\"q22_20Name\":\"\",\"q23_21If\":\"\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"Opt-ins are not showing up on downloaded buyer reports\",\"q36_27List\":\"1. Go to &quot;Spursgang&quot; outing\\r\\n2. Go to Buyer Report and check out Luis Ramos and Mac Pena\\r\\n3. Download the report\\r\\n4. These opt-ins are not listed on the downloaded spreadsheet.\",\"q29_28What\":\"All opt-ins\\/buyer reports\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"Chrome\",\"q34_33Describe\":\"Relying on the Opt-Ins area\\/report\",\"q35_34Is\":\"This may require a different form, but when you go to the buyer report area for this outing, you cannot click on &quot;View All 27 Opt-Ins&quot;.  I think this should be hyperlinked.\",\"q71_organization\":\"\",\"q72_venueName\":\"\",\"q74_whichVenue\":\"\",\"q79_organizations\":\"\",\"q80_dateFrom\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"q81_dateTo\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"event_id\":\"1510165948969_70936128142151_FE1smSr\",\"q12_10What\":\"\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q24_22Have\":\"\",\"q25_23Please\":\"\",\"q38_3Is\":\"\",\"q40_4Did\":\"\",\"q41_6Did\":\"\",\"q42_8What\":\"\",\"q43_9What\":\"\",\"q73_doesThis\":\"\"}",
        "type": "WEB"
    },
    // B
    {
        "date": "10/27/2017 @ 10:10 EDT",
        "formID": "70936128142151",
        "submissionID": "3849254013225995848",
        "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
        "ip": "69.180.24.223",
        "formTitle": "Development Support",
        "pretty": "1. Name:Joe Rugo, 2. Is this an issue, a feature idea/request, or a new ISM?:Feature Idea/Request, 3. Is this feature idea/request for the frontend or backend of the system?:Frontend, 4. Did this feature idea/request come form a client or is it your own?:Client, 5. Please share the name, team, and position of the client who made this request.:Multiple.  Suns, Flyers, Spurs, 16. Please describe the feature idea/request.:Ability to list outings from different orgs under the same link.  So, the Suns can list a Suns, Mercury, and Rattlers game together. , 17. How is the GM experiences expected to be improved by this?:Increase sales for teams.",
        "username": "Josh_Groupmatics",
        "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Joe Rugo\",\"q39_2Is\":\"Feature Idea\\/Request\",\"q38_3Is\":\"Frontend\",\"q40_4Did\":\"Client\",\"q7_5Please\":\"Multiple.  Suns, Flyers, Spurs\",\"q9_7Please\":\"\",\"q18_16Please\":\"Ability to list outings from different orgs under the same link.  So, the Suns can list a Suns, Mercury, and Rattlers game together. \",\"q19_17How\":\"Increase sales for teams.\",\"q22_20Name\":\"\",\"q23_21If\":\"\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"\",\"q36_27List\":\"\",\"q29_28What\":\"\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"\",\"q34_33Describe\":\"\",\"q35_34Is\":\"\",\"q71_organization\":\"\",\"q72_venueName\":\"\",\"q74_whichVenue\":\"\",\"event_id\":\"1509116111803_70936128142151_hwxT0RA\",\"q12_10What\":\"\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q20_18Is\":\"\",\"q21_19Was\":\"\",\"q24_22Have\":\"\",\"q25_23Please\":\"\",\"q41_6Did\":\"\",\"q42_8What\":\"\",\"q43_9What\":\"\",\"q73_doesThis\":\"\"}",
        "type": "WEB"
    },
    // C
    {
        "date": "11/03/2017 @ 08:11 EDT",
        "formID": "70936128142151",
        "submissionID": "3855218425219453041",
        "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
        "ip": "98.103.171.25",
        "formTitle": "Development Support",
        "pretty": "1. Name:Joe Rugo, 2. Is this an issue, a feature idea/request, or a new ISM?:Feature Idea/Request, 3. Is this feature idea/request for the frontend or backend of the system?:Backend, 6. Did this feature idea/request come form a client or is it your own?:Client, 7. Please share the name, team, and position of the client who made the request:Champ Baginski, Clippers, 8. What level user would this feature/update affect?:Group Leader, 10. What area of the admin would this affect for Group Leaders?:Outing - Promote, 16. Please describe the feature idea/request.:Limit the number of codes that a group leader can send if they&#039;re promoting a &quot;free&quot; ticket., 17. How is the GM experiences expected to be improved by this?:Currently, a group leader can send unlimited codes (up to the number of emails limit).",
        "username": "Josh_Groupmatics",
        "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Joe Rugo\",\"q39_2Is\":\"Feature Idea\\/Request\",\"q38_3Is\":\"Backend\",\"q7_5Please\":\"\",\"q41_6Did\":\"Client\",\"q9_7Please\":\"Champ Baginski, Clippers\",\"q42_8What\":\"Group Leader\",\"q12_10What\":[\"Outing - Promote\"],\"q18_16Please\":\"Limit the number of codes that a group leader can send if they&#039;re promoting a &quot;free&quot; ticket.\",\"q19_17How\":\"Currently, a group leader can send unlimited codes (up to the number of emails limit).\",\"q22_20Name\":\"\",\"q23_21If\":\"\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"\",\"q36_27List\":\"\",\"q29_28What\":\"\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"\",\"q34_33Describe\":\"\",\"q35_34Is\":\"\",\"q71_organization\":\"\",\"q72_venueName\":\"\",\"q74_whichVenue\":\"\",\"q81_orgs\":\"\",\"q79_dateFrom\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"q80_dateTo\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"event_id\":\"1509712566716_70936128142151_piuo2Vc\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q20_18Is\":\"\",\"q21_19Was\":\"\",\"q24_22Have\":\"\",\"q25_23Please\":\"\",\"q40_4Did\":\"\",\"q43_9What\":\"\",\"q73_doesThis\":\"\"}",
        "type": "WEB"
    },
    // D
    {
        "date": "11/07/2017 @ 17:11 EST",
        "formID": "70936128142151",
        "submissionID": "3859029445889894025",
        "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
        "ip": "208.105.48.85",
        "formTitle": "Development Support",
        "pretty": "1. Name:Joe Rugo, 2. Is this an issue, a feature idea/request, or a new ISM?:Issue, 18. Is this issue any of the following::I or a Rep are unable to create an outing, 19. Was this issue found by you or a client?:Client, 20. Name, company, and email address of the client that reported the issue::Matt - Jazz, 22. Have you personally replicated the issue?:Yes, 26. Summarize the issue:The resend all button is not working for outing Sandy11132017., 27. List steps taken to replicate the issue in painstaking detail::1. Go to promote tab under Sandy11132017.\r\n2. Click Resend all.\r\n3. Cursor is moved to the message box but the email addresses to not carry through to the To line., 28. What is the known scope of the issue?:Only found this one.",
        "username": "Josh_Groupmatics",
        "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Joe Rugo\",\"q39_2Is\":\"Issue\",\"q7_5Please\":\"\",\"q9_7Please\":\"\",\"q18_16Please\":\"\",\"q19_17How\":\"\",\"q20_18Is\":[\"I or a Rep are unable to create an outing\"],\"q21_19Was\":\"Client\",\"q22_20Name\":\"Matt - Jazz\",\"q23_21If\":\"\",\"q24_22Have\":\"Yes\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"The resend all button is not working for outing Sandy11132017.\",\"q36_27List\":\"1. Go to promote tab under Sandy11132017.\\r\\n2. Click Resend all.\\r\\n3. Cursor is moved to the message box but the email addresses to not carry through to the To line.\",\"q29_28What\":\"Only found this one.\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"\",\"q34_33Describe\":\"\",\"q35_34Is\":\"\",\"q71_organization\":\"\",\"q72_venueName\":\"\",\"q74_whichVenue\":\"\",\"q79_organizations\":\"\",\"q80_dateFrom\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"q81_dateTo\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"event_id\":\"1510093604352_70936128142151_6dIWe47\",\"q12_10What\":\"\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q25_23Please\":\"\",\"q38_3Is\":\"\",\"q40_4Did\":\"\",\"q41_6Did\":\"\",\"q42_8What\":\"\",\"q43_9What\":\"\",\"q73_doesThis\":\"\"}",
        "type": "WEB"
    },
    //E
    {
        "date": "10/10/2017 @ 23:10 EDT",
        "formID": "70936128142151",
        "submissionID": "3835009994173346677",
        "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
        "ip": "180.93.7.14",
        "formTitle": "Development Support",
        "pretty": "1. Name:Britney, 2. Is this an issue, a feature idea/request, or a new ISM?:New ISM, Organization:a, Venue Name:a, Does this venue use the same ISM as another venue?:No",
        "username": "Josh_Groupmatics",
        "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Britney\",\"q39_2Is\":\"New ISM\",\"q7_5Please\":\"\",\"q9_7Please\":\"\",\"q18_16Please\":\"\",\"q19_17How\":\"\",\"q22_20Name\":\"\",\"q23_21If\":\"\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"\",\"q36_27List\":\"\",\"q29_28What\":\"\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"\",\"q34_33Describe\":\"\",\"q35_34Is\":\"\",\"q71_organization\":\"a\",\"q72_venueName\":\"a\",\"q73_doesThis\":\"No\",\"q74_whichVenue\":\"\",\"event_id\":\"1507691791397_70936128142151_10JqY3b\",\"q12_10What\":\"\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q20_18Is\":\"\",\"q21_19Was\":\"\",\"q24_22Have\":\"\",\"q25_23Please\":\"\",\"q38_3Is\":\"\",\"q40_4Did\":\"\",\"q41_6Did\":\"\",\"q42_8What\":\"\",\"q43_9What\":\"\"}",
        "type": "WEB"
    },
    //F
    {
        "date": "11/09/2017 @ 22:11 EST",
        "formID": "70936128142151",
        "submissionID": "3860932181519942023",
        "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
        "ip": "180.93.14.151",
        "formTitle": "Development Support",
        "pretty": "1. Name:Britney, 2. What can we help with?:Organization Review Report, Organization(s):222, Date From:11 08 2017, Date To:11 09 2017",
        "username": "Josh_Groupmatics",
        "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Britney\",\"q39_2What\":\"Organization Review Report\",\"q7_5Please\":\"\",\"q9_7Please\":\"\",\"q18_16Please\":\"\",\"q19_17How\":\"\",\"q22_20Name\":\"\",\"q23_21If\":\"\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"\",\"q36_27List\":\"\",\"q29_28What\":\"\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"\",\"q34_33Describe\":\"\",\"q35_34Is\":\"\",\"q71_organization\":\"\",\"q72_venueName\":\"\",\"q74_whichVenue\":\"\",\"q79_organizations\":\"222\",\"q80_dateFrom\":{\"month\":\"11\",\"day\":\"08\",\"year\":\"2017\"},\"q81_dateTo\":{\"month\":\"11\",\"day\":\"09\",\"year\":\"2017\"},\"preview\":\"true\",\"q12_10What\":\"\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q20_18Is\":\"\",\"q21_19Was\":\"\",\"q24_22Have\":\"\",\"q25_23Please\":\"\",\"q38_3Is\":\"\",\"q40_4Did\":\"\",\"q41_6Did\":\"\",\"q42_8What\":\"\",\"q43_9What\":\"\",\"q73_doesThis\":\"\"}",
        "type": "WEB"
    },
];

function processForm(form) {
    const parsedForm = parseForm(form);
    const formRule = getFormRule(parsedForm);
    const newRow = {
        range: formRule.sheet,
        row: applySheetRule(formRule.rule, parsedForm)
    };
    console.log(newRow);
}

listTestForms.forEach(form => processForm(form));



// const parsedForm = parseForm({
//     "date": "11/07/2017 @ 17:11 EST",
//     "formID": "70936128142151",
//     "submissionID": "3859029445889894025",
//     "webhookURL": "http://ec2-52-221-209-208.ap-southeast-1.compute.amazonaws.com:9090/api/typeform",
//     "ip": "208.105.48.85",
//     "formTitle": "Development Support",
//     "pretty": "1. Name:Joe Rugo, 2. Is this an issue, a feature idea/request, or a new ISM?:Issue, 18. Is this issue any of the following::I or a Rep are unable to create an outing, 19. Was this issue found by you or a client?:Client, 20. Name, company, and email address of the client that reported the issue::Matt - Jazz, 22. Have you personally replicated the issue?:Yes, 26. Summarize the issue:The resend all button is not working for outing Sandy11132017., 27. List steps taken to replicate the issue in painstaking detail::1. Go to promote tab under Sandy11132017.\r\n2. Click Resend all.\r\n3. Cursor is moved to the message box but the email addresses to not carry through to the To line., 28. What is the known scope of the issue?:Only found this one.",
//     "username": "Josh_Groupmatics",
//     "rawRequest": "{\"slug\":\"submit\\/70936128142151\\/\",\"q69_1Name69\":\"Joe Rugo\",\"q39_2Is\":\"Issue\",\"q7_5Please\":\"\",\"q9_7Please\":\"\",\"q18_16Please\":\"\",\"q19_17How\":\"\",\"q20_18Is\":[\"I or a Rep are unable to create an outing\"],\"q21_19Was\":\"Client\",\"q22_20Name\":\"Matt - Jazz\",\"q23_21If\":\"\",\"q24_22Have\":\"Yes\",\"q26_24Summarize\":\"\",\"q37_25List\":\"\",\"q27_26Summarize\":\"The resend all button is not working for outing Sandy11132017.\",\"q36_27List\":\"1. Go to promote tab under Sandy11132017.\\r\\n2. Click Resend all.\\r\\n3. Cursor is moved to the message box but the email addresses to not carry through to the To line.\",\"q29_28What\":\"Only found this one.\",\"q30_29Organization\":\"\",\"q31_30Outing\":\"\",\"q32_31Group\":\"\",\"q33_32Browser\":\"\",\"q34_33Describe\":\"\",\"q35_34Is\":\"\",\"q71_organization\":\"\",\"q72_venueName\":\"\",\"q74_whichVenue\":\"\",\"q79_organizations\":\"\",\"q80_dateFrom\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"q81_dateTo\":{\"month\":\"\",\"day\":\"\",\"year\":\"\"},\"event_id\":\"1510093604352_70936128142151_6dIWe47\",\"q12_10What\":\"\",\"q13_11What\":\"\",\"q14_12What\":\"\",\"q15_13What\":\"\",\"q16_14What\":\"\",\"q17_15What\":\"\",\"q25_23Please\":\"\",\"q38_3Is\":\"\",\"q40_4Did\":\"\",\"q41_6Did\":\"\",\"q42_8What\":\"\",\"q43_9What\":\"\",\"q73_doesThis\":\"\"}",
//     "type": "WEB"
// });