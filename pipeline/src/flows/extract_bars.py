
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import csv
from prefect import flow, task
import logging
import time
import random
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "data")
OUTPUT_DIR = os.path.join(DATA_DIR, "bars")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_browser_context(playwright):
    """Create a browser context with anti-detection settings"""
    browser = playwright.chromium.launch(
        headless=True,
        args=[
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
        ]
    )
    
    context = browser.new_context(
        viewport={'width': 1920, 'height': 1080},
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        locale='pt-BR',
        timezone_id='America/Sao_Paulo'
    )
    
    # Add stealth settings
    context.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
        
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5],
        });
        
        Object.defineProperty(navigator, 'languages', {
            get: () => ['pt-BR', 'pt', 'en-US', 'en'],
        });
    """)
    
    return browser, context

@task
def get_total_pages(base_url):
    """Detect the total number of pages available"""
    with sync_playwright() as playwright:
        browser, context = create_browser_context(playwright)
        page = context.new_page()
        
        try:
            logger.info(f"Detecting total pages for: {base_url}")
            
            # Navigate to first page
            response = page.goto(base_url, timeout=30000, wait_until='load')
            
            if not response or response.status >= 400:
                logger.warning(f"Failed to load page for pagination detection. Status: {response.status}")
                return 1
            
            # Wait for page content
            page.wait_for_selector('body', timeout=5000)
            time.sleep(2)
            
            # Get page content
            content = page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            # Look for pagination elements
            pagination_links = soup.select('a[href*="/page/"]')
            
            if not pagination_links:
                logger.info("No pagination found, assuming single page")
                return 1
            
            # Extract page numbers from pagination links
            page_numbers = []
            for link in pagination_links:
                href = link.get('href', '')
                if '/page/' in href:
                    try:
                        # Extract number from URL like '/butecos/belo-horizonte/page/2/'
                        page_num = int(href.split('/page/')[-1].rstrip('/'))
                        page_numbers.append(page_num)
                    except (ValueError, IndexError):
                        continue
            
            total_pages = max(page_numbers) if page_numbers else 1
            logger.info(f"Found {total_pages} total pages")
            return total_pages
            
        except Exception as e:
            logger.error(f"Error detecting pagination: {e}")
            return 1
        finally:
            try:
                context.close()
                browser.close()
            except:
                pass
@task
def extract_bars_from_page(url, page_num=1):
    """Extract bars from a single page"""
    max_retries = 3
    
    for attempt in range(max_retries):
        with sync_playwright() as playwright:
            browser, context = create_browser_context(playwright)
            page = context.new_page()
            
            try:
                logger.info(f"Attempt {attempt + 1}/{max_retries}: Extracting from page {page_num}: {url}")
                
                # Human-like random delay
                delay = random.uniform(2, 5)
                logger.info(f"Waiting {delay:.1f} seconds before navigation...")
                time.sleep(delay)
                
                # Try different navigation strategies
                strategies = [
                    {'wait_until': 'domcontentloaded', 'timeout': 30000},
                    {'wait_until': 'load', 'timeout': 45000},
                    {'wait_until': 'networkidle', 'timeout': 60000}
                ]
                
                response = None
                for i, strategy in enumerate(strategies):
                    try:
                        logger.info(f"Trying navigation strategy {i+1}: {strategy['wait_until']}")
                        response = page.goto(url, **strategy)
                        break
                    except Exception as nav_error:
                        logger.warning(f"Navigation strategy {i+1} failed: {nav_error}")
                        if i < len(strategies) - 1:
                            time.sleep(2)
                        else:
                            raise nav_error
                
                if not response or response.status >= 400:
                    raise Exception(f"Failed to load page. Status: {response.status if response else 'No response'}")
                
                logger.info(f"Page {page_num} loaded successfully with status: {response.status}")
                
                # Wait for page to stabilize and try different selectors
                try:
                    # First try waiting for the main content
                    page.wait_for_selector('body', timeout=5000)
                    time.sleep(random.uniform(1, 3))  # Random human-like delay
                    
                    # Try to wait for bar cards, but don't fail if they don't exist yet
                    try:
                        page.wait_for_selector('.item', timeout=8000)
                        logger.info("Found .item elements")
                    except:
                        logger.warning("No .item found, trying alternative selectors...")
                        # Try alternative selectors
                        try:
                            page.wait_for_selector('[class*="item"]', timeout=5000)
                            logger.info("Found elements with 'item' in class name")
                        except:
                            logger.warning("No item-related elements found, proceeding with full page content")
                    
                except Exception as selector_error:
                    logger.warning(f"Selector wait failed: {selector_error}, proceeding anyway")
                
                # Get page content and parse with BeautifulSoup
                content = page.content()
                
                # Debug: save HTML content for inspection on errors
                if attempt > 0:  # Only save debug on retries
                    debug_file = f"debug_page_{page_num}_attempt_{attempt + 1}_{int(time.time())}.html"
                    with open(debug_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    logger.info(f"Debug content saved to {debug_file}")
                
                soup = BeautifulSoup(content, 'html.parser')
                
                bars = []
                # Try multiple selectors based on the real structure
                cards = soup.select('.item')
                
                if not cards:
                    logger.warning("No .item found, trying alternative selectors...")
                    cards = soup.select('[class*="item"]')
                    
                if not cards:
                    logger.warning("No item elements found, trying card-like elements...")
                    cards = soup.select('.card, [class*="card"]')
                
                logger.info(f"Found {len(cards)} elements on page {page_num}")
                
                for card in cards:
                    # Extract name from h2 in caption
                    name_element = card.select_one('.caption h2')
                    name = name_element.get_text(strip=True) if name_element else ''
                    
                    # Extract address from p in caption
                    address_element = card.select_one('.caption p')
                    address = address_element.get_text(strip=True) if address_element else ''
                    
                    # Extract photo from image div
                    photo_element = card.select_one('.image img')
                    photo_url = photo_element['src'] if photo_element and photo_element.has_attr('src') else ''
                    
                    # Extract details link
                    link_element = card.select_one('.caption a[href*="buteco"]')
                    details_url = link_element['href'] if link_element and link_element.has_attr('href') else ''
                    
                    if details_url and not details_url.startswith('http'):
                        details_url = 'https://comidadibuteco.com.br' + details_url
                    
                    if name:  # Only add if we have a name
                        bars.append({
                            'name': name,
                            'address': address,
                            'photo': photo_url,
                            'details_url': details_url,
                            'page_src_url': page.url,
                            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S')
                        })
                
                logger.info(f"Successfully extracted {len(bars)} bars from page {page_num}")
                return bars
                
            except Exception as e:
                logger.error(f"Page {page_num} attempt {attempt + 1} failed: {e}")
                
                # Take screenshot for debugging
                try:
                    screenshot_path = f"error_page_{page_num}_attempt_{attempt + 1}_{int(time.time())}.png"
                    page.screenshot(path=screenshot_path)
                    logger.info(f"Screenshot saved: {screenshot_path}")
                except:
                    pass
                
                if attempt < max_retries - 1:
                    wait_time = random.uniform(5, 10)  # Random wait between retries
                    logger.info(f"Waiting {wait_time:.1f} seconds before retry...")
                    time.sleep(wait_time)
                else:
                    raise  # Re-raise the last exception
                
            finally:
                try:
                    context.close()
                    browser.close()
                except:
                    pass

@task
def save_csv(bars, filename):
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'address', 'photo', 'details_url', 'page_src_url', 'extracted_at'])
        writer.writeheader()
        writer.writerows(bars)

@flow(name="Extract Bars")
def extract_bars_flow(city: str):
    base_url = f"https://comidadibuteco.com.br/butecos/{city}/"    
    logger.info(f"Extracting bars from {city.replace('-', ' ').title()}...")
    
    try:
        # First, detect total number of pages
        total_pages = get_total_pages(base_url)
        logger.info(f"Processing {total_pages} page(s) for {city}")
        
        all_bars = []
        
        # Extract bars from each page
        for page_num in range(1, total_pages + 1):
            # Construct URL for current page
            if page_num == 1:
                page_url = base_url
            else:
                page_url = f"{base_url}page/{page_num}/"
            
            # Add delay between pages to be respectful
            if page_num > 1:
                delay = random.uniform(3, 7)
                logger.info(f"Waiting {delay:.1f} seconds before processing page {page_num}...")
                time.sleep(delay)
            
            # Extract bars from current page
            page_bars = extract_bars_from_page(page_url, page_num)
            all_bars.extend(page_bars)
            
            logger.info(f"Page {page_num}/{total_pages}: Extracted {len(page_bars)} bars (Total: {len(all_bars)})")
        
        # Create output directory if it doesn't exist
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        filename = os.path.join(OUTPUT_DIR, f"{city}.csv")
        save_csv(all_bars, filename)
        
        logger.info(f"Successfully extracted {len(all_bars)} bars from {total_pages} page(s) in {city} and saved to {filename}.")
        return all_bars
        
    except Exception as e:
        logger.error(f"Flow failed with error: {e}")
        raise

if __name__ == "__main__":
    extract_bars_flow(city='belo-horizonte')
