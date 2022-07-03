import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";

export default class Song {

    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyB-F3xM_DPJYMFP15r2k_321jx6AJ78D8g",
            authDomain: "pwa-1070233.firebaseapp.com",
            projectId: "pwa-1070233",
            storageBucket: "pwa-1070233.appspot.com",
            messagingSenderId: "402904683754",
            appId: "1:402904683754:web:7843c2f3c1f8a7ad1eb393"
        };

        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }

    getAll() {
        return new Promise((resolve, reject) => {
            getDocs(collection(this.db, "songs"))
                .then(snapshots => {
                    const songs = [];
                    snapshots.forEach(doc => {
                        const data = doc.data();
                        songs.push({
                            id: doc.id,
                            songTitle: data.songTitle,
                            artist: data.artist,
                            likeCount: data.likeCount
                        })
                    })
                    resolve(songs)

                }).catch(err => reject(err))
        })
    }

    add(songTitle, artist, likeCount = 0) {
        const dbCollection = collection(this.db, "songs");
        return addDoc(dbCollection, {
            songTitle: songTitle,
            artist: artist,
            likeCount: likeCount
        })
    }

    remove(song) {
        const dbDoc = doc(this.db, "songs", song.id);
        return deleteDoc(dbDoc)
    }

    like(song) {
        return new Promise((resolve, reject) => {
            const dbDoc = doc(this.db, "songs", song.id);
            updateDoc(dbDoc, {
                likeCount: song.likeCount + 1
            }).then(() => {
                song.likeCount += 1;
                resolve(song);
            }).catch((error) => reject(error));
        })
    }
}
