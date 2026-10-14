#!/usr/bin/env python3
# Re-encodes the large palette images in a PDF as JPEG, for scripts/papers.mjs.
#
# Ghostscript turns lossless images into JPEG, but leaves palette (indexed) images as they are.
# A paper's full-page grid of thumbnails is often one: 256 dithered colors, megabytes as
# lossless data. As JPEG quality 85 with 4:2:0 chroma it is a fraction of that, and the dither it
# smooths away is noise. An image is replaced only when the JPEG is smaller, so a flat-color chart,
# which compresses better as it is, keeps its palette.
#
#   python3 scripts/pdf-palette.py in.pdf out.pdf
#
# Needs pikepdf and Pillow: python3 -m venv .venv && .venv/bin/pip install pikepdf pillow
import io
import sys

import pikepdf

MIN_BYTES = 256 * 1024  # smaller images are not worth a lossy step


def base_space(cs):
    """The color space under an Indexed one that JPEG can carry: RGB or gray, else None."""
    if not isinstance(cs, pikepdf.Array) or len(cs) < 2 or cs[0] != "/Indexed":
        return None, None
    base = cs[1]
    if base in ("/DeviceRGB", "/DeviceGray"):
        return base, "RGB" if base == "/DeviceRGB" else "L"
    if isinstance(base, pikepdf.Array) and base[0] == "/ICCBased" and int(base[1].get("/N", 0)) in (1, 3):
        return base, "RGB" if int(base[1]["/N"]) == 3 else "L"
    return None, None


def main(src, out):
    pdf = pikepdf.open(src)
    for obj in pdf.objects:
        if not isinstance(obj, pikepdf.Stream) or obj.get("/Subtype") != "/Image":
            continue
        # A color-key mask names palette entries, and a stencil has no colors to keep.
        if "/Mask" in obj or obj.get("/ImageMask", False):
            continue
        base, mode = base_space(obj.get("/ColorSpace"))
        if base is None:
            continue
        before = len(obj.read_raw_bytes())
        if before < MIN_BYTES:
            continue
        img = pikepdf.PdfImage(obj).as_pil_image().convert(mode)
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=85, subsampling=2, optimize=True)
        data = buf.getvalue()
        if len(data) >= before:
            continue
        obj.write(data, filter=pikepdf.Name.DCTDecode)
        obj.ColorSpace = base
        obj.BitsPerComponent = 8
        for key in ("/DecodeParms", "/Decode"):
            if key in obj:
                del obj[key]
        print(f"palette image {img.size[0]}x{img.size[1]}: {before / 1e6:.1f} MB -> {len(data) / 1e6:.1f} MB")
    pdf.save(out, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)


if __name__ == "__main__":
    main(*sys.argv[1:3])
