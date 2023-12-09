import React, { useEffect, useRef, useState } from 'react'
import { Button ,Container, Form } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { db,firebasevalue } from '../firebase'
import illustration from '../img/gossip-ico.png'
import { Helmet } from 'react-helmet'

var CryptoJS = require("crypto-js");

function SendMessage() {
    const messageRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [name, setName] = useState()
    const [userId, setUserId] = useState()
    const [success, setSuccess] = useState()
    const [pageLoading, setPageLoading] = useState(true)
    const [usernameNotFound, setUsernameNotFound] = useState(false)
    const username = useParams().userid

    useEffect(() => {
        
        setUsernameNotFound(false)
        console.log(username)
        db.collection("users").where("username" , "==",username).get().then((querySnapshot) => {
            if(!querySnapshot.empty)
             {
                setPageLoading(false)
                querySnapshot.forEach((doc)=>{
                    setUserId(doc.data().userid)
                    setName(doc.data().fullname)
                })
             }else
             {
                 
                console.log(querySnapshot)
                setPageLoading(true)
                setUsernameNotFound(true)
             }
            })
    }, [username])

    function sendMessage(e)
    {
        e.preventDefault()
        setLoading(true)
        const ciphertext = CryptoJS.AES.encrypt(messageRef.current.value, userId).toString();

        if(messageRef.current.value.length>0)
        {
            setSuccess(false)
            db.collection("users").doc(userId).update({
                messages: firebasevalue.arrayUnion(ciphertext)
            }).then(()=>{
                messageRef.current.value=""
                setLoading(false)
                setSuccess(true)
            }).catch(()=>{
                setLoading(false)
                setError("Error sending gossip .")
            })
        }else
        {
            setLoading(false)
            setError("Please write some gossip . Currently it is blank as my heart :)")
        }
    }
    return (
        <>
        {!pageLoading && <Container fluid>
            <Helmet>
                <title>{`Send Gossip to ${name}`}</title>
            </Helmet>

            {success && (<div className="success-message show">Your Gossip send successfully . Create your own gossip url <u><Link to="/">here</Link></u> </div>)}
           <div className="tell-gossip-container">
                <img src={illustration} alt="gossip-illustration"/>
                <h1 className="gossip-label">Hey {name} do you know ?</h1>
                <Form className="gossip-form" onSubmit={sendMessage}>
                   <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows={5} ref={messageRef} placeholder="Write down your gossip" />
                    </Form.Group>
                    <Form.Text className="text-muted mb-2">
                        All your messages are anonymous :) 
                    </Form.Text>
                    <Button disabled={loading} variant="primary"  type="submit">
                        Send Gossip
                    </Button>
                    {error && <div className="login-error">{error}</div>}
                </Form>
           </div>
        </Container>}
        {usernameNotFound && (
        <div className="user-not-found">
            <img src={illustration} alt="gossip-illustration"/>
            <p>User Not Found </p>
            <div className="success-message show">Gossip username not found . Create your own gossip url <u><Link to="/">here</Link></u> </div>
        </div>)}
        </>
    )
}

export default SendMessage
