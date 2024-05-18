from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import json

app = Flask(__name__);

def scrape_bird(url):
    response = response.get(url);
    soup = BeautifulSoup(response.content, 'html.parser')

    common_name = ""
    preservation_status = ""
    scientific_name = ""
    genus = ""
    species = ""
    
    common_name = soup.find('span', class_ ="Heading-main");
    scientific_name = soup.find("span", class_ ="Heading-sub Heading-sub--sci");
    spec_list = scientific_name.split();
    genus = spec_list[0]
    species = spec_list[1]
    div = soup.find('div', class_='u-colorReverse')
    if div:
        a_tag = div.find('a')
        if a_tag:
            preservation_status = a_tag.get_text(strip=True)
    data = {
        'common_name': common_name,
        'iucn_status': preservation_status,
        'genus': genus,
        'species': species,
        'binomial_name': scientific_name
    }

    return data

@app.route('/scrape', methods=['POST'])
def scrape():
    url = request.json['url']
    data = scrape_bird(url);
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

