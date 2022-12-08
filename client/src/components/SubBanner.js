import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HouseIcon from '@mui/icons-material/House';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';

export default function AppBanner() {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");
    const [sortBy, setSortBy] = useState("AZ");

    function handleClick(event, searchBy) {
        // DOUBLE CLICK IS FOR SONG EDITING
        setText("");
        setSortBy("AZ")
        store.changeSearchBy(searchBy);
    }

    function handleUpdateText(event) {
            setText(event.target.value);
        }

    function handleSearch(event){
        if (event.code === "Enter") {
            console.log(text);
            store.search(text);
    }
}
    function handleChange(event){
        console.log(event);
        setSortBy(event.target.value);
        console.log(event.target.value);
        store.changeSort(event.target.value);
    }

    let buttonStyle = {fontSize: 30};
    let houseStyle = buttonStyle;
    let groupStyle = buttonStyle;
    let personStyle = buttonStyle;
    let sortlist = ''
    if(store.searchBy === "HOME"){
        sortlist = 
         <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                sx = {{marginLeft: '10px'}}
                value={sortBy}
                onChange={handleChange}
                >
                <MenuItem value={'AZ'}>Name (A-Z)</MenuItem>
                <MenuItem value={'CREATE'}>Create Date (Old-New)</MenuItem>
                <MenuItem value={'EDIT'}>Edit Date (New-Old)</MenuItem>
                </Select>
                    
    }else{
        sortlist = 
         <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                sx = {{marginLeft: '10px'}}
                value={sortBy}
                onChange={handleChange}
                >
                <MenuItem value={'AZ'}>Name (A-Z)</MenuItem>
                <MenuItem value={'PUBLISH'}>Publish Date (New-Old)</MenuItem>
                <MenuItem value={'LISTENS'}>Listens (High-Low)</MenuItem>
                <MenuItem value={'LIKES'}>Likes (High-Low)</MenuItem>
                <MenuItem value={'DISLIKES'}>Dislikes (High-Low)</MenuItem>

                </Select>
    }
    if(store.searchBy === "HOME")
        houseStyle =  {fontSize: 30, color: "red"};
    else if(store.searchBy === "ALL")
        groupStyle =  {fontSize: 30, color: "red"};
    else if(store.searchBy === "USER")
        personStyle =  {fontSize: 30, color: "red"};
    return (
        <Box >{/*sx={{ flexGrow: 1}}*/}
            <AppBar position="static"  elevation={0} sx = {{backgroundColor: "white" }}>
                <Toolbar>
                    <Box sx ={{p:1}}>
                    <IconButton 
                    onClick={(event) => {
                         handleClick(event, "HOME")
                    }}>
                        <HouseIcon sx = {houseStyle}/>
                    </IconButton>
                     <IconButton onClick={(event) => {
                         handleClick(event, "ALL")
                    }}>
                        <GroupIcon sx = {groupStyle}/>
                    </IconButton>
                     <IconButton onClick={(event) => {
                         handleClick(event, "USER")
                    }}>
                        <PersonIcon sx = {personStyle}/>
                    </IconButton>
              </Box>
                <TextField 
                sx = {{marginLeft : '50px', width: '35ch'}}
                label = "Search"
                onKeyDown={handleSearch}
                onChange = {handleUpdateText}
                value = {text}
                />
                <Box sx={{ flexGrow: 1 }}></Box> 
                <div style = {{color: 'black'}}>Sort By </div>
                {sortlist}
                    
                </Toolbar>
            </AppBar>
        </Box>
    );
}