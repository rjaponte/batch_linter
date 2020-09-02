import {Result} from "@ampproject/toolbox-linter"

export interface LintData {
  isvalid: Result,
  ampvideoissmall: Result[],
  ampvideoisspecifiedbyattribute: Result,
  metacharsetisfirst: Result,
  runtimeispreloaded: Result,
  ampimgheightwidthisok: Result[],
  ampimgamppixelpreferred: Result[],
  endpointsareaccessiblefromorigin: Result[],
  endpointsareaccessiblefromcache: Result[],
  linkrelcanonicalisok: Result,
  storyruntimeisv1: Result,
  storymetadataisv1: Result,
  storyismostlytext: Result,
  storymetadatathumbnailsareok: Result[],
  metadataincludesogimagesrc: Result,
  imageshavealttext: Result,
  videoshavealttext: Result,
  videosaresubtitled: Result,
  titlemeetslengthcriteria: Result
}

