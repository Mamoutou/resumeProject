import json
import re
import os
import sys

# This file parses all the scraped json files into a text file that is usable by the main jupyter notebook

# The file directory is passed in as a cmd line argument
DIRECTORY = sys.argv[1]
# DIRECTORY = "small_dataset"

#matches the section headers in genius lyrics which look like [Verse 1: Artist], as well as the following content
verse_match = re.compile(r"(\[[^\]]*\])([^\[]*)")


with open("lyrics.txt",'w',encoding="utf-8") as outlyrics:

    for i,filename in enumerate(os.listdir('./'+DIRECTORY)):
        #print(filename)

        #only match json files
        if '.json' not in filename:
            continue
        #load in the json
        with open("./"+DIRECTORY+"/"+filename,'r',encoding="utf-8") as f:
            data = json.load(f)

        #find artist name
        artist = data["artist"]

        #process each file and write out lyrics to txt
        
        # find songs
        for song in data["songs"]:

            # get song title
            title = song['title']

            # remove incomplete or short lyrics
            if(song["raw"]["lyrics_state"]!="complete" or len(song["lyrics"])<10):
                print(song["title"]+" doesnt have lyrics")
                continue
            
            # find lyrics to song
            lyrics = song["lyrics"]
            
            # use regex to separate song sections and remove featured artists
            for match in re.finditer(verse_match,lyrics):
                if (':' in match.group(1)) and (artist not in match.group(1)):
                    lyrics = lyrics.replace(match.group(0),'')
                else:
                    lyrics = lyrics.replace(match.group(1),'')

            # remove unwanted characters
            lyrics = lyrics.replace('\n',' ')
            lyrics = lyrics.replace('\t',' ')
            lyrics = lyrics.replace("'",'')

            # remove short lyrics
            if (not lyrics) or len(lyrics)<10:
                print(song["title"]+" doesnt have lyrics")
                continue
            
            # write lyrics out to file
            outlyrics.write(f"{artist}\t{title}\t{lyrics}\n")
