import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { routes } from '../pages/routes'

const Header = () => {
    return (
        <header>
            <div className="header">
                <Container>
                    <Row>
                        <Col md={3}>
                            <div className="full">
                                <div className="center-desk">
                                    <div className="logo">
                                        <a href="index.html"><img src="images/logo.png" alt="#" /></a>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={9}>
                            <nav className="navigation navbar navbar-expand-md navbar-dark">
                                <button className="navbar-toggler" type="button">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarsExample04">
                                    <ul className="navbar-nav mr-auto">
                                        <li className="nav-item active">
                                            <Link className="nav-link" to={routes.home}>Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to={routes.lending}>Lending</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to={routes.profile}>Profile</Link>
                                        </li>
                                        {/* <li className="nav-item">
                                            <a className="nav-link" href="#contact">Contact</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Sign Up</a>
                                        </li> */}
                                    </ul>
                                </div>
                            </nav>
                        </Col>
                    </Row>
                </Container>
            </div>
        </header >
    )
}

export default Header