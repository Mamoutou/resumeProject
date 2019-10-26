import lyricsgenius as genius

# This MyGenius class is a subclass of the Genius class found in the lyricsgenius package
# It overrides the search_artist() function with a version that allows for search results to be sorted by popularity

class MyGenius(genius.Genius):
    def search_artist(self, artist_name, max_songs=None, get_full_song_info=True,sort = 'popularity'):
        """Search Genius.com for songs by the specified artist.
        Returns an Artist object containing artist's songs.
        :param artist_name: Name of the artist to search for
        :param max_songs: Maximum number of songs to search for
        :param get_full_song_info: Get full info for each song (slower)
        :param pop_sort: sort by popularity or title
        """

        if self.verbose:
            print('Searching for songs by {0}...\n'.format(artist_name))

        # Perform a Genius API search for the artist
        json_search = self.search_genius(artist_name)
        first_result, artist_id = None, None
        for hit in json_search['hits']:
            found_artist = hit['result']['primary_artist']
            if first_result is None:
                first_result = found_artist
            artist_id = found_artist['id']
            if (self.take_first_result or
                self._clean_str(found_artist['name'].lower()) ==
                self._clean_str(artist_name.lower())):
                # Break out if desired artist is found
                artist_name = found_artist['name']
                break
            else:
                # check for searched name in alternate artist names
                json_artist = self.get_artist(artist_id)['artist']
                if artist_name.lower() in [s.lower() for s in json_artist['alternate_names']]:
                    if self.verbose:
                        print("Found alternate name. Changing name to {}.".format(json_artist['name']))
                    artist_name = json_artist['name']
                    break
                artist_id = None

        if first_result is not None and artist_id is None and self.verbose:
            if input("Couldn't find {}. Did you mean {}? (y/n): ".format(artist_name,
                                                         first_result['name'])).lower() == 'y':
                artist_name, artist_id = first_result['name'], first_result['id']
        assert (not isinstance(artist_id, type(None))), "Could not find artist. Check spelling?"

        # Make Genius API request for the determined artist ID
        json_artist = self.get_artist(artist_id)
        # Create the Artist object
        artist = genius.artist.Artist(json_artist)

        if max_songs is None or max_songs > 0:
            # Access the api_path found by searching
            artist_search_results = self.get_artist_songs(artist_id,sort=sort)

            # Download each song by artist, store as Song objects in Artist object
            keep_searching = True
            next_page, n = 0, 0
            while keep_searching:
                for json_song in artist_search_results['songs']:
                    # TODO: Shouldn't I use self.search_song() here?

                    # Songs must have a title
                    if 'title' not in json_song:
                        json_song['title'] = 'MISSING TITLE'

                    # Remove non-song results (e.g. Linear Notes, Tracklists, etc.)
                    lyrics = self._scrape_song_lyrics_from_url(json_song['url'])
                    song_is_valid = self._result_is_lyrics(json_song['title']) if (lyrics and self.skip_non_songs) else True

                    if song_is_valid:
                        if get_full_song_info:
                            song = genius.song.Song(self.get_song(json_song['id']), lyrics)
                        else:  # Create song with less info (faster)
                            song = genius.song.Song({'song': json_song}, lyrics)

                        # Add song to the Artist object
                        if artist.add_song(song, verbose=False) == 0:
                            n += 1
                            if self.verbose:
                                print('Song {0}: "{1}"'.format(n, song.title))

                    else:  # Song does not contain lyrics
                        if self.verbose:
                            print('"{title}" does not contain lyrics. Rejecting.'.format(title=json_song['title']))

                    # Check if user specified a max number of songs
                    if not isinstance(max_songs, type(None)):
                        if artist.num_songs >= max_songs:
                            keep_searching = False
                            if self.verbose:
                                print('\nReached user-specified song limit ({0}).'.format(max_songs))
                            break

                # Move on to next page of search results
                next_page = artist_search_results['next_page']
                if next_page is None:
                    break
                else:  # Get next page of artist song results
                    artist_search_results = self.get_artist_songs(artist_id, page=next_page,sort=sort)

            if self.verbose:
                print('Found {n_songs} songs.'.format(n_songs=artist.num_songs))

        if self.verbose:
            print('Done.')

        return artist