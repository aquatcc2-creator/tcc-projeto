// Inicialização do Firebase (App, Auth e Realtime Database)
if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}

const auth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : null;
const db   = (typeof firebase !== 'undefined' && firebase.database) ? firebase.database() : null;

