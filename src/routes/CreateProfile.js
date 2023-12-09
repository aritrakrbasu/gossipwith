import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import illustration from '../img/6.png'
import {db} from '../firebase'
import { useAuth } from "../context/AuthContext"
import { useHistory } from 'react-router-dom'

function CreateProfile() {
    const usernameRef = useRef()
    const fullnameRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [username, setUsernameRef] = useState(false)
    const [fullName, setFullName] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const history = useHistory()
    const { currentUser } = useAuth()
    function createUsername(e)
    {
        e.preventDefault()
        setError(false)
        setLoading(true)
        var uid = currentUser.uid
        db.collection("users").where("username" , "==",username).get().then((querySnapshot) => {
           if(querySnapshot.empty)
            {
                db.collection("users").doc(uid).set({
                userid:uid,
                fullname:fullName,
                username:username,
                }).then(() => {
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
        
    }
    function updateUsername()
    {
        setUsernameRef(usernameRef.current.value)
    }
    function updateFullName()
    {
        setFullName(fullnameRef.current.value)
    }

    useEffect(() => {
        console.log(currentUser)
        db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
          if(doc.exists)
          {
            history.push("/dashboard")
          }else
          {
              setPageLoading(false)
          } 
        })
        
    }, [currentUser.uid])
    return (
        <>
        {!pageLoading && (
            <Container fluid>
            <Row>
                <Col lg={4} className="left-mockup-holder login-container">
                    <img src={illustration}  alt="gossip-illustration" className="img-fluid"/>
                </Col>
                <Col lg={8} className="p-5 login-container">
                    <div className="show-link px-4">
                    <h1 className="header-small">your gossip address :</h1>
                        https://gossipwith.me/#/{username}
                    </div>
                    <Form  className="login-form create-profile" onSubmit={createUsername}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" placeholder="Your name" onChange={updateFullName} ref={fullnameRef} required/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="create a username" onChange={updateUsername} ref={usernameRef} required/>
                            </Form.Group>
                            {error && <div className="show-error">Username is not available :(</div>}
                            <Button disabled={loading} variant="primary" type="submit">
                                Let's Gossip
                            </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        )}
        </>
    )
}

export default CreateProfile
