import {easyLint} from '@ampproject/toolbox-linter/dist/cli';
import chalk, { bold } from 'chalk';
import {LintMode, Status, Result} from '@ampproject/toolbox-linter';
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import {LintData} from './models';
import date from 'date-and-time';
import program, { args } from 'commander';
import { sheetsDTO, sheetsObj } from './sheetsDataTransferObject';

const TOKEN_PATH = './token.json';
const CRED_PATH = './credentials.json';

const log = console.log;
const currDate = new Date();
const keys: string[] = Object.keys(new sheetsObj());
var sheetData: sheetsDTO[] = [];
var returnData: string[][] = [];
returnData.push(keys as string[]);
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];


async function start(argv: string[]) {
  program
    .usage('npm run start -i [sheet-id] -r [range]')
    .option('-i, --sheet-id <type>', 'Google Sheets ID found after /d in URL')
    .option('-r, --range <type>', 'Spreadsheet name and range in A1 notation')
    

    if (argv.length <= 2) {
      program.help();
    }

    program.parse(argv);

    analyze(program.args[0], program.args[1]);
    
}

async function analyze(id: string, range: string) {
  // Connect to OAuth for token
  log(chalk.yellowBright("Verifying API access..."));
  const auth = await authorize(JSON.parse(fs.readFileSync(CRED_PATH, 'utf8')));
  const sheets = google.sheets({ version: 'v4', auth });
  log(chalk.green("API Key Verified") + "\n");
  log(chalk.yellowBright("Fetching external spreadsheet...\n"));
  const sheet_id = id;
  const ranges = range;

  // Read URLs from Sheet
  try {
    if (auth) {
      const results = await sheets.spreadsheets.values.get({
        spreadsheetId: sheet_id,
        range: ranges
      });
  
      if (results) {
        const rows = results.data.values;
        
        if (rows) {
          rows.map((row) => {
            let rowData = new sheetsObj();
            rowData.story_id = row[0];
            rowData.partner_name = row[1];
            rowData.partner_domain = row[2];
            rowData.title = row[3];
            rowData.url = row[4];
            rowData.timestamp = date.format(currDate, 'MM/DD/YYYY');
            sheetData.push(rowData);
          })
        }
      }
    } 
  } catch (err) {
    log(chalk.red("There was an error connecting to the spreadsheet"));
  }
  
  
  // Run Linter on all collected urls
  for(var row of sheetData) {
    try {
      if (row.url) {
        let parseToJson = await easyLint({
          url: row.url,
          userAgent: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Mobile Safari/537.36\"",
          format: "json",
          headers: {},
          force: LintMode.AmpStory,
          showPassing: false,
          reportMode: false
        });

        let data: LintData = JSON.parse(parseToJson);
        log(`URL: ${chalk.blue(row.url)}`);

        for (const key of keys) {
          if (row[key as keyof sheetsObj] !== null && data[key as keyof LintData]) {
            if (Array.isArray(data[key as keyof LintData])) {
              for (const metadata of data[key as keyof LintData] as Result[]) {
                if ((data[key as keyof LintData] as Result).status === undefined) {
                  (row[key as keyof sheetsObj] as string) = "FAIL";
                } else if ((data[key as keyof LintData] as Result).status === Status.PASS) {
                  (row[key as keyof sheetsObj] as string) = "PASS";
                } else {
                  (row[key as keyof sheetsObj] as string) = (data[key as keyof LintData] as Result).status + "\n" + (data[key as keyof LintData] as Result).message;
                }
              }
            } else {
              if ((data[key as keyof LintData] as Result).status === undefined) {
                (row[key as keyof sheetsObj] as string) = "FAIL";
              } else if ((data[key as keyof LintData] as Result).status === Status.PASS) {
                (row[key as keyof sheetsObj] as string) = "PASS";
              } else {
                (row[key as keyof sheetsObj] as string) = (data[key as keyof LintData] as Result).status + "\n" + (data[key as keyof LintData] as Result).message;
              }
            }
          }
        }

        // convert all kv pairs to a string array of values for submission
        returnData.push(row.toArray());
        log("_________________________");
      }
    }
    catch (e) {
      log(e);
    }
  }
    
  // Create a new tab and push the linter output
  if (auth) {
    var res; 
    var headers;
    var tab_id: number = 0;
    const newSheetLabel: string = `${ranges.split('!')[0]} Results [${date.format(currDate, 'MM/DD/YYYY h:mm:ss')}]`;
    const payload = {
      "values": returnData
    }
  
    try {
      res = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheet_id,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: newSheetLabel
              }
            }
          }]
        }
      });

      //get ID of newly created tab and format headers
      const sheet_metadata = await sheets.spreadsheets.get({spreadsheetId: sheet_id});
      if (sheet_metadata.data.sheets) {
        for(var s of sheet_metadata.data.sheets){
          if (s.properties && s.properties.title === newSheetLabel) {
            tab_id = s.properties.sheetId as number;
            break;
          }
        }
      }
      

      headers = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheet_id,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: tab_id,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: returnData[0].length  //# of fields in sheetsObj
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      "red": 0.0,
                      "green": 0.0,
                      "blue": 0.0,
                    },
                    horizontalAlignment: "CENTER",
                    textFormat: {
                      foregroundColor: {
                        "red": 1.0,
                        "green": 1.0,
                        "blue": 1.0,
                      },
                      bold: true,
                      fontSize: 11
                    },
                  }
                },
                fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
              }
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId: tab_id,
                  gridProperties: {
                    "frozenRowCount": 1,
                    "frozenColumnCount": 6,
                  }
                },
                fields: "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"
              }
            },
          ]
        }
      })
    } catch (err) {
      log(chalk.red("There was an error creating a new tab."));
    }

    if(res && headers) {
      try { 
        const addedData = await sheets.spreadsheets.values.update({
          spreadsheetId: sheet_id,
          range: `${newSheetLabel}!A1:Z${returnData.length}`,
          valueInputOption: "RAW",
          requestBody: payload,
        });
        sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheet_id,
          requestBody: {
            requests : [
              {
                autoResizeDimensions : {
                  dimensions : {
                    sheetId: tab_id,
                    dimension: "ROWS",
                    startIndex: 0,
                    endIndex: 1,
                  }
                }
              }
            ]
          }
        });
        log("\n");
        if (addedData) log(chalk.blueBright(`Run complete. Results have been added to a new tab @ https://docs.google.com/spreadsheets/d/${sheet_id}\n`));
      } catch (err) {
        log(chalk.red("There was an error while trying to insert results."));
      }
    }
  }
}

// Sheets API Typescript QuickStart code found here:
// https://dev.to/patarapolw/google-sheets-api-quickstart-in-typescript-4peh

async function authorize (cred: any) {
  
  const { client_secret, client_id, redirect_uris } = cred.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')))
      return oAuth2Client
    }
  } catch(err) {
    console.log('Visit this link to enable the API: https://developers.google.com/sheets/api/quickstart/nodejs . Save your credentials.json file in the batch_linter folder');
  }

  return getNewToken<typeof oAuth2Client>(oAuth2Client)
}

async function getNewToken<T = any> (oAuth2Client: any): Promise<T> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  console.log('Authorize this app by visiting this url:\n', authUrl);
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

start(process.argv);
