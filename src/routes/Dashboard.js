import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ShowMessages from '../components/ShowMessages'
import Sidebar from '../components/Sidebar'

function Dashboard() {
    return (
      <Container fluid>
        <Row>
          <Col lg={1}>
            <Sidebar />
          </Col>
          <Col lg={10}>
            <ShowMessages />
          </Col>
        </Row>
      </Container>
        
    )
}

export default Dashboard
