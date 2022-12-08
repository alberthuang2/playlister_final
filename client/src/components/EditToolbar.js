import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleDeleteList() {
        console.log(store.currentList._id)
        store.markListForDeletion(store.currentList._id);
    }
    function handlePublishList(){
        store.publishList();
        console.log(store.currentList)
    }
    function handleDuplicateList(){
        store.duplicateList();
        console.log(store.currentList)
    }
    let published = store.currentList.published
    let undoRedo = ''
    if(!published){
        undoRedo = 
        <div id = "undo-redo">
            <Button 
                disabled={!store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={!store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            </div>
    }
    return (
        <div>
           {undoRedo}
            <div id = "edit-toolbar">
            {published?"":<Button
                id='publish-button'
                sx = {{
                marginLeft: '2.5px',
                marginRight:'2.5px' ,
                backgroundColor: 'green',
                 '&:hover': { backgroundColor: '#fff', color: 'green',
  }}}
                onClick={handlePublishList}
                variant="contained">
                   Publish
            </Button>}
            <Button 
                // disabled={!store.canClose()}
                id='delete-button'
                sx = {{
                marginLeft: '2.5px',
                marginRight:'2.5px' ,
                backgroundColor: 'red',
                 '&:hover': { backgroundColor: '#fff', color: 'red',
                }}}
                onClick={handleDeleteList}
                variant="contained">
                   Delete
            </Button>
             <Button 
                // disabled={!store.canClose()}
                id='duplicate-button'
                sx = {{
                marginLeft: '2.5px', 
                marginRight:'2.5px' ,
                backgroundColor: 'gray',
                '&:hover': { backgroundColor: '#fff', color: 'gray',
  }}}
                onClick={handleDuplicateList}
                variant="contained">
                   Duplicate
            </Button>
            </div>
        </div>
    )
}

export default EditToolbar;