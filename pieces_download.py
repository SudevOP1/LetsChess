from bs4 import BeautifulSoup
import requests, os, sys


sys.stdout.reconfigure(encoding='utf-8') # for emojis

location = "all assets\images"
os.makedirs(location, exist_ok=True) # create dir if it does not exist


piece_links = [ 
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/wp.png", # white pawn
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/wn.png", # white knight
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/wr.png", # white rook
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/wb.png", # white bishop
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/wq.png", # white queen
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/wk.png", # white king

    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/bp.png", # black pawn
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/bn.png", # black knight
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/bb.png", # black rook
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/br.png", # black bishop
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/bq.png", # black queen
    "https://images.chesscomfiles.com/chess-themes/pieces/ocean/150/bk.png", # black king
]

def download_image(url, filename):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(filename, 'wb') as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        print(f"✅ Saved  {filename}")
    else:
        print(f"❌ Failed {filename}")


for link in piece_links:
    filename = os.path.join(location, link.split("/")[-1])
    download_image(link, filename)
