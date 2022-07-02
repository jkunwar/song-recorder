if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./song-recorder/service-worker.js', { scope: '/song-recorder/' })
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err));
} else {
    console.log('Service worker is not supported.')
}

const todoItemContainer = document.getElementById('songs');

const items = getFromLocalStorage('songs');
const songs = items ? JSON.parse(items) : [];
if (songs) {
    songs.forEach(todo => generateHTMLForTodoList(todo))
}

function handleAddClick(event) {
    const newItem = document.getElementsByName('task')[0].value;

    if (!newItem) return;

    const item = { title: newItem, isComplete: false };
    generateHTMLForTodoList(item)

    songs.push(item)
    setToLocalStorage('songs', JSON.stringify(songs))
}

function generateHTMLForTodoList(item) {
    //create new element
    const listItem = document.createElement('li');
    listItem.className = 'list-item';
    const node = document.createTextNode(item.title);
    if (item.isComplete) {
        listItem.classList.add('line-through')
    }
    listItem.appendChild(node);

    //append new element to todoItem
    todoItemContainer.prepend(listItem);
}


function getFromLocalStorage(key) {
    return window.localStorage.getItem(key)
}

function setToLocalStorage(key, value) {
    window.localStorage.setItem(key, value)
}