from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import json, os, time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Setup ChromeDriver using WebDriver Manager
options = Options()
options.add_argument("--headless")  # Run in headless mode (remove this line if you want to see the browser)
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

driver.get("https://www.google.com")
print("Page title:", driver.title)  # Should print "Google"

try:
    url = "https://www.chess.com/game/live/106129187351"
    driver.get(url)
    time.sleep(5)  # Wait for JavaScript to load

    # Find move elements
    move_elements = driver.find_elements(By.CLASS_NAME, "node-highlight-content")
    moves = [move.text.strip() for move in move_elements if move.text.strip()]

    print(moves)

    # Save to file
    directory = r"all assets\moves"
    os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, "moves.json")
    
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump({"moves": moves}, file, indent=2)
    
    print(f"✅ Moves saved at {file_path}")

except Exception as e:
    print(f"❌ Error: {e}")

finally:
    driver.quit()
