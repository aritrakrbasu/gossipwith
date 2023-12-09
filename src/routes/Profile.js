import { faFacebookF, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'


function Profile() {
    const EmailRef = useRef()
    const nameRef = useRef()
    const usernameRef = useRef()
    const { updateEmail,currentUser } = useAuth()
    const [username, setUsername] = useState()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        var uid = currentUser.uid 
        setEmail(currentUser.email)
        var unsubscribe =db.collection("users").doc(uid).onSnapshot((doc) => {
            if(doc.exists)
            {
                setUsername(doc.data().username)
                setName(doc.data().fullname)
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
    async function handleUpdate(e)
    {
        e.preventDefault();
        setLoading(true)
        setError(false)
        if(email !== EmailRef.current.value)
        {
            await updateEmail(EmailRef.current.value).then(()=>{
                setSuccess(true)
            })
        }
        if(username!== usernameRef.current.value)
        {
            db.collection("users").where("username" , "==",usernameRef.current.value).get().then((querySnapshot) => {
                console.log(querySnapshot)
                if(querySnapshot.empty)
                 {
                     db.collection("users").doc(currentUser.uid).update({
                        fullname:nameRef.current.value,
                        username:usernameRef.current.value
                    }).then(() => {
                        setSuccess(true)
                         setLoading(false)
                     })
                     .catch((error) => {
                         console.error("Error writing document: ", error);
                     });
                 }else
                 {
                     setError(true)
                     setLoading(false)
                 }
             })
        }else
        {
            db.collection("users").doc(currentUser.uid).update({
                fullname:nameRef.current.value,
            }).then(() => {
                setSuccess(true)
                setTimeout(function () {
                    setSuccess(false) 
                }, 5000);
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
    }

    return (
        <Container fluid>
            {success && (<div className={success?("success-message show"):("success-message")}>Your Gossip details updated Successfully </div>)}
            <Row>
            <Col lg={1}>
                <Sidebar />
            </Col>
            <Col lg={10}>
               <div className="profile-holder">
                   <Form className="login-form profile-form" onSubmit={handleUpdate}>
                        <Form.Group controlId="fullname" className="my-5 ">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Full Name" defaultValue={name} ref={nameRef}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail" className="my-5">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" defaultValue={email} ref={EmailRef}/>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="username" className="my-5">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Create gossip username" defaultValue={username} ref={usernameRef}/>
                        </Form.Group>
                        {error && <div className="show-error">Username is not available :(</div>}
                        <Button disabled={loading} variant="primary" type="submit">
                            Update Now
                        </Button>
                   </Form>
                    <div className="bg-1 my-4 p-4">
                        <h1 className="header-small">your gossip address :</h1>
                        <h2 className="header-link"><a href={`https://gossipwith.me/#/${username}`} rel="noreferrer" target="_blank">{`https://gossipwith.me/#/${username}`}</a></h2>

                        <Button variant="light" className="theme-btn" onClick={copyUrl}>Share Now</Button>
                        <a href={`http://twitter.com/share?text=Do you know a gossip ? so what are you waiting for... send your gossips to  ${name}&url=https://gossipwith.me/#/${username}&hashtags=anonymous message,gossipwithme`} rel="noreferrer" target="_blank" className="btn theme-btn ml-2" ><FontAwesomeIcon icon={faTwitter}/></a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=https://gossipwith.me/#/${username}`} rel="noreferrer" target="_blank" className="btn theme-btn ml-2"><FontAwesomeIcon icon={faFacebookF}/></a>
                        <a href={`https://api.whatsapp.com/send?text=Hello%20people%20%F0%9F%A5%BA%F0%9F%A5%BA%20...%20Do%20you%20have%20some%20gossips%20%3F%3F%3F%20Share%20with%20me%20right%20now%20%0A%0A%23gossip_with_me%20%0A%0Ahttps%3A%2F%2Fgossipwith.me%2F%23%2F${username}`} rel="noreferrer" target="_blank" className="btn theme-btn ml-2"><FontAwesomeIcon icon={faWhatsapp}/></a>
                    </div>
               </div>
            </Col>
            </Row>
      </Container>
    )
}

export default Profile
