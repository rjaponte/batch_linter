export interface sheetsDTO {
    url: string, 
    timestamp: string,
    story_id : string,
    partner_name: string,
    partner_domain: string,
    title: string,
    isvalid: string,
    ampvideoissmall: string,
    ampvideoisspecifiedbyattribute: string,
    metacharsetisfirst: string,
    runtimeispreloaded: string,
    ampimgheightwidthisok: string,
    ampimgamppixelpreferred: string,
    endpointsareaccessiblefromorigin: string,
    endpointsareaccessiblefromcache: string,
    linkrelcanonicalisok: string,
    storyruntimeisv1: string,
    storymetadataisv1: string,
    storyismostlytext: string,
    storymetadatathumbnailsareok: string,
    metadataincludesogimagesrc: string,
    imageshavealttext: string,
    videoshavealttext: string,
    videosaresubtitled: string,
    titlemeetslengthcriteria: string,
    toArray(): string[]
  }

  export class sheetsObj implements sheetsDTO {
    url = ""; 
    timestamp = "";
    story_id = "";
    partner_name = "";
    partner_domain = "";
    title = "";
    isvalid = "";
    ampvideoissmall = "";
    ampvideoisspecifiedbyattribute = "";
    metacharsetisfirst = "";
    runtimeispreloaded = "";
    ampimgheightwidthisok = "";
    ampimgamppixelpreferred = "";
    endpointsareaccessiblefromorigin = "";
    endpointsareaccessiblefromcache = "";
    linkrelcanonicalisok = "";
    storyruntimeisv1 = "";
    storymetadataisv1 = "";
    storyismostlytext = "";
    storymetadatathumbnailsareok = "";
    metadataincludesogimagesrc= "";
    imageshavealttext = "";
    videoshavealttext = "";
    videosaresubtitled = "";
    titlemeetslengthcriteria = "";
    constructor () {
        this.url = ""; 
        this.timestamp = "";
        this.story_id = "";
        this.partner_name = "";
        this.partner_domain = "";
        this.title = "";
        this.isvalid = "";
        this.ampvideoissmall = "";
        this.ampvideoisspecifiedbyattribute = "";
        this.metacharsetisfirst = "";
        this.runtimeispreloaded = "";
        this.ampimgheightwidthisok = "";
        this.ampimgamppixelpreferred = "";
        this.endpointsareaccessiblefromorigin = "";
        this.endpointsareaccessiblefromcache = "";
        this.linkrelcanonicalisok = "";
        this.storyruntimeisv1 = "";
        this.storymetadataisv1 = "";
        this.storyismostlytext = "";
        this.storymetadatathumbnailsareok = "";
        this.metadataincludesogimagesrc= "";
        this.imageshavealttext = "";
        this.videoshavealttext = "";
        this.videosaresubtitled = "";
        this.titlemeetslengthcriteria = "";
    }
    
    toArray(): string[] {
        return [
            this.story_id,
            this.timestamp,
            this.partner_name,
            this.partner_domain,
            this.title,
            this.url, 
            this.isvalid,
            this.ampvideoissmall,
            this.ampvideoisspecifiedbyattribute,
            this.metacharsetisfirst,
            this.runtimeispreloaded,
            this.ampimgheightwidthisok,
            this.ampimgamppixelpreferred,
            this.endpointsareaccessiblefromorigin,
            this.endpointsareaccessiblefromcache,
            this.linkrelcanonicalisok,
            this.storyruntimeisv1,
            this.storymetadataisv1,
            this.storyismostlytext,
            this.storymetadatathumbnailsareok,
            this.metadataincludesogimagesrc,
            this.imageshavealttext,
            this.videoshavealttext,
            this.videosaresubtitled,
            this.titlemeetslengthcriteria,
        ]
    }
  }