import React from 'react';
import YouTube from 'react-youtube';
import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

export default function YouTubePlayerExample() {
    const { store } = useContext(GlobalStoreContext);
    const [title, setTitle] = useState("");
    const [songNum, setSongNum] = useState("");
    const [artist, setArtist] = useState("");

    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = []
    if(store.currentList!==null)
    for(let i  = 0 ; i<store.getPlaylistSize(); i++){
        playlist.push(store.currentList.songs[i].youTubeId);
    }
    // let playlist = [
    //     "mqmxkGjow1A",
    //     "8RbXIMZmVv8",
    //     "8UbNbor3OqQ"
    // ];

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST

    const playerOptions = {
        height: '300',
        width: '500',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[store.playSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        let newCurr = store.playSong;
        newCurr++;
        newCurr = newCurr%playlist.length;
        store.changePlaySong(newCurr);
    }

    function decSong(){
        let currentSong = store.playSong;
        currentSong--;
        if(currentSong<0){
            currentSong = playlist.length-1;
        }
        store.changePlaySong(currentSong);
    }
    function pause(){
        player.pauseVideo();
    }

    function play(){
        player.playVideo();
    }
    function back(){
        decSong();
        loadAndPlayCurrentSong(player); 
    }
    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    function skipSong(){
        console.log(player)
            incSong();
            loadAndPlayCurrentSong(player); 
           }
    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    let player = ''
    function onPlayerStateChange(event) {
        console.log(event)
        let playerStatus = event.data;
        player = event.target;
        setTitle(store.currentList.songs[store.playSong].title);
        setSongNum(store.playSong+1);
        setArtist(store.currentList.songs[store.playSong].artist);
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }
    let playerBox = <div style = {{ height: '300px', width: '500px', backgroundColor: 'gray'}}></div>;
    if(store.currentList!==null && store.getPlaylistSize()>0){
        playerBox = <YouTube
        videoId={playlist[store.playSong]}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange} />
    }
    let plist = '';
    if(store.currentList!==null){
        plist = store.currentList.name;
    }

    return(
        <div>
            {playerBox}
            <div style = {{backgroundColor: '#ffb3b3', height: '200px'}}>
                <div style = {{textAlign : 'center', fontSize: '24px'}}>Now Playing</div>
                <div style = {{marginLeft: '10px', fontSize:'16px'}}>
                    Playlist: {plist}<br/>
                    Song#: {songNum}<br/>
                    Title: {title}<br/>
                    Artist: {artist}<br/>
                </div>
                <br/>
                <br/>
                <div style={{backgroundColor:'white', textAlign: 'center', height: '60px'}}>
                    <Box sx ={{p:1}}>
                        <IconButton
                        onClick ={back}>
                            <FastRewindIcon/>
                        </IconButton>
                        <IconButton onClick ={pause}>
                            <PauseIcon/>
                        </IconButton>
                        <IconButton
                        onClick = {play}>
                            <ArrowRightIcon sx={{fontSize: '32px'}}/>
                        </IconButton>
                         <IconButton onClick ={
                         skipSong}>
                            <FastForwardIcon/>
                        </IconButton>
                    </Box>
                </div>
            </div>
</div>
        
        
        );
}