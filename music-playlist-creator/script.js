const modal = document.querySelector('#playlistModal');
const span = document.querySelectorAll('.close')[0];
const playlistCards = document.querySelectorAll('.playlist-card');

for (let i = 0; i < playlistCards.length; i++) {
    playlistCards[i].addEventListener('click', () => {
        const playlistImage = playlistCards[i].querySelector('img').src;
        const playlistTitle = playlistCards[i].querySelector('h3').textContent;
        const playlistCreator = playlistCards[i].querySelector('p').textContent;
    
        let playlist = {
            imagePath: playlistImage,
            title: playlistTitle,
            creator: playlistCreator,
            songs: ["Example Song 1", "Example Song 2", "Example Song 3"],
        }

        openModal(playlist);
    })
}

function openModal(playlist) {
    document.querySelector('#playlistTitle').textContent = playlist.title;
    document.querySelector('#playlistImage').src = playlist.imagePath;
    document.querySelector('#playlistCreator').textContent = playlist.creator;
    document.querySelector('#playlistSongs').innerHTML = `<strong>Songs:</strong> ${playlist.songs.join(', ')}`;
    modal.style.display = "block"; 
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}