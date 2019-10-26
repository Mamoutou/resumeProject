from myGenius import MyGenius
import sys

# Get API token and initialize
token = ''
with open('token.txt','r') as t:
    token = t.read()
api = MyGenius(token)

# read a config file
# config file needs to be a list of artist names, separated by newlines
# first line is an integer representing max number of songs to scrape per artist
# returns the song limit and a list of artist names
def get_config():
    with open(sys.argv[1],'r') as f:
        config = f.read().strip().split('\n')
    return int(config[0]),config[1:]


limit,names = get_config()

# for each artists in the list, search for songs, and save to a json file
for name in names:
    artist = api.search_artist(name.strip(),max_songs=limit)
    if artist.num_songs < limit:
        continue
    #print(artist)
    artist.save_lyrics()


