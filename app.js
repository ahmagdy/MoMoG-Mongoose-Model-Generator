const beautifyer = require('js-beautify').js_beautify;
const commander = require('commander');
const fs = require('fs'),
    path = require('path');


//Adding Title Case to String for only single word
String.prototype.toTitleCase = function () {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
}

//function to Collect options of Commander
function collect(val, arr) {
    arr.push(val);
    return arr;
}

commander
    .option('-n, --name <modelName>', 'Define the model name')
    .option('-f, --field <FieldName>', 'Define Field Name', collect, [])
    .option('-d, --directory <DirectoryPath>', 'Path if the file')
    .parse(process.argv);


let counter = 0;
let outputtedFile = `
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ${commander.name.toLowerCase()}Schema = new Schema({
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
outputtedFile = outputtedFile.substr(0, outputtedFile.length - 1);
outputtedFile += `}
  });
  module.exports = mongoose.model('${commander.name.toTitleCase()}', ${commander.name.toLowerCase()}Schema);
  `;

outputtedFile = beautifyer(outputtedFile);

let fileName;
if (commander.directory && fs.existsSync(path.join(process.cwd(), commander.directory))) {
    fileName = path.join(process.cwd(), commander.directory, commander.name.toLowerCase());
} else {
    fileName = './' + commander.name.toLowerCase();
}

fs.writeFile(`${fileName}.js`, outputtedFile, (err) => {
    if (err) {
        console.log(`Something wrong Error: ${err}`);
        return;
    }
    console.log(`Created!! in the directory  ${fileName}.js`);
});