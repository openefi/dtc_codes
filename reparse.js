/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const fs = require('fs');

const INFO = 'INFO';
const ERR = 'ERR';
const WARN = 'WARN';

const contains = (_contains, rawText) =>
  String(rawText).indexOf(_contains) > -1;

const reparse = (baseDir) => {
  const fileList = fs
    .readdirSync(baseDir)
    .filter((file) => file.endsWith('.json'));

  fileList./* slice(0, 4). */ map((fileName) => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const raw = fs.readFileSync(baseDir + '/' + fileName);
    let jsonData = JSON.parse(raw);
    const { description } = jsonData;
    if (
      contains('Programmed', description) ||
      contains('Incompatible', description)
    ) {
      jsonData.type = INFO;
    } else if (
      contains('High', description) ||
      contains('Low', description) ||
      contains('Open', description)
    ) {
      jsonData.type = WARN;
    } else {
      jsonData.type = ERR;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    jsonData.info = jsonData.info.filter((tx) => !contains('Photo', tx));

    fs.writeFile(
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      baseDir + '/' + fileName,
      JSON.stringify(jsonData),
      'utf8',
      (err) => {
        err = err;
      }
    );
  });
};
reparse('./mocks/p0');
reparse('./mocks/p1');
reparse('./mocks/p2');
reparse('./mocks/p3');
reparse('./mocks/p4');
reparse('./mocks/p5');
reparse('./mocks/p6');
reparse('./mocks/p7');
reparse('./mocks/p8');

