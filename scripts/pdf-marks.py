#!/usr/bin/env python3
"""Dump PDF text lines preserving column positions of bullet/dash marks.

Usage: python3 scripts/pdf-marks.py <file.pdf> [page_from] [page_to]

Groups words by line (y-position) and prints each line as
"label  |  marks-with-x-positions" so the •/- columns of comparison
tables can be read unambiguously.
"""
import sys
import pdfplumber

path = sys.argv[1]
p_from = int(sys.argv[2]) if len(sys.argv) > 2 else 1
p_to = int(sys.argv[3]) if len(sys.argv) > 3 else 9999

MARKS = {'•', '-', '–', '—', '●', '∙', '·'}

with pdfplumber.open(path) as pdf:
    for pno, page in enumerate(pdf.pages, 1):
        if pno < p_from or pno > p_to:
            continue
        print(f"\n========== PAGE {pno} (w={page.width:.0f}) ==========")
        words = page.extract_words(extra_attrs=['size'])
        # group by rounded y
        lines = {}
        for w in words:
            key = round(w['top'] / 3)
            lines.setdefault(key, []).append(w)
        for key in sorted(lines):
            ws = sorted(lines[key], key=lambda w: w['x0'])
            label_parts, marks = [], []
            for w in ws:
                t = w['text'].strip()
                if t in MARKS:
                    marks.append(f"{'•' if t not in ('-','–','—') else '-'}@{w['x0']:.0f}")
                else:
                    label_parts.append(t)
            label = ' '.join(label_parts)
            if marks:
                print(f"{label}  ||  {' '.join(marks)}")
            elif label:
                print(label)
