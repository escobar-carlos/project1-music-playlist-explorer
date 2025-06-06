function openModal(playlistId) {

    // fetch data from json, find correct playlist info
    fetchData().then((data) => {

        let playlists = data.playlists;
        let matchingPlaylist = null;
        for (let playlist of playlists) {
            if (playlist.playlistId == playlistId) {
                matchingPlaylist = playlist;
                break;
            }
        }
        if (matchingPlaylist) {
            document.querySelector('#playlistImage').src = matchingPlaylist.playlist_art;
            document.querySelector('#playlistTitle').textContent = matchingPlaylist.playlist_name;
            document.querySelector('#playlistCreator').textContent = matchingPlaylist.playlist_author;

            let songsContainer = document.querySelector('.modal-song-container');
            
            // clear if necessary
            songsContainer.innerHTML = '';

            let songs = matchingPlaylist.songs;

            for (let song of songs) {
                let songCard = createSongCard(song);
                songsContainer.appendChild(songCard);
            }

            modal.style.display = "block"; 
        } else {
            console.error("An error has occured: A matching playlist was not found");
        }
    })

}

const modal = document.querySelector('#playlistModal');
const span = document.querySelectorAll('.close')[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


async function createPlaylistCards() {
    // wait until data is fetched from json
    const dataAsynch = await fetchData();
    const playlists = dataAsynch.playlists;

    const playlistCards = document.querySelector('.playlist-cards');

    for (let playlist of playlists) {
        let card = createPlaylistCard(playlist);
        playlistCards.appendChild(card);
    }
}

function createPlaylistCard(playlist) {
    let elem = document.createElement('div');
    elem.classList.add('playlist-card');

    // create img elem and then append
    let img = document.createElement('img');
    img.src = playlist.playlist_art;
    img.alt = 'Playlist Image';
    elem.appendChild(img);

    // create h3 elem for title and then append
    let h3 = document.createElement('h3');
    h3.classList.add('playlist-title');
    h3.textContent = playlist.playlist_name;
    elem.appendChild(h3);

    // create p elem for creator name and then append
    let p = document.createElement('p');
    p.classList.add('playlist-creator');
    p.textContent = playlist.playlist_author;
    elem.appendChild(p);

    // create like button
    let likeButton = document.createElement('button');
    likeButton.classList.add('like-button');
    likeButton.setAttribute('data-liked', false);
    likeButton.textContent = `\u2764 ${playlist.playlist_likes}`;

    likeButton.addEventListener('click', toggleLike);

    elem.appendChild(likeButton);

    // create delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';

    elem.appendChild(deleteButton);

    // add id as a data attribute
    elem.setAttribute('data-playlist-id', playlist.playlistId);
    
    return elem;
}

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

function addModalFunctionality() {
    let playlists = document.querySelectorAll('.playlist-card');

    for (let playlist of playlists) {
        playlist.addEventListener('click', () => {
            openModal(playlist.dataset.playlistId);
        })

        // add delete button click functinality
        let deleteButton = playlist.querySelector('.delete-button');
        deleteButton.addEventListener('click', (event) => {
            toggleDelete(event, playlist.dataset.playlistId);
        })
    }
}

function createSongCard(song) {

    let elem = document.createElement('div');
    elem.classList.add('song-card');

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

    // append songInfo to main elem
    elem.appendChild(songInfoElem);

    // create another p elem for song duration and then append
    let p3 = document.createElement('p');
    p3.textContent = song.duration;
    p3.classList.add('songDuration');
    
    elem.append(p3);
    
    return elem;
}

function toggleLike(event) {
    event.stopPropagation();

    const likeButton = event.target;
    const liked = likeButton.dataset.liked === 'true';
    const likeCount = parseInt(likeButton.textContent.split(' ')[1]);
    const updatedLikeCount = liked ? likeCount - 1: likeCount + 1;
    likeButton.textContent = `\u2764 ${updatedLikeCount}`;
    likeButton.style.color = liked ? "black" : "red";
    likeButton.dataset.liked = !liked;
}

function shufflePlaylist() {
    let songsContainer = document.querySelector('.modal-song-container');
    let songs = Array.from(document.querySelectorAll('.song-card'));

    // clear if necessary
    songsContainer.innerHTML = '';

    songs.sort(() => Math.random() - 0.5);

    for (let song of songs) {
        songsContainer.appendChild(song);
    }
}

function toggleDelete(event, playlistId) {
    event.stopPropagation();
    let playlists = document.querySelectorAll('.playlist-card');

    let matchingPlaylist = null;
    for (let playlist of playlists) {
        if (playlist.dataset.playlistId == playlistId) {
            matchingPlaylist = playlist;
            break;
        }
    }

    if (matchingPlaylist) {
        matchingPlaylist.remove();
    } else {
        console.error("An error has occured: Could not find playlist to delete");
    }

}


createPlaylistCards().then(() => {
    addModalFunctionality();
    let shuffleButton = document.querySelector('#shuffle-button');
    shuffleButton.addEventListener('click', shufflePlaylist);
});