import {easyLint} from '@ampproject/toolbox-linter/dist/cli';
import chalk from 'chalk';
import {LintMode, Status} from '@ampproject/toolbox-linter';

import {LintData} from './models';

const log = console.log;

const urls: string[] = require("./test.json");
// ["https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/",
//   "https://www.gqindia.com/web-stories/5-exercises-bigger-biceps/"];
async function test() {
  // let data = await cli(["-A \"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Mobile Safari/537.36\"",
  //   "-f ampstory", "-t json", urls[0]]);
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

      //console.log(parseToJson);

      let data: LintData = JSON.parse(parseToJson);

      log(`URL: ${chalk.blue(url)}`)
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
}
test();
