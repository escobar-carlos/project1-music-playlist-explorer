async function fetchData() {
    try {
        const response = await fetch('data/data.json');

        if (!response) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error("An error occured: ", error);
    }
}

function createFeaturedSongCard(song) {

    let elem = document.createElement('div');
    elem.classList.add('song');

    // create img elem and then append
    let img = document.createElement('img');
    img.src = song.song_art;
    img.alt = 'Song Image'
    elem.appendChild(img);
    
    // create song-info elem
    let songInfoElem = document.createElement('div');
    songInfoElem.classList.add('song-info');

    // create h2 elem for title and then append
    let h2 = document.createElement('h2');
    h2.textContent = song.song_name;
    h2.classList.add('songTitle')
    songInfoElem.appendChild(h2);

    // create p elem for artist name and then append
    let p = document.createElement('p');
    p.textContent = song.artist;
    p.classList.add('songArtist');
    songInfoElem.appendChild(p);

    // create another p elem for album name and then append
    let p2 = document.createElement('p');
    p2.textContent = song.album;
    p2.classList.add('albumName');
    songInfoElem.appendChild(p2);

    
    // create another p elem for song duration and then append
    let p3 = document.createElement('p');
    p3.textContent = song.duration;
    p3.classList.add('songDuration');
    songInfoElem.append(p3);

    // append songInfo to main elem
    elem.appendChild(songInfoElem);

    // TODO: might need this?
    // elem.setAttribute('data-song-id', song.songID);
    
    return elem;
}


fetchData().then((data) => {
    let playlists = data.playlists;
    
    let randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

    let songs = randomPlaylist.songs;

    let playlistContainer = document.querySelector('.playlist');

    // create img elem
    let img = document.createElement('img');
    img.src = randomPlaylist.playlist_art;
    img.alt = 'Playlist Image';
    playlistContainer.appendChild(img);

    // create h3 elem for title and then append
    let h3 = document.createElement('h3');
    h3.textContent = randomPlaylist.playlist_name;
    playlistContainer.appendChild(h3);


    let songsContainer = document.querySelector('.songs');

    for (let song of songs) {
        let songCard = createFeaturedSongCard(song);
        songsContainer.append(songCard);
    }
})