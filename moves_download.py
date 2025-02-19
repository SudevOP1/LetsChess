from bs4 import BeautifulSoup
import requests, os, sys, json

sys.stdout.reconfigure(encoding='utf-8') # for emojis

# make changes here 👇
file_name = "moves.json"
directory = r"all assets\moves"
url = "https://www.chess.com/game/live/106129187351"


location = os.path.join(directory, file_name)
os.makedirs(directory, exist_ok=True) # create dir if it does not exist
class_names = ["node-highlight-content", "offset-for-annotation-icon"]

try:
    # fetch the page
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    if response.status_code != 200:
        print(f"Failed to fetch page, status code: {response.status_code}")
        sys.exit(1)
    soup = BeautifulSoup(response.text, "html.parser")

    # extract moves
    moves = [move.text.strip() for move in soup.find_all("span", class_="node-highlight-content")]

    # save file
    data = {"moves": moves}
    with open(location, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)
    print(f"✅ Moves saved at {location}")

except Exception as e:
    print(f"❌ Error occured: {e}")