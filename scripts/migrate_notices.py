import requests
from bs4 import BeautifulSoup
import json
import os
import re
import time

BASE_URL = "https://www.xn--989au4gtq4b.com"
LIST_URL_TEMPLATE = "https://www.xn--989au4gtq4b.com/board/index.html?board_id=hjm_notice&action=list&page={}"
ASSET_DIR = "migration_assets"

if not os.path.exists(ASSET_DIR):
    os.makedirs(ASSET_DIR)

def sanitize_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name)

def download_file(url, folder):
    if not url.startswith('http'):
        url = BASE_URL + url if url.startswith('/') else BASE_URL + '/' + url
    
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            content_disp = response.headers.get("Content-Disposition")
            if content_disp and "filename=" in content_disp:
                fname = re.findall("filename=(.+)", content_disp)
                if fname:
                    filename = fname[0].strip().strip('"').strip("'")
                    # Decode if URL encoded
                    import urllib.parse
                    filename = urllib.parse.unquote(filename)
                else:
                     filename = url.split("=")[-1]
            else:
                filename = os.path.basename(url.split("?")[0])
                if not filename or filename == 'download.html':
                     filename = f"file_{int(time.time()*1000)}"

            filename = sanitize_filename(filename)
            filepath = os.path.join(folder, filename)
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"    Downloaded: {filename}")
            return filepath, filename
    except Exception as e:
        print(f"    Failed to download {url}: {e}")
    return None, None

