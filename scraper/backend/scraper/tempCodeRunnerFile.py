def scrape_ebird(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')

    breadcrumbs_div = soup.find('div', class_='Breadcrumbs Breadcrumbs--reverse u-margin-none')
    breadcrumbs = [li.text.strip() for li in breadcrumbs_div.find_all('li')] if breadcrumbs_div else []

    heading_h1 = soup.find('h1', class_='Heading Heading--h1 Heading--thin Heading--reverse u-stack-md')
    common_name = heading_h1.find('span', class_='Heading-main').text.strip() if heading_h1 else None
    scientific_name = heading_h1.find('span', class_='Heading-sub Heading-sub--sci').text.strip() if heading_h1 else None

    hero_image_div = soup.find('div', class_='Hero-image')
    hero_image_url = None
    if hero_image_div:
        img_tag = hero_image_div.find('img')
        if img_tag:
            if 'srcset' in img_tag.attrs:
                srcset = img_tag.attrs['srcset']
                highest_res = srcset.split(",")[-1].strip().split(" ")[0]
                hero_image_url = highest_res
            elif 'src' in img_tag.attrs:
                hero_image_url = img_tag.attrs['src']
            alt_text = img_tag.attrs.get('alt', '')
            if alt_text:
                parts = alt_text.split(" - ")
                if len(parts) > 1:
                    photographer_name = parts[1].strip()

    result = {
        "common_name": common_name,
        "scientific_name": scientific_name,
        "order": breadcrumbs[0],
        "family": breadcrumbs[1],
        "genus": ,
        "image_url": hero_image_url,
        "image_credit": photographer_name
    }

    return result