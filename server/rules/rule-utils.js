import _ from "lodash";
import {formatText} from "../libs/utils";

export function getDateObjectAnswer(question) {
    return function (form) {
        const {day, month, year} = form[question].answer;
        return {
            text: form[question].text,
            answer: `${month}/${day}/${year}`
        };
    }
}

export function genCurrentDateTime(question, moreDay = 0) {
    return function () {
        return {
            text: question,
            answer: moment().add(moreDay, 'days').tz("America/New_York").format('MM/DD/YYYY @ hh:mm z')
        };
    }
}

function applyRule(rule, form) {
    if(_.isNumber(rule)) {
        return form[rule];
    }
    if(_.isFunction(rule)) {
        return rule(form);
    }
}

export function applySheetRule(rules, form) {
    return rules.map(rule => {
        if(_.isArray(rule)) {
            return rule.map(r => formatText(applyRule(r, form).answer || '')).filter(a => a.length > 0).join(", ");
        } else {
            return formatText(applyRule(rule, form).answer || '');
        }
    });
}
export function applySheetRuleForSlack(rules, form) {
    return rules.map(rule => {
        if(_.isArray(rule)) {
            return rule.map(r => applyRule(r, form));
        } else {
            return applyRule(rule, form);
        }
    });
}

export function getFormRule(form, sheetRules) {
    return _.filter(sheetRules, sheet => sheet.condition(form))[0];
}