def scrape_notices():
    notices = []
    seen_ids = set()
    page = 1
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': LIST_URL_TEMPLATE.format(1)
    }
    
    session = requests.Session()
    session.headers.update(headers)

    while True:
        print(f"Scraping page {page}...")
        url = LIST_URL_TEMPLATE.format(page)
        try:
            resp = session.get(url, timeout=10)
            resp.encoding = 'utf-8'
        except Exception as e:
            print(f"Request failed: {e}")
            break

        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Select rows in the board list
        links = soup.select("a[href*='action=view']")
        
        found_new = False
        for link in links:
            href = link.get('href')
            print(f"  [DEBUG] RAW HREF: {href}")
            
            match = re.search(r'seq=(\d+)', href)
            if not match: continue
            
            seq_id = match.group(1)
            if seq_id in seen_ids: continue
            
            seen_ids.add(seq_id)
            found_new = True
            
            # Check if pinned
            row = link.find_parent('tr')
            is_pinned = False
            if row:
                if "공지" in row.get_text() or row.select("img[src*='notice']"):
                    is_pinned = True
            
            # Get title from list link as fallback
            title_text = link.get_text(strip=True)
            
            if href.startswith('?'):
                 detail_url = BASE_URL + '/board/index.html' + href
            elif href.startswith('index.html'):
                 detail_url = BASE_URL + '/board/' + href
            elif not href.startswith('http'):
                 # Ensure no double slash if href starts with /
                 if href.startswith('/'):
                      detail_url = BASE_URL + href
                 else:
                      detail_url = BASE_URL + '/board/' + href
            else:
                 detail_url = href

            print(f"  Fetching Notice {seq_id}: {detail_url} (Pinned: {is_pinned})")
            
            try:
                # Update referer for detail request
                session.headers.update({'Referer': url})
                d_resp = session.get(detail_url, timeout=10)
                d_resp.encoding = 'utf-8'
                d_soup = BeautifulSoup(d_resp.text, 'html.parser')

                # Title - Strict selector
                title_el = d_soup.select_one(".view-title")
                if title_el:
                    title = title_el.get_text(strip=True)
                else:
                    # Fallback to list title if detail title fails, but avoid modal headers
                    title = title_text
                
                # Metadata (Author, Date, Views) working with .list-group-item.small
                # Structure:
                # .col-sm-9 -> .ti-pencil + Author
                # .col-sm-2 -> .ti-time + Date (.num-webfont)
                # .col-sm-1 -> .ti-eye + Views (.num-webfont)
                
                author = "팜러닝" # Default per user request
                created_at = "2025-01-01"
                view_count = 0
                
                meta_row = d_soup.select_one(".list-group-item.small .row")
                if meta_row:
                    # Author
                    auth_col = meta_row.select_one(".col-sm-9")
                    if auth_col:
                        # Get text excluding the icon
                        author = auth_col.get_text(strip=True)
                    
                    # Date
                    date_col = meta_row.select_one(".col-sm-2 .num-webfont")
                    if date_col:
                        created_at = date_col.get_text(strip=True)
                        
                    # Views
                    view_col = meta_row.select_one(".col-sm-1 .num-webfont")
                    if view_col:
                        try:
                            view_text = view_col.get_text(strip=True).replace(',', '')
                            view_count = int(view_text)
                        except:
                            view_count = 0
                
                # DEBUG: Save HTML to file to inspect structure
                if seq_id == "726":
                    with open(f"scripts/debug_notice_{seq_id}.html", "w", encoding="utf-8") as dbg:
                        dbg.write(d_soup.prettify())
                    print(f"  [DEBUG] Saved HTML to scripts/debug_notice_{seq_id}.html")

                # Content
                # Try specific class first
                content_div = (d_soup.select_one("#content_viewer") or 
                               d_soup.select_one(".bbs_memo") or 
                               d_soup.select_one(".board_view_content") or 
                               d_soup.select_one(".view_content"))
                if not content_div:
                     # Heuristic: find div with most <br> or <p>
                     divs = d_soup.find_all('div')
                     if divs:
                        content_div = max(divs, key=lambda d: len(d.find_all('br')) + len(d.find_all('p')))
                
                # Prepare Asset Directory
                notice_dir = os.path.join(ASSET_DIR, seq_id)
                if not os.path.exists(notice_dir):
                    os.makedirs(notice_dir)
                
                content_html = ""
                local_attachments = []

                if content_div:
                    # 1. Handle Images
                    imgs = content_div.find_all('img')
                    for img in imgs:
                        src = img.get('src')
                        if src:
                            fpath, fname = download_file(src, notice_dir)
                            if fpath:
                                img['src'] = f"[[IMG:{fname}]]"
                                img['style'] = "max-width: 100%;" # Add responsive style
                    
                    content_html = str(content_div)
                
                # 2. Handle Attachments
                # Typically in a separate file list area, e.g., .board_view_file
                file_div = d_soup.select_one(".board_view_file") or d_soup.select_one(".view_file")
                att_links = []
                if file_div:
                    att_links = file_div.select("a[href*='download.html']")
                else:
                     # Fallback to searching everywhere
                     att_links = d_soup.select("a[href*='download.html']")

                for al in att_links:
                    ahref = al.get('href')
                    aname = al.get_text(strip=True)
                    if not aname: aname = "attachment"
                    
                    # Avoid duplicates if file list is inside content (rare but possible)
                    if content_div and al in content_div.find_all('a'):
                        continue

                    fpath, fname = download_file(ahref, notice_dir)
                    if fpath:
                        local_attachments.append({
                            "original_name": aname, # Keep original name for display
                            "filename": fname,      # System filename
                            "local_path": fpath
                        })

                # Date & Author
                date_match = re.search(r'\d{4}-\d{2}-\d{2}', d_soup.get_text())
                created_at = date_match.group(0) if date_match else "2025-01-01"
                
                notices.append({
                    "id": seq_id,
                    "title": title,
                    "content": content_html,
                    "author": author,
                    "created_at": created_at,
                    "view_count": view_count,
                    "is_pinned": is_pinned,
                    "attachments": local_attachments
                })
                
                time.sleep(0.5)

            except Exception as e:
                print(f"  Error processing {seq_id}: {e}")

        if not found_new and page > 1:
            print("No new notices found, stopping.")
            break
            
        if page > 10: 
            break
            
        page += 1

    with open('scripts/notices_data.json', 'w', encoding='utf-8') as f:
        json.dump(notices, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(notices)} notices.")

if __name__ == "__main__":
    scrape_notices()
