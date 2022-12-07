import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import SongCards from './SongCards'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AuthContext from '../auth';

import EditToolbar from './EditToolbar';
import { ListItemText } from '@mui/material';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        event.stopPropagation()
        if(!open){
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);}
        }
        else
            store.closeCurrentList();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleLike(event, id){
        event.stopPropagation();
        store.like(id,true);
    }
    
    function handleDislike(event, id){
        event.stopPropagation();
        store.like(id,false);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            if(idNamePair.name !== text && text!=="")
                store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleAddNewSong(){
        store.addNewSong();
       store.getPlaylists();
    }

    let songCards = ''
    let open = store.currentList!==null && store.currentList._id===idNamePair._id;
    let liked = idNamePair.likes.indexOf(auth.user.username) > -1;
    let disliked = idNamePair.dislikes.indexOf(auth.user.username) > -1;
    let likeStyle = {fontSize: '24pt'};
    if(liked){
        likeStyle ={fontSize: '24pt', color: 'blue'};
    }
    let dislikeStyle = {fontSize: '24pt'};
    if(disliked){
        dislikeStyle = {fontSize: '24pt', color: 'red'};
    }
    if(open){
        songCards = 
        <div>
        <SongCards/>
    {    idNamePair.published ? "":<div style = {{display: "flex",
            alignItems: "center",
            justifyContent: "center"}} >
            <Button
            disabled={!store.canAddNewSong()}
            id='add-song-button'
            onClick={handleAddNewSong}
            variant="contained">
            <AddIcon /> Add Song
        </Button>
            </div>}
        <EditToolbar/>
        </div>
    }
    let likes = "";
    let publishDate = "";
    let listens = "";
    if(idNamePair.published){
        likes = 
         <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                         handleLike(event, idNamePair._id)
                    }}>
                        <ThumbUpIcon style={likeStyle} /> <div style = {{fontSize:'32px'}}>{idNamePair.likes.length}</div>
                </IconButton>
                <IconButton onClick={(event) => {
                         handleDislike(event, idNamePair._id)
                    }}>
                <ThumbDownIcon style={dislikeStyle} /> <div style = {{fontSize:'32px'}}>&nbsp; {idNamePair.dislikes.length}</div>
                </IconButton>
            </Box>
        publishDate =  "Publish Date: " + idNamePair.publishDate;
        listens =
        <div style = {{fontSize: '14pt', marginLeft: '50px',   fontFamily: 'Arial', color: "gray"}}>Listens: {idNamePair.views}</div>
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1}}
            style={{ width: '100%', fontSize: '48pt'}}
            button
        >
            <ListItemText
                        onDoubleClick={handleToggleEdit}

            primary = {idNamePair.name}
            secondary =  {<span>Created by: {idNamePair.ownerUsername} <br/> {publishDate}</span>}
            primaryTypographyProps={{fontSize: '30px'}}
            secondaryTypographyProps={{fontSize: '18px',  whiteSpace: "normal"}} ></ListItemText>
            <Box sx={{ p: 1 }}>
            {likes}
            {listens}
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                         handleLoadList(event, idNamePair._id)
                    }} aria-label='delete'>
                        { !open ?  
                        <KeyboardDoubleArrowDownIcon style={{fontSize:'40pt'}} /> :
                    <KeyboardDoubleArrowUpIcon style={{fontSize:'40pt'}} />}
                </IconButton>
            </Box>
        </ListItem> 
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        <div id = "songCards">
       { cardElement}
       {/* {songCards} */}
        <Box sx={{ p: 1, flexGrow: 1 }}>{songCards}</Box>
        </div>
    );
}

export default ListCard;