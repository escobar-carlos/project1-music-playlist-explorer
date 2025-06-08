// Initialize variable to store data fetched from json
let data = null;

/**
 * Initialize the application
 */
async function init() {
    data = await fetchData();
    render();
    addEventListeners();
}

/**
 * Open modal window and displays appropriate playlist details
 * @param {string} playlistId - The ID of the playlist to display
 */
function openModal(playlistId) {
    // Find info about the playlist that was clicked
    let playlists = data.playlists;
    let matchingPlaylist = playlists.find(playlist => playlist.playlistId == playlistId);

    if (matchingPlaylist) {
        // Populate modal window
        document.querySelector('#playlistImage').src = matchingPlaylist.playlist_art;
        document.querySelector('#playlistTitle').textContent = matchingPlaylist.playlist_name;
        document.querySelector('#playlistCreator').textContent = matchingPlaylist.playlist_author;

        let songsContainer = document.querySelector('.modal-song-container');
        
        // Clear to avoid appending to existing songs in container
        songsContainer.innerHTML = '';

        let songs = matchingPlaylist.songs;

        // Create and append songs
        for (let song of songs) {
            let songCard = createSongCard(song);
            songsContainer.appendChild(songCard);
        }

        modal.style.display = "block"; 
    } else {
        console.error("An error has occured: A matching playlist was not found");
    }
}

const modal = document.querySelector('#playlistModal');
const span = document.querySelector('.close');

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/**
 * Render the playlist cards
 */
function render() {
    const playlistCards = document.querySelector('.playlist-cards');
    playlistCards.innerHTML = '';

    // Create playlist cards from scratch and append to container
    for (let playlist of data.playlists) {
        let card = createPlaylistCard(playlist);
        playlistCards.appendChild(card);
    }
}

/**
 * Create and return playlist card
 * @param {object} playlist - Information about the playlist
 */
function createPlaylistCard(playlist) {
    // Create card container
    let card = document.createElement('div');
    card.classList.add('playlist-card');

    // Add playlist ID as a data attribute
    card.setAttribute('data-playlist-id', playlist.playlistId);

    // Create and append image element
    let img = document.createElement('img');
    img.src = playlist.playlist_art;
    img.alt = 'Playlist Image';
    card.appendChild(img);

    // Create and append title element
    let title = document.createElement('h3');
    title.classList.add('playlist-title');
    title.textContent = playlist.playlist_name;
    card.appendChild(title);

    // Create and append author element
    let author = document.createElement('p');
    author.classList.add('playlist-creator');
    author.textContent = playlist.playlist_author;
    card.appendChild(author);

    // Create and append like button
    let likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.setAttribute('data-liked', false);
    likeButton.textContent = `\u2764 ${playlist.playlist_likes}`;

    card.appendChild(likeButton);

    // Create and append delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';

    card.appendChild(deleteButton);

    return card;
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
 * Add event listeners to playlist cards and modal
 */
function addEventListeners() {
    let playlistCards = document.querySelectorAll('.playlist-card');

    for (let card of playlistCards) {
        let playlistId = card.dataset.playlistId;
        // Allow modal functionality
        card.addEventListener('click', () => openModal(playlistId));

        // Allow liking
        let likeButton = card.querySelector('.like-button');
        likeButton.addEventListener('click', toggleLike);

        // Allow deleting
        let deleteButton = card.querySelector('.delete-button');
        deleteButton.addEventListener('click', toggleDelete);
    }

    // Allow shuffling
    let shuffleButton = document.querySelector('#shuffle-button');
    shuffleButton.addEventListener('click', shufflePlaylist);
}

/**
 * Create and return song card
 * @param {object} song - Information about the song
 */
function createSongCard(song) {
    // Create card container
    let card = document.createElement('div');
    card.classList.add('song-card');

    // Create and append image element
    let img = document.createElement('img');
    img.src = song.song_art;
    img.alt = 'Song Image'
    card.appendChild(img);
    
    // Create element that will store title/artist/album
    let songInfoElem = document.createElement('div');
    songInfoElem.classList.add('song-info');

    // Create and append title element
    let title = document.createElement('h2');
    title.textContent = song.song_name;
    title.classList.add('songTitle')
    songInfoElem.appendChild(title);

    // Create and append artist element
    let artist = document.createElement('p');
    artist.textContent = song.artist;
    artist.classList.add('songArtist');
    songInfoElem.appendChild(artist);

    // Create and append album element
    let album = document.createElement('p');
    album.textContent = song.album;
    album.classList.add('albumName');
    songInfoElem.appendChild(album);

    // Append song info element
    card.appendChild(songInfoElem);

    // Create and append duration element
    let duration = document.createElement('p');
    duration.textContent = song.duration;
    duration.classList.add('songDuration');
    
    card.append(duration);
    
    return card;
}

/**
 * Shuffle the songs in the modal
 */
function shufflePlaylist() {
    let songsContainer = document.querySelector('.modal-song-container');
    let songs = Array.from(document.querySelectorAll('.song-card'));

    // Clear to avoid appending to existing songs in container
    songsContainer.innerHTML = '';

    // Shuffle algorithm
    songs.sort(() => Math.random() - 0.5);

    // Create and append songs
    for (let song of songs) {
        songsContainer.appendChild(song);
    }
}

/**
 * Toggle the like button
 * @param {Event} event - click event
 */
function toggleLike(event) {
    event.stopPropagation();

    const likeButton = event.target;
    const liked = likeButton.dataset.liked === 'true';
    const likeCount = parseInt(likeButton.textContent.split(' ')[1]);
    // Calculate the new like count
    const updatedLikeCount = liked ? likeCount - 1: likeCount + 1;
    // Reflect changes on the button itself
    likeButton.textContent = `\u2764 ${updatedLikeCount}`;
    likeButton.style.color = liked ? "black" : "red";
    likeButton.dataset.liked = !liked;
}

/**
 * Delete a playlist
 * @param {Event} event - click event
 */
function toggleDelete(event) {
    event.stopPropagation();

    // Find information about the playlist wanting to be deleted
    const playlistCard = event.target.parentElement;
    const playlistId = playlistCard.dataset.playlistId;

    // Remove the playlist card from DOM
    playlistCard.remove();

    // Remove the playlist card from 'data' array
    data.playlists = data.playlists.filter(playlist => playlist.playlistId != playlistId);
}

init();