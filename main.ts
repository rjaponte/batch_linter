import {easyLint} from '@ampproject/toolbox-linter/dist/cli';
import chalk from 'chalk';
import {LintMode, Status} from '@ampproject/toolbox-linter';
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import {LintData} from './models';
import date from 'date-and-time';

const log = console.log;
const currDate = new Date();

var urls: string[] = [];
// ["https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/"];

// Sheets API Typescript QuickStart code found here:
// https://dev.to/patarapolw/google-sheets-api-quickstart-in-typescript-4peh
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const TOKEN_PATH = './token.json';
const CRED_PATH = './credentials.json';


async function test() {
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, 'utf8')));
  const sheets = google.sheets({ version: 'v4', auth });
  log(chalk.green("API Key Verified") + "\n");
  // const sheetID = await readlineAsync('Enter the spreadsheet ID: \n> ');
  // const ranges = await readlineAsync("Enter the range [Ex. MySheet!A1:E5] \n> ");
  
  const sheetID: string = "1ud4p0g4XdX-tH67XpYnpUPZUWeOUkUsdJ4Iejg_UVkQ";
  const ranges = 'Sheet1!A2:E6';

  if (auth) {
    const results = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetID,
      range: ranges
    });

    if (results) {
      const rows = results.data.values;
      
      if (rows) {
        rows.map((row) => {
          urls.push(`${row[4]}`);
        })
      }
    }
  }
  
  for (const url of urls) {
    try {
      let parseToJson = await easyLint({
        url: url,
        userAgent: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Mobile Safari/537.36\"",
        format: "json",
        headers: {},
        force: LintMode.AmpStory,
        showPassing: false
      });

      let data: LintData = JSON.parse(parseToJson);

      // TODO: Check other attributes for status
      log(`URL: ${chalk.blue(url)}`);
      for (const meta of data.storymetadatathumbnailsareok) {
        if (meta.status === Status.PASS) continue;
        log(`Thumbs Status: ${meta.status}`);
        log(`Thumbs Message: ${meta.message}`);
      }
      if (data.linkrelcanonicalisok.status !== Status.PASS) {
        log(`Canonical Status: ${data.linkrelcanonicalisok.status}`);
        log(`Canonical Message: ${data.linkrelcanonicalisok.message}`);
      }
      console.log("_________________________");
    }
    catch (e) {
      console.log(e);
    }
  }

  // TODO: Timestamp results string
  if (auth) {
    var res; 
    const newSheetLabel: string = `${ranges.split('!')[0]} Results [${date.format(currDate, 'MM/DD/YYYY HH:MM')}]`;
    let payload = {
      majorDimension: "COLUMNS",
      "values": [
        urls
      ]
    }
    try {
      res = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: newSheetLabel
              }
            }
          }]
        }
      })
    } catch (err) {
      log(chalk.red("There was an error creating a new tab."));
    }

    if(res) {
      try { 
        const addedData = sheets.spreadsheets.values.update({
          spreadsheetId: sheetID,
          range: `${newSheetLabel}!A1:A${urls.length}`,
          valueInputOption: "RAW",
          requestBody: payload,
        });
        log("\n");
        log(chalk.blueBright(`Run complete. Results have been added to a new tab @ https://docs.google.com/spreadsheets/d/${sheetID}`));
      } catch (err) {
        log("There was an error while trying to insert results.");
      }
    }
  }
}

async function authorize (cred: any) {
  const { client_secret, client_id, redirect_uris } = cred.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')))
    return oAuth2Client
  }

  return getNewToken<typeof oAuth2Client>(oAuth2Client)
}

async function getNewToken<T = any> (oAuth2Client: any): Promise<T> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  console.log('Authorize this app by visiting this url:', authUrl);
  const code = await readlineAsync('Enter the code from that page here: ');
  const token = await new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (err: any, token: any) => {
      err ? reject(err) : resolve(token);
    })
  })
  oAuth2Client.setCredentials(token)
  // Store the token to disk for later program executions
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
  console.log('Token stored to', TOKEN_PATH)

  return oAuth2Client
}

async function readlineAsync (question: string) : Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close()
      resolve(answer)
    })
  })
}

test();
