import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client
import json

# Supabase configuration
SUPABASE_URL = "https://your-supabase-project-url.supabase.co"
SUPABASE_KEY = "your-supabase-api-key"

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

    # Extract the Hero image
    hero_image_div = soup.find('div', class_='Hero-image')
    hero_image_url = None
    if hero_image_div:
        # Find the <img> tag inside the Hero image div
        img_tag = hero_image_div.find('img')
        if img_tag:
            # Check for the 'srcset' attribute and pick the highest resolution
            if 'srcset' in img_tag.attrs:
                srcset = img_tag.attrs['srcset']
                # Get the highest resolution image from srcset
                highest_res = srcset.split(",")[-1].strip().split(" ")[0]
                hero_image_url = highest_res
            elif 'src' in img_tag.attrs:
                hero_image_url = img_tag.attrs['src']
            # Extract the photographer's name from the 'alt' attribute
            alt_text = img_tag.attrs.get('alt', '')
            if alt_text:
                # Extract the photographer's name from the middle of the alt text array
                parts = alt_text.split(" - ")
                if len(parts) > 1:
                    photographer_name = parts[1].strip()

    # Format the data as JSON
    result = {
        "order": breadcrumbs[0],
        "family": breadcrumbs[1],
        "common_name": common_name,
        "scientific_name": scientific_name,
        "image_url": hero_image_url,
        "image_credit": photographer_name
    }

    return result

def insert_into_supabase(data):
    # Create a Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Insert data into the 'birds' table
    response = supabase.table("birds").insert(data).execute()

    # Check for errors
    if response.get("status_code") == 201:  # HTTP 201 Created
        print("Data inserted successfully!")
    else:
        print("Error inserting data:", response)

if __name__ == "__main__":
    # Example URL (replace with a real eBird species URL)
    url = "https://ebird.org/species/blkvul"

    # Scrape the data
    bird_data = scrape_ebird(url)
    if bird_data:
        # Display the JSON data in the CLI
        print("Scraped Data:")
        print(json.dumps(bird_data, indent=4))

        # Prompt for confirmation
        user_input = input("\nDo you want to insert this data into the database? (y/n): ").strip().lower()

        if user_input == "y":
            insert_into_supabase(bird_data)
        elif user_input == "n":
            print("Data not inserted into the database.")
        else:
            print("Invalid input. Please type 'y' or 'n'.")
    else:
        print("No data scraped.")
