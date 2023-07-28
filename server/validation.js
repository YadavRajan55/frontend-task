const yup = require("yup");
let validateObj = {}
validateObj['fetchStockData'] = yup.object().shape({
    stocksTicker: yup.string().strict().required(),
    Date: yup.string().strict().required(),
})

module.exports = validateObj;