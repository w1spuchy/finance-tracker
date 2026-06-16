const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const { text } = require('stream/consumers');


async function getPdfText(filePath) {
    const buffer = fs.readFileSync(filePath);
	const parser = new PDFParse({ data: buffer });
	return await parser.getText();
}

async function getPaymentRecords(filePath, bank) {
    switch(bank)
    {
        case "BelarusBank":
        {
            const pdfText = String((await getPdfText(filePath)).text);
            const isValid = isFormatValid(pdfText, bank);
            if(!isValid) throw new Error("Wrong file format");

            const normalized = pdfText
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            const rows = normalized
                  .split(/(?=\d{4} \d{2}\*\* \*\*\*\* \d{4})/)
                  .slice(1)
                  .flatMap((el)=>
                  {
                    el = el.trim();
                    if(/--\s\d of \d --/.test(el))
                    {
                        const match = el.match(/--\s\d of \d --/)[0]
                        const textToSliceIndex = el.indexOf(match);
                        el = el.slice(0, textToSliceIndex).trim();
                    }
                    const consumptionRegex = /\d{4} \d{2}\*\* \*\*\*\* \d{4} \d{2}\.\d{2}\.\d{4} \d{2}:\d{2} \d{2}\.\d{2}\.\d{4} \d{2}:\d{2} (.+?) [A-Z]{3} (Приход|Расход) \d+\.\d{2} \d+\.\d{2} \d+\.\d{2} \d{4}/;
                    const formatMatch = el.match(consumptionRegex)[0];
                    if(formatMatch.length != el.length)
                    {
                        const incomeString = el.slice(el.indexOf(formatMatch) + formatMatch.length).trim();
                        const incomes = incomeString.split(/(?=\d{2}\.\d{2}\.\d{4} \d{2}:\d{2} \d{2}\.\d{2}\.\d{4} \d{2}:\d{2})/).map((income)=>{ return income.trim() });
                        return incomes
                    }
                    return el;
                  });
 

            const paymentRecords = [];
            rows.forEach(row => {
                const type = row.match(/(Приход|Расход)/)[1];
                const date = row.match(/\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}/)[0];
                const sum = type === "Расход" ? row.match(/Расход (\d+\.\d{2}) \d+\.\d{2}/)[1] : row.match(/Приход \d+\.\d{2} (\d+\.\d{2})/)[1];
                const description = row.match(/\d{2}\.\d{2}\.\d{4} \d{2}:\d{2} \d{2}\.\d{2}\.\d{4} \d{2}:\d{2} (.+?) BYN/)[1];
                paymentRecords.push({
                    type: type,
                    date: date,
                    sum: sum,
                    description: description
                })
            })

            paymentRecords.sort((a, b)=>
            {
                return parseDate(a.date) - parseDate(b.date);
            })

            return paymentRecords;
        }
        default: throw new Error("No such bank type") 
    }
}

function parseDate(dateString)
{
    const [dayPart, timePart] = dateString.split(" ");
    const [day, month, year] = dayPart.split(".");
    return new Date(`${year}-${month}-${day}T${timePart}`);
}

function isFormatValid(text, bank)
{
    switch(bank)
    {
        case "BelarusBank":
        {
            const isValidFormat = /Выписка по счету/.test(text) &&
                                    /за период \d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/.test(text) &&
                                    /Регистрационный номер приложения:\s\d+/.test(text) &&
                                    /Номер телефона регистрации приложения:\s375(29|33|44)\d{7}/.test(text) &&
                                    /Сформирована:\s\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}/.test(text) &&
                                    /ФИО владельца счета:\s[а-яА-Я\s'-]{1,50}\s[а-яА-Я\s'-]{1,50}\s[а-яА-Я\s'-]{5,50}/.test(text) &&
                                    /Название счета:\s(Базовый счет|Виртуальный текущий счет)/.test(text) &&
                                    /IBAN:\sBY[A-Z0-9]{26}/.test(text) &&
                                    /Валюта счета:\s[A-Z]{3}/.test(text) &&
                                    /Лимит овердрафта:\s\d+\.\d{2}/.test(text) &&
                                    /Остаток на начало периода:\s\d+\.\d{2}/.test(text) &&
                                    /Зачислено за период:\s\d+\.\d{2}/.test(text) &&
                                    /Сумма расходных операций за период:\s\d+\.\d{2}/.test(text) &&
                                    /Дата последней операции по счету:\s\d{2}\.\d{2}\.\d{4}/.test(text);

            // console.log(`Выписка: ${/Выписка по счету/.test(pdfText)}`);
            // console.log(`За период: ${/за период \d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/.test(pdfText)}`);
            // console.log(`Номер приложения: ${/Регистрационный номер приложения:\s\d+/.test(pdfText)}`);
            // console.log(`Номер телефона: ${/Номер телефона регистрации приложения:\s375(29|33|44)\d{7}/.test(pdfText)}`);
            // console.log(`Сформировано: ${/Сформирована:\s\d{2}\.\d{2}\.\d{4}\s\d{2}:\d{2}/.test(pdfText)}`);
            // console.log(`Имя: ${/ФИО владельца счета:\s[а-яА-Я\s'-]{1,50}\s[а-яА-Я\s'-]{1,50}\s[а-яА-Я\s'-]{5,50}/.test(pdfText)}`);
            // console.log(`Cчет: ${/Название счета:\s(Базовый счет|Виртуальный текущий счет)/.test(pdfText)}`);
            // console.log(`IBAN: ${/IBAN:\sBY[A-Z0-9]{26}/.test(pdfText)}`);
            // console.log(`Валюта счета: ${/Валюта счета:\s[A-Z]{3}/.test(pdfText)}`);
            // console.log(`Лимит овердрафта: ${/Лимит овердрафта:\s\d+\.\d{2}/.test(pdfText)}`);
            // console.log(`Остаток на начало периода: ${/Остаток на начало периода:\s\d+\.\d{2}/.test(pdfText)}`);
            // console.log(`Зачислено за период: ${/Зачислено за период:\s\d+\.\d{2}/.test(pdfText)}`);
            // console.log(`Сумма расходных операций за период: ${/Сумма расходных операций за период:\s\d+\.\d{2}/.test(pdfText)}`);
            // console.log(`Дата последней операции по счету: ${/Дата последней операции по счету:\s\d{2}\.\d{2}\.\d{4}/.test(pdfText)}`);
            return isValidFormat;
        }
        default: throw new Error("No such format");
    }
}

module.exports = 
{ 
    getPdfText,
    getPaymentRecords
};