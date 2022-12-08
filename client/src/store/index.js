import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CHANGE_SEARCH_BY: "CHANGE_SEARCH_BY",
    SEARCH: "SEARCH",
    CHANGE_SORT_BY: "CHANGE_SORT_BY",
    CHANGE_PLAY_SONG: "CHANGE_PLAY_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

const SearchBy = {
    HOME: "HOME",
    ALL: "ALL",
    USERS: "USERS"
}

const SortBy = {
    AZ: "AZ",
    CREATE: "CREATE",
    EDIT: "EDIT",
    PUBLISH: "PUBLISH",
    LISTENS: "LISTENS",
    LIKES: "LIKES",
    DISLIKES: "DISLIKES"
}
// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        searchBy: SearchBy.HOME,
        searchedPairs: null,
        sortBy: SortBy.AZ,
        playSong: 0
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            case GlobalStoreActionType.CHANGE_SEARCH_BY: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: payload.searchBy,
                    searchedPairs: null,
                    sortBy: SortBy.AZ,
                    playSong: store.playSong
                });
            }
             case GlobalStoreActionType.SEARCH: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: payload,
                    sortBy: store.sortBy,
                    playSong: store.playSong
                });
            }
            case GlobalStoreActionType.CHANGE_SORT_BY: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: payload.searchedPairs,
                    sortBy: payload.sortBy,
                    playSong: store.playSong
                });
            }
            case GlobalStoreActionType.CHANGE_PLAY_SONG: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    searchBy: store.searchBy,
                    searchedPairs: store.searchedPairs,
                    sortBy: store.sortBy,
                    playSong: payload
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.
    store.changePlaySong = function (index){
        storeReducer({
                    type: GlobalStoreActionType.CHANGE_PLAY_SONG,
                    payload: index
                });
    }
    store.changeSearchBy = function (searchBy){
        async function asyncChangeSearchBy(searchBy){
        let response = ''
        if(searchBy === SearchBy.HOME){
            response = await api.getPlaylistPairs();}
        else
            response = await api.getAllPlaylistPairs();
        
        if(response.data.success){
            let idNamePairs = response.data.idNamePairs;
            console.log(idNamePairs);
            idNamePairs.sort(function(a,b){
                if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
            return 0;
            })
         storeReducer({
            type: GlobalStoreActionType.CHANGE_SEARCH_BY,
            payload: {
                searchBy: searchBy,
                idNamePairs: idNamePairs,
            }
        });
    }
}
    asyncChangeSearchBy(searchBy)
    }

    store.changeSort = function(type){
        let list = store.idNamePairs;
        if(store.searchedPairs!==null){
            list = store.searchedPairs;
        }
        if(type ===   SortBy.AZ){
            list.sort(function(a,b){
                if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
            return 0;
            })
            console.log(list)
        }else if(type === SortBy.CREATE){
            list.sort(function(a,b){
                if(a.createDate < b.createDate) { return -1; }
                if(a.createDate > b.createDate) { return 1; }
            return 0;
            })
        }else if(type === SortBy.EDIT){ // New to old
            list.sort(function(a,b){
                if(a.editDate < b.editDate) { return 1; }
                if(a.editDate > b.editDate) { return -1; }
            return 0;
            })
        }else if(type === SortBy.PUBLISH){
            list.sort(function(a,b){
                if(a.publishDate < b.publishDate) { return 1; }
                if(a.publishDate > b.publishDate) { return -1; }
            return 0;
            })
        }else if(type === SortBy.LISTENS){
            list.sort(function(a,b){
                if(a.views < b.views) { return 1; }
                if(a.views > b.views) { return -1; }
            return 0
            })
        }else if(type === SortBy.LIKES){
            list.sort(function(a,b){
               if(a.likes < b.likes) { return 1; }
                if(a.likes > b.likes) { return -1; }
            return 0
            })
        }else if(type === SortBy.DISLIKES){
            list.sort(function(a,b){
               if(a.dislikes < b.dislikes) { return 1; }
                if(a.dislikes > b.dislikes) { return -1; }
            return 0
            })
        }
        console.log(list);
        let idNamePairs = store.idNamePairs;
        let searchedPairs = null;
        if(store.searchedPairs!==null){
            searchedPairs = list;
        }else{
            idNamePairs = list;
        }
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SORT_BY,
            payload: {
                sortBy: type,
                idNamePairs: idNamePairs,
                searchedPairs: searchedPairs
            }
        });
    }

    store.sort = function(list){
        let type = store.sortBy;
          if(type ===   SortBy.AZ){
            list.sort(function(a,b){
                if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
            return 0;
            })
            console.log(list)
        }else if(type === SortBy.CREATE){
            list.sort(function(a,b){
                if(a.createDate < b.createDate) { return -1; }
                if(a.createDate > b.createDate) { return 1; }
            return 0;
            })
        }else if(type === SortBy.EDIT){ // New to old
            list.sort(function(a,b){
                if(a.editDate < b.editDate) { return 1; }
                if(a.editDate > b.editDate) { return -1; }
            return 0;
            })
        }else if(type === SortBy.PUBLISH){
            list.sort(function(a,b){
                if(a.publishDate < b.publishDate) { return 1; }
                if(a.publishDate > b.publishDate) { return -1; }
            return 0;
            })
        }else if(type === SortBy.LISTENS){
            list.sort(function(a,b){
                if(a.views < b.views) { return 1; }
                if(a.views > b.views) { return -1; }
            return 0
            })
        }else if(type === SortBy.LIKES){
            list.sort(function(a,b){
               if(a.likes < b.likes) { return 1; }
                if(a.likes > b.likes) { return -1; }
            return 0
            })
        }else if(type === SortBy.DISLIKES){
            list.sort(function(a,b){
               if(a.dislikes < b.dislikes) { return 1; }
                if(a.dislikes > b.dislikes) { return -1; }
            return 0
            })
        }
        return list;
    }

    store.search = function(text){
        let newpairs = store.idNamePairs;
        console.log(newpairs)
        store.sort(newpairs)
        if(store.searchBy === SearchBy.HOME || store.searchBy === SearchBy.ALL){
            newpairs = store.idNamePairs.filter((p) => p.name.toLowerCase().includes(text))
        }else{
            newpairs = store.idNamePairs.filter((p) => p.ownerUsername.toLowerCase().includes(text))
        }
        console.log(newpairs);
         storeReducer({
            type: GlobalStoreActionType.SEARCH,
            payload: newpairs
        });
    }
    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                store.sort(pairsArray);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }
    store.getPlaylists = function() {
        async function asyncGetPlaylists() {
        let response = await api.getAllPlaylistPairs();
        console.log(response);
    }
    asyncGetPlaylists()
}
    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
        console.log(store.currentSongIndex)

    }
    store.containsListName = function(listName){
        return store.idNamePairs.filter(e => e.name === listName).length > 0
    }
    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        async function asyncCreateNewList() {
        console.log(store.idNamePairs)
        let count = 0;
        while(store.containsListName("Untitled "+count)){
            count++;
        }
        let newListName = "Untitled " + count;
        console.log(auth.user)
        let response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.username, false);
        console.log("createNewList response: " + response);
        console.log(response)

        if (response.status === 201) {
            tps.clearAllTransactions();
            let playlist = response.data.playlist
            async function getListPairs(playlist) {
                response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    store.sort(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {
                            idNamePairs: pairsArray,
                            playlist: playlist
                        }
                    });
                }
            }
            getListPairs(playlist);            
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
          }

    asyncCreateNewList()
    }

    store.duplicateList = function(){
        async function asyncDuplicateList() {
        let dupSong = store.currentList;
        let newName = "Copy of "+ dupSong.name;
        let response = await api.createPlaylist(newName, dupSong.songs, auth.user.email, auth.user.username, false);
        console.log("createNewList response: " + response);
        console.log(response)

        if (response.status === 201) {
            tps.clearAllTransactions();
            let playlist = response.data.playlist
            async function getListPairs(playlist) {
                response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    store.sort(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {
                            idNamePairs: pairsArray,
                            playlist: playlist
                        }
                    });
                }
            }
            getListPairs(playlist);            
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
          }

    asyncDuplicateList()

    }

    store.addList = function(){
        let id = store.createNewList()
        console.log(id)
        store.setCurrentList(id);
    }
    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            let response = ""
            if(store.searchBy === SearchBy.HOME)
                response = await api.getPlaylistPairs();
            else
                response= await api.getAllPlaylistPairs();
            console.log(response)
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                store.sort(pairsArray);
                console.log(pairsArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.publishList = function(){
        async function asyncPublishList() {
            let response = await api.getPlaylistById(store.currentList._id);
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(playlist)
                playlist.published = true;
                playlist.likes = [];
                playlist.dislikes = [];
                playlist.views = 0;
                playlist.publishDate = today;
                console.log(playlist)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    console.log(response)
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            console.log(response)
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                store.sort(pairsArray);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublishList();
    }

     store.like = function(id, add){
        async function asyncPublishList() {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(add){
                    if(playlist.likes.indexOf(auth.user.username)!==-1){
                        playlist.likes.splice(playlist.likes.indexOf(auth.user.username), 1);
                    }
                    else{
                    playlist.likes.push(auth.user.username);
                    let index = playlist.dislikes.indexOf(auth.user.username);
                    if(index!==-1){
                         playlist.dislikes.splice(index, 1);
                    }
                }
                }else{
                     if(playlist.dislikes.indexOf(auth.user.username)!==-1){
                        playlist.dislikes.splice(playlist.dislikes.indexOf(auth.user.username), 1);
                    }
                    else{
                    playlist.dislikes.push(auth.user.username);
                    let index = playlist.likes.indexOf(auth.user.username);
                    if(index!==-1){
                         playlist.likes.splice(index, 1);
                    }
                }
                }
                console.log(playlist)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    console.log(response)
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            console.log(response)
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                store.sort(pairsArray);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublishList();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            console.log(id)
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
           // if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/");
          //  }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    store.getOwnerUsername = function(id){
        async function asyncGetUsername(id){
            let response = await api.getPlaylistById(id);
            if(response.data.success){
                return response.data.playlist.ownerUsername
            }
        }
        asyncGetUsername(id);
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList() {
           let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(playlist.published)
                    playlist.views = playlist.views+1;
                console.log(playlist.views)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    console.log(response)
                    if (response.data.success) {
                        async function getListPairs(playlist) { 
                            if(store.searchBy===SearchBy.HOME)
                                response = await api.getPlaylistPairs();
                            else
                                response = await api.getAllPlaylistPairs();
                            console.log(response)
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                store.sort(pairsArray);
                                storeReducer({
                                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        playlist: store.currentList,
                        idNamePairs: store.idNamePairs
                    }
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };