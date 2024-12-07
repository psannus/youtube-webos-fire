/* eslint no-redeclare: 0 */
/* global fetch:writable */
import { configRead } from './config';

const origParse = JSON.parse;
JSON.parse = function () {
  const r = origParse.apply(this, arguments);
  if (configRead('enlargeVideosOnHomepage')) {
    return r;
  }

  // Remove enlarge effect from shelf renderer
  // contents.tvBrowseRenderer.content.tvSurfaceContentRenderer.content.sectionListRenderer.contents[0].shelfRenderer.tvhtml5Style.effects.enlarge = true;
  const sectionListRenderer = findFirstObject(r, 'sectionListRenderer');
  if (sectionListRenderer?.contents) {
    setEnlargeToFalse(sectionListRenderer);
  }

  // continuationContents.sectionListContinuation.contents[0].shelfRenderer.tvhtml5Style.effects.enlarge = true;
  const sectionListContinuation = findFirstObject(r, 'sectionListContinuation');
  if (sectionListContinuation?.contents) {
    setEnlargeToFalse(sectionListContinuation);
  }

  return r;
};

function setEnlargeToFalse(sectionList) {
  sectionList.contents = sectionList.contents.map((elm) => {
    if (elm?.shelfRenderer?.tvhtml5Style?.effects?.enlarge != null) {
      elm.shelfRenderer.tvhtml5Style.effects.enlarge = false;
    }
    return elm;
  });
}

function findFirstObject(haystack, needle) {
  for (const key in haystack) {
    if (key === needle) {
      return haystack[key];
    }
    if (typeof haystack[key] === 'object') {
      const result = findFirstObject(haystack[key], needle);
      if (result) return result;
    }
  }
  return null;
}
