"""Write a paper's title, authors, summary, and keywords into a hosted PDF, in place.

Google titles a PDF search result from the file's own metadata, and reference managers such as
Zotero fill an imported PDF's record from it; LaTeX leaves the fields empty unless the authors set
them. The document information dictionary and the XMP packet both get the values, so readers that
look at either one agree. Streams are left as they are, so images are not re-encoded.

    python pdf-meta.py <file.pdf> '<json>'

where the JSON is {"title": str, "authors": [str], "subject": str, "keywords": [str]}. Called by
scripts/papers.mjs after a sync and by `npm run papers:meta`.
"""

import json
import sys

import pikepdf


def main() -> None:
    path, raw = sys.argv[1], sys.argv[2]
    meta = json.loads(raw)
    with pikepdf.open(path, allow_overwriting_input=True) as pdf:
        # The XMP packet first; pikepdf mirrors it into the information dictionary.
        with pdf.open_metadata(set_pikepdf_as_editor=False) as xmp:
            xmp["dc:title"] = meta["title"]
            xmp["dc:creator"] = meta["authors"]
            if meta.get("subject"):
                xmp["dc:description"] = meta["subject"]
            if meta.get("keywords"):
                xmp["pdf:Keywords"] = "; ".join(meta["keywords"])
        pdf.docinfo["/Title"] = meta["title"]
        pdf.docinfo["/Author"] = "; ".join(meta["authors"])
        if meta.get("subject"):
            pdf.docinfo["/Subject"] = meta["subject"]
        if meta.get("keywords"):
            pdf.docinfo["/Keywords"] = "; ".join(meta["keywords"])
        pdf.save(path)


if __name__ == "__main__":
    main()
