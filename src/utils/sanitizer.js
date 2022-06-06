const { normalizeEmail, blacklist, escape, trim, whitelist } = require("validator");

const sanitizeInputs = (object) => {
    const sanitizedData = {};
    Object.keys(object).forEach(elem => {
        let value = object[elem]
        if (elem == "email"){
            value = normalizeEmail(value);
        };
        value = trim(value);
        value = escape(value);
        value = blacklist(value, "\\(){}[\\]");
        sanitizedData[elem] = value;
    });
    return sanitizedData;
};

module.exports = sanitizeInputs;

