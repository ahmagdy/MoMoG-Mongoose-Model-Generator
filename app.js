const beautifyer = require('js-beautify').js_beautify;
const fs = require('fs');

//Adding Title Case to String for only single word
String.prototype.toTitleCase = function () {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
}


let counter = 0;
let outputtedFile = `
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ${process.argv[process.argv.indexOf('-n') + 1].toLowerCase()}Schema = new Schema({
`;

for (let i = 4; i < process.argv.length; i++) {
    let item = process.argv[i];

    if ((item == '-f' || item == '--field') && counter == 0) {
        outputtedFile += `${process.argv[i + 1]}:{
    `;
        counter++;
        i++;
    }
    else if ((item == '-f' || item == '--field') && counter > 0) {
        outputtedFile = outputtedFile.toString().substring(0, outputtedFile.lastIndexOf(','));
        outputtedFile += `
    },
    ${process.argv[i + 1]}:{
    `;
        i++;
    }
    else if (item.toString().startsWith('-') && (item.toString() != '-f' && item.toString() != '--field') && counter >= 0) {
        console.log('-------------wrong Option-------------');
        let nextField = process.argv.slice(i + 1).indexOf('-f');
        i = nextField != -1 ? nextField + i : process.argv.length;
    }
    else {
        switch (item.toLowerCase()) {
            case 'r':
                outputtedFile += `required: true,`;
                break;
            case 'u':
                outputtedFile += `unique: true,`;
                break;
            case 'sf':
                outputtedFile += `select: false,`;
                break;
            case 'def':
                outputtedFile += i + 1 < process.argv.length ? `default: '${process.argv[i + 1]}',` : ``;
                i += 1;
                break;
            case 'ref':
                outputtedFile += (i + 1) < process.argv.length ? `ref: '${process.argv[i + 1]}',` : '';
                i += 1;
                break;
            case 'string':
                outputtedFile += `type: String,`;
                break;
            case 'num':
                outputtedFile += `type: Number,`;
                break;
            case 'id':
                outputtedFile += `type: Schema.Types.ObjectId,`;
                break;
            case 'date':
                outputtedFile += `type: Date,`;
                break;
            case 'arr':
                outputtedFile += `type: [],`;
                break;
            default:
                counter = 2;
                break;

        }
    }
}

outputtedFile += `}
  });
  module.exports = mongoose.model('${process.argv[process.argv.indexOf('-n') + 1].toTitleCase()}', ${process.argv[process.argv.indexOf('-n') + 1].toLowerCase()}Schema);
  `;

outputtedFile = beautifyer(outputtedFile);

fs.writeFile(`./${process.argv[process.argv.indexOf('-n') + 1].toLowerCase()}.js`, outputtedFile, (err) => {
    if (err) {
        console.log(`Something wrong Error: ${err}`);
        return;
    }
    console.log('Created!! in the same directory');
});
