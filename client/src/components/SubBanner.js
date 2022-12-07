import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HouseIcon from '@mui/icons-material/House';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';

export default function AppBanner() {
    const { store } = useContext(GlobalStoreContext);

    // let editToolbar = "";
    // let menu = loggedOutMenu;
    // if (auth.loggedIn) {
    //     menu = loggedInMenu;
    // }
    
    // function getAccountMenu(loggedIn) {
    //     let userInitials = auth.getUserInitials();
    //     console.log("userInitials: " + userInitials);
    //     if (loggedIn) 
    //         return <div>{userInitials}</div>;
    //     else
    //         return <AccountCircle />;
    // }
    function handleClick(event, searchBy) {
        // DOUBLE CLICK IS FOR SONG EDITING
        store.changeSearchBy(searchBy)
    }
    function handleSearch(){

    }

    let buttonStyle = {fontSize: 30};
    let houseStyle = buttonStyle;
    let groupStyle = buttonStyle;
    let personStyle = buttonStyle;
    if(store.searchBy === "HOME")
        houseStyle =  {fontSize: 30, color: "red"};
    else if(store.searchBy === "ALL")
        groupStyle =  {fontSize: 30, color: "red"};
    else if(store.searchBy === "USER")
        personStyle =  {fontSize: 30, color: "red"};
    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar position="static"  elevation={0} sx = {{backgroundColor: "white" }}>
                <Toolbar>
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
                {/* <Typography                        
                    variant="h4"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}                        
                >
                    <Link to = '/'><img id = "mini-logo" src = "../playlister_logo.png"></img></Link>    
                </Typography>
                <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        { getAccountMenu(auth.loggedIn) }
                    </IconButton>
                </Box> */}
                <TextField 
                sx = {{marginLeft : '50px', width: '35ch'}}
                label = "Search"
                onRequestSearch = {handleSearch}
                focus = {true}/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}