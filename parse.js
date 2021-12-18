/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.obd-codes.com/p22-codes';

const scrap = async (pcode) => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
    executablePath: '/bin/chromium',
  });
  const startPage = await browser.newPage();

  await startPage.setViewport({
    width: 1200,
    height: 720,
    deviceScaleFactor: 1,
  });

  await startPage.goto('https://www.obd-codes.com/p' + pcode + '-codes');

  const DTCLinks = (
    await startPage.evaluate(() => {
      return Array.from(document.getElementsByTagName('li')).map(
        (li) => li.children[0]?.href
      );
    })
  )
    .filter(Boolean)
    .filter((url) => String(url).indexOf('/p') > -1);

  await startPage.close();

  for (let index = 0; index <= DTCLinks.length; index++) {
    let code = DTCLinks[index];
    if (!code) return;
    const page = await browser.newPage();

    //    console.log(code);
    await page.goto(code);

    const DTCDescription = await page.evaluate(() => {
      return document.getElementsByClassName('tcode')[0].innerText;
    });

    const DTCCode = code.slice(-5);

    console.log(`DTC Code ${code.slice(-5)}, Description: ${DTCDescription}`);

    const DTCInfo = await page.evaluate(() => {
      let meaningIndex = 0;
      let endIndex = 0;

      const mainChildrends = Array.from(
        document.getElementsByClassName('main')[0].children
      );

      for (let nodeIndex = 0; nodeIndex < mainChildrends.length; nodeIndex++) {
        const element = mainChildrends[nodeIndex];
        // console.log(element.innerText);
        if (String(element.innerText).indexOf('What does that mean') > -1) {
          meaningIndex = nodeIndex;
          //console.log(element.innerText);
        }
        if (
          element.localName === 'h2' &&
          meaningIndex != 0 &&
          meaningIndex != nodeIndex
        ) {
          endIndex = nodeIndex;
          break;
        }
      }

      const MeaningChilds = mainChildrends.slice(meaningIndex + 1, endIndex);
      return MeaningChilds.map((el) => el.innerText).filter(
        (tx) => tx.length > 1
      );
    });

    const DTCSymptoms = await page.evaluate(() => {
      let meaningIndex = 0;
      let endIndex = 0;

      const mainChildrends = Array.from(
        document.getElementsByClassName('main')[0].children
      );

      for (let nodeIndex = 0; nodeIndex < mainChildrends.length; nodeIndex++) {
        const element = mainChildrends[nodeIndex];
        // console.log(element.innerText);
        if (String(element.innerText).indexOf('Symptoms') > -1) {
          meaningIndex = nodeIndex;
          //console.log(element.innerText);
        }
        if (
          element.localName === 'h2' &&
          meaningIndex != 0 &&
          meaningIndex != nodeIndex
        ) {
          endIndex = nodeIndex;
          break;
        }
      }

      const MeaningChilds = mainChildrends.slice(meaningIndex + 1, endIndex);
      return MeaningChilds.map((el) => el.innerText).filter(
        (tx) => tx.length > 1
      );
    });

    const DTCCauses = await page.evaluate(() => {
      let meaningIndex = 0;
      let endIndex = 0;

      const mainChildrends = Array.from(
        document.getElementsByClassName('main')[0].children
      );

      for (let nodeIndex = 0; nodeIndex < mainChildrends.length; nodeIndex++) {
        const element = mainChildrends[nodeIndex];
        // console.log(element.innerText);
        if (String(element.innerText).indexOf('Causes') > -1) {
          meaningIndex = nodeIndex;
          //console.log(element.innerText);
        }
        if (
          element.localName === 'h2' &&
          meaningIndex != 0 &&
          meaningIndex != nodeIndex
        ) {
          endIndex = nodeIndex;
          break;
        }
      }

      const MeaningChilds = mainChildrends.slice(meaningIndex + 1, endIndex);
      return MeaningChilds.map((el) => el.innerText).filter(
        (tx) => tx.length > 1
      );
    });

    /*     console.log('DTC INFO - WIP');
    console.log(DTCInfo);
    console.log('DTC Symptoms - WIP');
    console.log(DTCSymptoms);
    console.log('DTC Causes - WIP');
    console.log(DTCCauses); */

    const jsonData = JSON.stringify({
      code: DTCCode.toUpperCase(),
      description: DTCDescription,
      info: DTCInfo,
      symptoms: DTCSymptoms,
      causes: DTCCauses,
    });

    fs.writeFile(
      'mocks/p' + pcode + '/' + `${DTCCode}.json`,
      jsonData,
      'utf8',
      (err) => {
        err = err;
      }
    );

    await page.close();
  }
  //var xpath = "//a[text()='SearchingText']";
  // var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  // por pagina:
  // Array.from(document.getElementsByClassName("main")[0].children)[3]
  // H2 con => What does that mean?
};

void (async () => {
/*   await void scrap('23');
  await void scrap('24');
  await void scrap('25');
  await void scrap('26');
  await void scrap('27');
  await void scrap('28'); */
  await void scrap('34');
})();
