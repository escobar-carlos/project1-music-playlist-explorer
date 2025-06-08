let data = null;

/**
 * Initialize the application
 */
async function init() {
    data = await fetchData();
    render();
}

/**
 * Fetch data from JSON file and returns a promise of it
 */
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

/**
 * Create and return song card
 * @param {object} song - Information about the song
 */
function createFeaturedSongCard(song) {
    // Create card container
    let card = document.createElement('div');
    card.classList.add('song');

    // Create and append image element
    let img = document.createElement('img');
    img.src = song.song_art;
    img.alt = 'Song Image'
    card.appendChild(img);
    
    // Create element that will store title/artist/album
    let songInfoElem = document.createElement('div');
    songInfoElem.classList.add('song-info');

    // Create and append title element
    let songTitle = document.createElement('h2');
    songTitle.textContent = song.song_name;
    songTitle.classList.add('songTitle')
    songInfoElem.appendChild(songTitle);

    // Create and append artist element
    let songArtist = document.createElement('p');
    songArtist.textContent = song.artist;
    songArtist.classList.add('songArtist');
    songInfoElem.appendChild(songArtist);

    // Create and append album element
    let album = document.createElement('p');
    album.textContent = song.album;
    album.classList.add('albumName');
    songInfoElem.appendChild(album);
    
    // Create and append duration element
    let duration = document.createElement('p');
    duration.textContent = song.duration;
    duration.classList.add('songDuration');
    songInfoElem.append(duration);

    // Append song info element
    card.appendChild(songInfoElem);
    
    return card;
}

/**
 * Render the page
 */
function render() {
    let playlists = data.playlists;
    
    let randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

    let songs = randomPlaylist.songs;

    let playlistContainer = document.querySelector('.playlist');

    // Create and append image element
    let img = document.createElement('img');
    img.src = randomPlaylist.playlist_art;
    img.alt = 'Playlist Image';
    playlistContainer.appendChild(img);

    // Create and append title element
    let title = document.createElement('h3');
    title.textContent = randomPlaylist.playlist_name;
    playlistContainer.appendChild(title);

    let songsContainer = document.querySelector('.songs');

    // Create song cards from scratch and append to container
    for (let song of songs) {
        let songCard = createFeaturedSongCard(song);
        songsContainer.append(songCard);
    }
}

init();