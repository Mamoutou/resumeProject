import json
import re
import os

DIRECTORY = "big_dataset"
# DIRECTORY = "small_dataset"

outlyrics = open("lyrics.txt",'w',encoding="utf-8")
outlabels = open("labels.txt",'w',encoding="utf-8")

#matches "[text like this]" and apostrophes (it was messing up the scikit parser)
section_match = re.compile("\[[^\]]*\](\\n)?|'")


newline_match = re.compile("(\\n)")



for i,filename in enumerate(os.listdir('./'+DIRECTORY)):

    # if(i>3):
    #     break
    
    with open("./"+DIRECTORY+"/"+filename,'r',encoding="utf-8") as f:
        data = json.load(f)

    artist = data["artist"]

    for song in data["songs"]:
        if(song["raw"]["lyrics_state"]!="complete" or len(song["lyrics"])<10):
            print(song["title"]+" doesnt have lyrics")
            continue
        song_lyrics = re.sub(section_match, '', song["lyrics"])
        song_lyrics = re.sub(newline_match, ' ', song_lyrics)
        if(len(song_lyrics)<5):
            print(song["title"]+" doesnt have lyrics")
            continue
        # print((song_lyrics))
        # outlyrics.write(repr(song_lyrics)+"\n")
        outlyrics.write(artist+"\t"+song_lyrics+"\n")
        # outlabels.write(artist+"\n")

        
