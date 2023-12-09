import { faFacebookF, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faSadTear, faShare, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React,{useEffect, useState} from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { db,firebasevalue } from '../firebase'
import textToImage from 'text-to-image'
var CryptoJS = require("crypto-js");
var http = require('http');
// const textToImage = require('text-to-image');
function ShowMessages() {
    const [noMessages, setNoMessages] = useState(false)
    const [messages, setMessages] = useState([])
    const [username, setUsername] = useState()
    const [name, setName] = useState()
    const { currentUser } = useAuth()
    const history = useHistory()

    useEffect(() => {
        var uid = currentUser.uid 
        var unsubscribe =db.collection("users").doc(uid).onSnapshot((doc) => {
            if(doc.exists)
            {
                setUsername(doc.data().username)
                setName(doc.data().fullname)
                var messages = doc.data().messages
                if(typeof doc.data().messages == 'undefined' )
                {
                    setNoMessages(true)
                }else
                {
                    setMessages(messages.reverse())
                    setNoMessages(false)
                }
            }else
            {
                history.push("/createProfile")
            }
        });
        return unsubscribe
    }, [currentUser.uid])

    function copyUrl()
    {
        if (navigator.share) {
            navigator.share({
              title: `Let's start gossiping with ${name}`,
              text: `Do you know a gossip ? so what are you waiting for... send your gossips to  ${name}`,
              url: `https://gossipwith.me/#/${username}`,
            })
              .then(() => console.log('Successful share'))
              .catch((error) => console.log('Error sharing', error));
          }
    }

    function deleteMessage(value)
    {
        db.collection("users").doc(currentUser.uid).update({
            "messages": firebasevalue.arrayRemove(value)
        });
    }

    function shareMessage(value) 
    {
        value = CryptoJS.AES.decrypt(value,currentUser.uid).toString(CryptoJS.enc.Utf8)
        value =`https://gossipwith.me/#/${username} \n\n Gossip : \n${value}`
        textToImage.generate(value,{
            bgColor:"#798ef3",
            textColor:"#fff"
        }).then((dataURI)=>{
            var blob = dataURItoBlob(dataURI);
            const file = new File([blob], 'gossip-with-me-message.jpg', { type: blob.type }); 
            if (navigator.canShare && navigator.canShare(file)) {
                        navigator.share({
                            files: [file],
                          })
                    } 
            });
    }
        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);
        
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        
            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
        
            return new Blob([ia], {type:mimeString});
        }

    return (
        <>
        <div className="bg-1 my-4 p-4">
            <h1 className="header-small">your gossip address :</h1>
            <h2 className="header-link"><a href={`https://gossipwith.me/#/${username}`} rel="noreferrer" target="_blank">{`https://gossipwith.me/#/${username}`}</a></h2>
            <Button variant="light" className="theme-btn" onClick={copyUrl}>Share Now</Button>
            <a href={`http://twitter.com/share?text=Do you know a gossip ? so what are you waiting for... send your gossips to  ${name}&url=https://gossipwith.me/#/${username}&hashtags=anonymous message,gossipwithme`} target="_blank" rel="noreferrer" className="btn theme-btn ml-2"><FontAwesomeIcon icon={faTwitter}/></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://gossipwith.me/#/${username}`} target="_blank" rel="noreferrer" className="btn theme-btn ml-2"><FontAwesomeIcon icon={faFacebookF}/></a>
            <a href={`https://api.whatsapp.com/send?text=Hello%20people%20%F0%9F%A5%BA%F0%9F%A5%BA%20...%20Do%20you%20have%20some%20gossips%20%3F%3F%3F%20Share%20with%20me%20right%20now%20%0A%0A%23gossip_with_me%20%0A%0Ahttps%3A%2F%2Fgossipwith.me%2F%23%2F${username}`} rel="noreferrer" target="_blank" className="btn theme-btn ml-2"><FontAwesomeIcon icon={faWhatsapp}/></a>
        </div>
        <h1 className="header-small">your gossips</h1>
        <div className="messages">
            <ul className="messages-list">
            {messages.length > 0 && messages.map((message,key)=>{
                return(
                <li key={key}>
                    {CryptoJS.AES.decrypt(message,currentUser.uid).toString(CryptoJS.enc.Utf8)}
                        <ul className="action-icon-list">
                            <Button onClick={()=>{shareMessage(message)}}><FontAwesomeIcon icon={faShare} /></Button>
                            <Button onClick={()=>{deleteMessage(message)}}><FontAwesomeIcon icon={faTrashAlt} /></Button>
                        </ul>
                </li>)
            })}
            </ul>
        </div>
        {noMessages && (<div className="no-message">No Gossip yet <span><FontAwesomeIcon icon={faSadTear} /></span></div>)}
        </>
    )
}

export default ShowMessages
