const app = require("./app.js");
const {getPdfText, getPaymentRecords} = require("./utils/pdfParser.js");

app.listen(5000, async ()=>
{
    const path = "./utils/example_data/example_pdf_3.pdf";
    console.log("server is running");
    console.log(await getPaymentRecords(path, "BelarusBank"));
})