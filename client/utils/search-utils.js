let toSearchFormat = v => {
    return (typeof v === "string" ? v : v.toString()).toLowerCase().trim();
};

let findMatch = (item, [cur, ...rest], keyword) => {
    if (cur) {
        return (item.hasOwnProperty(cur) && toSearchFormat(item[cur]).indexOf(toSearchFormat(keyword)) !== -1) || findMatch(item, rest, keyword);
    }
    return false;
};


let simpleSearchArr = (arr, fields, keyword) => {
    return arr.filter((item) => findMatch(item, fields, keyword));
};


export {
    simpleSearchArr
}