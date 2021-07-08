declare module '@ampproject/toolbox-linter' {
  export enum LintMode {
    Amp = 'amp',
    AmpStory = 'ampstory',
    Amp4Ads = 'amp4ads',
    Amp4Email = 'amp4email',
    PageExperience = 'pageexperience',
    Sxg = 'sxg',
  }

  export enum Status {
    PASS = 'PASS',
    FAIL = 'FAIL',
    WARN = 'WARN',
    INFO = 'INFO',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
  }

  export enum StatusNumber {
    PASS,
    FAIL,
    WARN,
    INFO,
    INTERNAL_ERROR,
  }

  export interface Result {
    readonly status: Status;
    readonly message?: string;
    readonly url: string;
    readonly title: string;
    readonly info: string;
  }

  export interface Context {
    readonly url: string;
    readonly $: cheerio.Root;
    readonly raw: {headers: {[key: string]: string}; body: string};
    readonly headers: {
      [key: string]: string;
    };
    readonly mode: LintMode;
  }

  export interface Metadata {
    'title'?: string;
    'publisher'?: string;
    'publisher-logo-src'?: string;
    'poster-portrait-src'?: string;
    'poster-square-src'?: string;
    'poster-landscape-src'?: string;
  }
}
declare module '@ampproject/toolbox-linter/dist/cli';
