import requests
from bs4 import BeautifulSoup
import json

def scrape_ebird(url):
    # Send a GET request to the URL
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return None

    # Parse the HTML content using Beautiful Soup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract the Breadcrumbs
    breadcrumbs_div = soup.find('div', class_='Breadcrumbs Breadcrumbs--reverse u-margin-none')
    breadcrumbs = [li.text.strip() for li in breadcrumbs_div.find_all('li')] if breadcrumbs_div else []

    # Extract the Heading
    heading_h1 = soup.find('h1', class_='Heading Heading--h1 Heading--thin Heading--reverse u-stack-md')
    common_name = heading_h1.find('span', class_='Heading-main').text.strip() if heading_h1 else None
    scientific_name = heading_h1.find('span', class_='Heading-sub Heading-sub--sci').text.strip() if heading_h1 else None

    #Conservation status
    conservation_status = None
    conservation_div = soup.find('div', id='conservation-status')

    if conservation_div:
        # Find the div with the class 'u-colorReverse'
        print(conservation_div.prettify())
        color_reverse_div = conservation_div.find('div', class_='u-colorReverse')
        
        if color_reverse_div:
            # Find the anchor tag inside the 'u-colorReverse' div
            a_tag = color_reverse_div.find('a')
            if a_tag:
                # Find the span with class 'Badge-label' inside the anchor tag
                print("a_tag")
                badge_label_span = a_tag.find('span', class_='Badge-label')
                if badge_label_span:
                    print("ok")
                    conservation_status = badge_label_span.text.strip()

    # Format the data as JSON
    result = {
        "order": breadcrumbs[0],
        "family": breadcrumbs[1],
        "common_name": common_name,
        "scientific_name": scientific_name,
    }

    return result

if __name__ == "__main__":
    url = "https://ebird.org/species/blkvul"
    data = scrape_ebird(url)

    if data:
        # Print the result in JSON format
        print(json.dumps(data, indent=4))