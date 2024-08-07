var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import.js
  var import_exports = {};
  __export(import_exports, {
    default: () => import_default
  });

  // tools/importer/createMetadata.js
  function getMetadata(name, document) {
    const attr = name && name.includes(":") ? "property" : "name";
    const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(", ");
    return meta || "";
  }
  function createMetadata(main, document) {
    const meta = {};
    const title = document.querySelector("title");
    if (title) {
      meta.Title = title.textContent.replace(/[\n\t]/gm, "").replace(" \u2013 implementationDetails()", "");
    }
    const desc = getMetadata("description", document);
    if (desc) {
      meta.Description = desc;
    }
    const img = getMetadata("og:image", document);
    if (img) {
      const el = document.createElement("img");
      el.src = img;
      meta.Image = el;
      const imgAlt = getMetadata("og:image:alt", document);
      if (imgAlt) {
        el.alt = imgAlt;
      }
    }
    const ogtitle = getMetadata("og:title", document);
    if (ogtitle && ogtitle !== meta.Title) {
      if (meta.Title) {
        meta["og:title"] = ogtitle;
      } else {
        meta.Title = ogtitle;
      }
    }
    const ogdesc = getMetadata("og:description", document);
    if (ogdesc && ogdesc !== meta.Description) {
      if (meta.Description) {
        meta["og:description"] = ogdesc;
      } else {
        meta.Description = ogdesc;
      }
    }
    const ttitle = getMetadata("twitter:title", document);
    if (ttitle && ttitle !== meta.Title) {
      if (meta.Title) {
        meta["twitter:title"] = ttitle;
      } else {
        meta.Title = ttitle;
      }
    }
    const tdesc = getMetadata("twitter:description", document);
    if (tdesc && tdesc !== meta.Description) {
      if (meta.Description) {
        meta["twitter:description"] = tdesc;
      } else {
        meta.Description = tdesc;
      }
    }
    const timg = getMetadata("twitter:image", document);
    if (timg && timg !== img) {
      const el = document.createElement("img");
      el.src = timg;
      meta["twitter:image"] = el;
      const imgAlt = getMetadata("twitter:image:alt", document);
      if (imgAlt) {
        el.alt = imgAlt;
      }
    }
    const postMeta = document.querySelector("div.post-header span.post-meta");
    if (postMeta) {
      let dateString = postMeta.textContent.trim();
      if (dateString.endsWith(",")) {
        dateString = dateString.slice(0, -1);
      }
      const date = new Date(dateString);
      meta["publication-date"] = date.getTime() / 1e3;
    }
    if (Object.keys(meta).length > 0) {
      const block = WebImporter.Blocks.getMetadataBlock(document, meta);
      main.append(block);
    }
    return meta;
  }

  // tools/importer/import.js
  var import_default = {
    /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
    transformDOM: ({
      // eslint-disable-next-line no-unused-vars
      document,
      url,
      html,
      params
    }) => {
      const main = document.body;
      WebImporter.DOMUtils.remove(main, [
        "header",
        ".header",
        "nav",
        ".nav",
        "footer",
        ".footer",
        "iframe",
        "noscript",
        "div#cta",
        "div.share-page",
        "div.post-footer",
        "div#disqus_recommendations",
        "div#disqus_thread"
      ]);
      const postsSelector = ".home .posts";
      if (document.querySelector(postsSelector)) {
        const cells = [
          ["Posts"]
        ];
        const postsBlock = WebImporter.DOMUtils.createTable(cells, document);
        main.prepend(postsBlock);
        WebImporter.DOMUtils.remove(main, [
          postsSelector,
          "span.post-meta",
          ".pagination",
          ".site-wrap"
        ]);
      }
      createMetadata(main, document);
      WebImporter.DOMUtils.remove(main, [
        "span.post-meta"
      ]);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      WebImporter.rules.convertIcons(main, document);
      return main;
    },
    /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
    generateDocumentPath: ({
      // eslint-disable-next-line no-unused-vars
      document,
      url,
      html,
      params
    }) => {
      let p = new URL(url).pathname;
      if (p.endsWith("/")) {
        p = p.slice(0, -1);
      }
      return decodeURIComponent(p).toLowerCase().replace(/\.html$/, "").replace(/[^a-z0-9/]/gm, "-");
    }
  };
  return __toCommonJS(import_exports);
})();
