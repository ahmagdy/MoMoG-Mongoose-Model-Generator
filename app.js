const beautifyer = require('js-beautify').js_beautify;
const fs = require('fs');

String.prototype.toTitleCase = function () {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
}

console.log(process.argv);
let counter = 0;
let outputtedFile = `
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ${process.argv[process.argv.indexOf('-n') + 1].toLowerCase()}Schema = new Schema({
`;
for (let i = 4; i < process.argv.length; i++) {
    let item = process.argv[i];
    console.info(item);
    if ((item == '-f' || item == '--field') && counter > 0) {
        outputtedFile = outputtedFile.toString().substring(0, outputtedFile.lastIndexOf(','));
        counter = 0;
        outputtedFile += `
    },
    `;

        // continue; //Not Work
        // } else if (item && counter == 1) {

    }
    if ((item == '-f' || item == '--field')) continue;

    if (item.toString().startsWith('-') && (item.toString() != '-f' && item.toString() != '--field') && counter >= 0) {
        console.log(`---------------------- Invoked ${item} `);
        i += 1; //يعديه وواحد كمان بعده

    } else {
        if (counter == 0) {
            console.log(`------------------ ${item}`);
            outputtedFile += `${item}:{
    `;
            counter++;
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

}

outputtedFile += `}
  });
  module.exports = mongoose.model('${process.argv[process.argv.indexOf('-n') + 1].toTitleCase()}', ${process.argv[process.argv.indexOf('-n') + 1].toLowerCase()}Schema);
  `;

outputtedFile = beautifyer(outputtedFile);
console.log(outputtedFile);
fs.writeFile(`./${process.argv[process.argv.indexOf('-n') + 1].toLowerCase()}.js`, outputtedFile, (err) => {
    if (err) {
        console.log(`Something wrong Error: ${err}`);
        return;
    }
    console.log('Created!!');
});
