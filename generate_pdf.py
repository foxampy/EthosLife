#!/usr/bin/env python3
"""Generate PDF from Markdown WhitePaper."""

import subprocess
import sys
from pathlib import Path

def generate_single_pdf(md_filename, pdf_filename, lang="en"):
    """Generate a single PDF from markdown file."""
    from playwright.sync_api import sync_playwright
    import markdown
    
    docs_dir = Path("docs") if Path("docs").exists() else Path(".")
    md_file = docs_dir / md_filename
    pdf_file = docs_dir / pdf_filename
    
    print(f"Reading {md_file}...")
    md_content = md_file.read_text(encoding='utf-8')
    
    # Convert markdown to HTML
    html_content = markdown.markdown(
        md_content,
        extensions=['tables', 'fenced_code', 'toc'],
        output_format='html5'
    )
    
    # Wrap in proper HTML with styling
    full_html = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <title>EthosLife White Paper</title>
    <style>
        @page {{
            size: A4;
            margin: 2.5cm;
        }}
        body {{
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
        }}
        h1 {{
            font-size: 24pt;
            color: #2d2418;
            border-bottom: 2px solid #5c5243;
            padding-bottom: 10px;
            page-break-before: always;
        }}
        h1:first-of-type {{
            page-break-before: avoid;
        }}
        h2 {{
            font-size: 18pt;
            color: #3d3226;
            margin-top: 30px;
        }}
        h3 {{
            font-size: 14pt;
            color: #5c5243;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}
        th {{
            background-color: #5c5243;
            color: white;
        }}
        tr:nth-child(even) {{
            background-color: #f9f9f9;
        }}
        code {{
            background-color: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }}
        pre {{
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }}
        blockquote {{
            border-left: 4px solid #5c5243;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #f9f9f9;
        }}
        ul, ol {{
            margin: 10px 0;
            padding-left: 30px;
        }}
        li {{
            margin: 5px 0;
        }}
        strong {{
            color: #2d2418;
        }}
        hr {{
            border: none;
            border-top: 2px solid #e4dfd5;
            margin: 30px 0;
        }}
    </style>
</head>
<body>
{html_content}
</body>
</html>"""
    
    # Save HTML temporarily
    html_file = docs_dir / f"temp_{lang}_whitepaper.html"
    html_file.write_text(full_html, encoding='utf-8')
    
    print(f"Generating PDF with Playwright...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file://{html_file.absolute()}")
        page.pdf(
            path=str(pdf_file),
            format="A4",
            margin={"top": "2.5cm", "right": "2.5cm", "bottom": "2.5cm", "left": "2.5cm"},
            print_background=True
        )
        browser.close()
    
    # Clean up temp file
    html_file.unlink()
    
    print(f"[OK] PDF generated: {pdf_file}")
    print(f"    Size: {pdf_file.stat().st_size / 1024:.1f} KB")
    
    return True

def generate_pdf():
    """Generate PDFs from markdown files."""
    try:
        # Generate Russian version
        print("=" * 50)
        print("Generating Russian WhitePaper PDF...")
        print("=" * 50)
        success_ru = generate_single_pdf("WHITEPAPER_RU.md", "WHITEPAPER_RU.pdf", lang="ru")
        
        print()
        print("=" * 50)
        print("Generating English WhitePaper PDF...")
        print("=" * 50)
        success_en = generate_single_pdf("WHITEPAPER.md", "WHITEPAPER.pdf", lang="en")
        
        return success_ru and success_en
        
    except ImportError as e:
        print(f"[ERROR] Required library not found: {e}")
        print("Please install: pip install playwright markdown")
        return False
    except Exception as e:
        print(f"[ERROR] PDF generation failed: {e}")
        return False

if __name__ == "__main__":
    success = generate_pdf()
    sys.exit(0 if success else 1)
