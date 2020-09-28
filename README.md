# batch_linter

Usage

  Startup:
  Clone the project into a local directory
  Enter run npm install to download dependencies
  Navigate to the amp-toolbox subdirectory and run npm install again
  Navigate back to the batch-linter level

To run please include the following args:
      --sheet-id or -i : spreadsheet ID found in the Google Sheets URL after /d 
      --range or -r : spreadsheet name and range in A1 notation [e.g. Sheet1\!A1:E5] (inlcude the `\!`)
      
npm run start -i <sheet-id> -r <sheet_name!range>
