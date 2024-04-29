/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

function getMetadata(name, document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)]
    .map((m) => m.content)
    .join(', ');
  return meta || '';
}

export function createMetadata(main, document) {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.textContent.replace(/[\n\t]/gm, '')
      .replace(' – implementationDetails()', '');
  }

  const desc = getMetadata('description', document);
  if (desc) {
    meta.Description = desc;
  }

  const img = getMetadata('og:image', document);
  if (img) {
    const el = document.createElement('img');
    el.src = img;
    meta.Image = el;

    const imgAlt = getMetadata('og:image:alt', document);
    if (imgAlt) {
      el.alt = imgAlt;
    }
  }

  const ogtitle = getMetadata('og:title', document);
  if (ogtitle && ogtitle !== meta.Title) {
    if (meta.Title) {
      meta['og:title'] = ogtitle;
    } else {
      meta.Title = ogtitle;
    }
  }

  const ogdesc = getMetadata('og:description', document);
  if (ogdesc && ogdesc !== meta.Description) {
    if (meta.Description) {
      meta['og:description'] = ogdesc;
    } else {
      meta.Description = ogdesc;
    }
  }

  const ttitle = getMetadata('twitter:title', document);
  if (ttitle && ttitle !== meta.Title) {
    if (meta.Title) {
      meta['twitter:title'] = ttitle;
    } else {
      meta.Title = ttitle;
    }
  }

  const tdesc = getMetadata('twitter:description', document);
  if (tdesc && tdesc !== meta.Description) {
    if (meta.Description) {
      meta['twitter:description'] = tdesc;
    } else {
      meta.Description = tdesc;
    }
  }

  const timg = getMetadata('twitter:image', document);
  if (timg && timg !== img) {
    const el = document.createElement('img');
    el.src = timg;
    meta['twitter:image'] = el;

    const imgAlt = getMetadata('twitter:image:alt', document);
    if (imgAlt) {
      el.alt = imgAlt;
    }
  }

  // Get the first span with class 'post-meta' under a div with class 'post-header'
  const postMeta = document.querySelector('div.post-header span.post-meta');
  if (postMeta) {
    let dateString = postMeta.textContent.trim();
    // Parse from this format 'Oct 17, 2023,' to unix epoch in seconds
    if (dateString.endsWith(',')) {
      dateString = dateString.slice(0, -1);
    }
    const date = new Date(dateString);
    // Use seconds since the Unix epoch
    meta['publication-date'] = date.getTime() / 1000;
  }

  if (Object.keys(meta).length > 0) {
    const block = WebImporter.Blocks.getMetadataBlock(document, meta);
    main.append(block);
  }

  return meta;
}
