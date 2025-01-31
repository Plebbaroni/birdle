import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import json
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

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
     # Scrape the image credit from the <figcaption> element
    figcaption = soup.find('figcaption', class_='Media-caption Species-media-credit')
    if figcaption:
        copyright_span = figcaption.find('span', string=lambda x: x and '©' in x)
        if copyright_span:
            photographer_name = copyright_span.text.strip().replace('©\xa0', '')

    genus = scientific_name.split()[0] if scientific_name else None
    species = scientific_name.split()[1] if scientific_name else None
    result = {
        "common_name": common_name,
        "scientific_name": scientific_name,
        "order": breadcrumbs[0],
        "family": breadcrumbs[1],
        "genus": genus,
        "species": species,
        "image_url": hero_image_url,
        "image_credit": photographer_name
    }

    return result

def insert_into_supabase(data):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    try:
        response = supabase.table("birds").insert(data).execute()

        if response.data:
            print("Data inserted successfully!")
            print(f"Inserted data: {response.data}")
        else:
            print("No data was inserted. Check the response for issues.")

    except Exception as e:
        print(f"Error inserting data: {e}")

if __name__ == "__main__":
    print("Welcome to Jared's weird ebird scraper!")
    while True:
        url = input("Enter an eBird species URL (or type 'x' to exit): ").strip()

        if url.lower() == 'x':
            print("Exiting the program.")
            break

        bird_data = scrape_ebird(url)
        if bird_data:
            print("Scraped Data:")
            print(json.dumps(bird_data, indent=4))

            user_input = input("\nDo you want to insert this data into the database? (y/n): ").strip().lower()

            if user_input == "y":
                insert_into_supabase(bird_data)
            elif user_input == "n":
                print("Data not inserted into the database.")
            else:
                print("Invalid input. Please type 'y' or 'n'.")
        else:
            print("No data scraped.")
