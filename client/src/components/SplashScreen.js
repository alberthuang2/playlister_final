import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <div id = "ss-welcome"><b>Welcome to</b></div>
            <img id = "logo" src = "../playlister_logo.png"></img>     
            <div id = "ss-desc"> <em>Easily create and share playlists!</em></div>
            <Link to='/login/'><Button sx={{ backgroundColor: "#4d4dff", color:"white", marginTop: "30px", marginBottom:"20px"}} >Login</Button></Link>
            <Link to='/register/'><Button sx={{ backgroundColor: "#66b3ff", color:"white", marginLeft: "10px" , marginTop: "30px", marginBottom:"20px"}}>Sign Up</Button></Link>
            <Button sx={{ backgroundColor: "green", color:"white" , marginLeft: "10px", marginTop: "30px", marginBottom:"20px"}}>Continue as Guest</Button>
            <h3>Created by Albert Huang</h3>
            </div>
 )
}