#!/usr/bin/env python3
"""Generate PDF from SAFT HTML."""

import subprocess
import sys
from pathlib import Path

def generate_saft_pdf():
    """Generate PDF from SAFT HTML file."""
    try:
        from playwright.sync_api import sync_playwright
        
        html_file = Path("saft.html")
        pdf_file = Path("SAFT_EthosLife_Seed_Round.pdf")
        
        print(f"Reading {html_file}...")
        
        print(f"Generating PDF with Playwright...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(f"file://{html_file.absolute()}")
            
            # Wait for fonts to load
            page.wait_for_timeout(2000)
            
            page.pdf(
                path=str(pdf_file),
                format="A4",
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                print_background=True,
                prefer_css_page_size=True
            )
            browser.close()
        
        print(f"[OK] PDF generated: {pdf_file}")
        print(f"    Size: {pdf_file.stat().st_size / 1024:.1f} KB")
        
        return True
        
    except ImportError as e:
        print(f"[ERROR] Required library not found: {e}")
        print("Please install: pip install playwright")
        print("Then run: playwright install chromium")
        return False
    except Exception as e:
        print(f"[ERROR] PDF generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = generate_saft_pdf()
    sys.exit(0 if success else 1)
