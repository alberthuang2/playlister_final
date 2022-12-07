import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import AppBanner from './AppBanner'
import Statusbar from './Statusbar'
import SubBanner from './SubBanner'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{top: '50px', bgcolor: 'background.paper' }}>
            {
             
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <div>
        <AppBanner/>
        <SubBanner/>
        {/* <div id="playlist-selector"> */}
            {/* <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div> */}
            <div id="list-selector-list">
                {
                    listCard
                }
                <Statusbar/>
                <MUIDeleteModal />
            {/* </div> */}
        </div>
        </div>
        )
}

export default HomeScreen;