import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext); 
    const history = useHistory();
    function handleCreateNewList() {
        store.createNewList();
        // store.loadIdNamePairs();
        // history.push('/')
    }
    let addButton = '';
    if(store.searchBy === "HOME"){
        addButton = 
        <div id="playlister-statusbar">
           <Button
                id='add-song-button'
                onClick={handleCreateNewList}
                variant="contained">
                <AddIcon /> Your Playlists
            </Button>
        </div>
    }    

    return (
        <div>        {addButton}
</div>
    );
}

export default Statusbar;