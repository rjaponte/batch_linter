# Batch Linter
Setup:

Create a new directory with mkdir [folder-name] and cd into it

Run git clone https://github.com/rjaponte/batch_linter.git 

Run cd batch_linter

Run npm i to install wrapper dependencies

[TEMPORARY] In a text editor open the file node_modules/@ampproject/toolbox-linter/package.json.
- Add the line  "@types/cheerio": "0.22.21" in the devDependencies block
- Search for the text probe-image-size in dependencies block and update the version to 6.0.0

In the command prompt run cd node_modules/@ampproject/toolbox-linter 

Run npm i to install linter dependencies

Run cd ../../.. to return to batch linter directory


TO RUN TOOL:
- CSV: npm run start -c [fielpath]
- SHEETS API: npm run start -i [sheet-id] -r [cellrange] (N/A)

[For Sheets API Only]
=====================
Visit https://developers.google.com/sheets/api/quickstart/nodejs and enable the Sheets API. Save the credentials.json file to the batch_linter folder, or copy paste output into a text file named credentials.json.
Visit this link: https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets&response_type=code&client_id=761823589370-dh1aidr4ojbcb9r86mht3pcphafvhoc7.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob to create an authentication token. Enter it on the command line when prompted to authorize the application 

