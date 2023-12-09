import React, { useRef, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import {  BrowserRouter as Router } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"
import { Link, useHistory } from "react-router-dom"
import loginimg1 from '../img/1.svg'
import loginimg2 from '../img/2.svg'
import loginimg3 from '../img/3.svg'
import loginimg4 from '../img/4.svg'

function Login() {
    const loginEmailRef = useRef()
    const loginPasswordRef = useRef()
    const registerEmailRef = useRef()
    const registerPasswordRef = useRef()
    const { login,signup } = useAuth()
    const [registererror, setregistererror] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const [registerNow, setRegisterNow] = useState(false)
    function showRegistrationForm()
    {
        setRegisterNow(true)
    }
    async function handleLogin(e) {
        e.preventDefault()
          setError("")
          setLoading(true)
          await login(loginEmailRef.current.value, loginPasswordRef.current.value).then((data)=>{
            console.log(data)
            history.push("/createProfile")
            setLoading(false)
          }).catch((data)=>{
            setError(`Failed to Login . ${data.message}`)
            console.log(data)
            setLoading(false)
          })    
        setLoading(false)
      }

    async function handleRegister(e) {
        e.preventDefault()
        if(registerPasswordRef.current.value.length < 5)
        {
            setError("Password must of 5 characters")
            return;
        }
            setregistererror("")
            setLoading(true)
            await signup(registerEmailRef.current.value, registerPasswordRef.current.value).then((data)=>{
                console.log(data)
                history.push("/createProfile")
                setLoading(false)
              }).catch((data)=>{
                setregistererror(`Failed to create an account .${data.message}`)
                setLoading(false)
              })
            setLoading(false)
    }
    return (
        <Container fluid>
            <Row> 
                <Col lg={7}>
                    <div className="login-container">
                        <Container fluid>
                            <Row>
                                <Col lg={6}>
                                    <div className="login-left-image-container p-2">
                                        <img src={loginimg1} alt="gossip-illustration" />
                                        <img src={loginimg2} alt="gossip-illustration"/> 
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="login-left-image-container">
                                        <img src={loginimg3} alt="gossip-illustration"/>
                                        <img src={loginimg4} alt="gossip-illustration"/>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Col>
                <Col lg={5}>
                    <div className="login-container">
                        <h1 className="login-header">Gossipwith.me</h1>
                        {!registerNow? (<Form className="login-form" onSubmit={handleLogin} >
                        <h1 className="gossip-label">Login Now</h1>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" ref={loginEmailRef} />
                                <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" ref={loginPasswordRef}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Remember Me"  />
                            </Form.Group>
                            <Router>
                            <p className="small-label">Don't have an Account ? <span className="text-1"><Link onClick={showRegistrationForm} >Register Now</Link></span></p>
                            </Router>
                            {error && <div className="login-error">{error}</div>}
                            <Button disabled={loading} variant="primary" type="submit">
                                Login
                            </Button>
                            </Form>) : (<Form className="login-form" onSubmit={handleRegister}>
                            <h1 className="gossip-label">Register Now</h1>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" ref={registerEmailRef}/>
                                <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" ref={registerPasswordRef} />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Remember Me" />
                            </Form.Group>
                            <Router>
                            <p className="small-label">Have an Account ? <span className="text-1"><Link onClick={()=>{setRegisterNow(false)}} >Login Now</Link></span></p>
                            </Router>
                            {registererror && <div className="login-error">{registererror}</div>}
                            <Button disabled={loading} variant="primary" type="submit">
                                Register
                            </Button>
                            </Form>)
                        }
                        
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login
