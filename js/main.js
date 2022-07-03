import Song from './song.js'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/song-recorder/service-worker.js', { scope: '/song-recorder/' })
        .then((res) => { console.log(res) })
        .catch(err => console.log(err));

    navigator.serviceWorker.ready
        .then((registration) => { console.log(registration) })

} else {
    console.log('Service worker is not supported.')
}

const song = new Song();
getAllSongs();

document.getElementById('addSong').addEventListener('click', handleAddSong)
function handleAddSong() {
    const songTitle = document.getElementById('songTitle').value;
    const artist = document.getElementById('artist').value;

    if (!songTitle || !artist)
        return;

    song.add(songTitle, artist)
        .then((docRef) => appendSong({ id: docRef.id, songTitle: songTitle, artist: artist, likeCount: 0 }))
        .catch((error) => console.error("Error adding document: ", error));

}

async function getAllSongs() {
    try {
        const snapshots = await song.getAll();
        snapshots.forEach(song => appendSong(song));
    } catch (error) {
        console.log('Error: ', error)
    }
}

const songsContainer = document.getElementById('songs');
function appendSong(item) {
    const listItem = document.createElement('li');
    listItem.className = 'song-item';
    songsContainer.prepend(listItem)

    listItem.innerHTML = getSongListInnerHTML(item);
    appendActionButtons(listItem, item)
}

function appendActionButtons(element, item) {
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';

    const removeBtn = document.createElement('button');
    removeBtn.classList = 'remove-song';
    removeBtn.innerText = 'Remove';
    removeBtn.addEventListener('click', () => {
        song.remove(item)
            .then(() => element.remove())
            .catch(err => console.error(err))
    })
    actionButtons.appendChild(removeBtn);

    const likeBtn = document.createElement('button');
    likeBtn.classList = 'add-like';
    likeBtn.innerText = '+1 Like';
    likeBtn.addEventListener('click', () => {
        song.like(item)
            .then(res => {
                element.innerHTML = getSongListInnerHTML(res);
                appendActionButtons(element, res)
            })
            .catch(err => console.error(err))

    })
    actionButtons.appendChild(likeBtn);

    element.appendChild(actionButtons);
}

function getSongListInnerHTML(item) {
    return `
        <div class="song-details">
            <div class="song-info">
                <p class="song-title">${item.songTitle}</p>
                <span class="artist">${item.artist}</span>
            </div>
            <div class="likes">
                Likes: <span class="like-count">${item.likeCount}</span>
            </div>
        </div>
    `
}