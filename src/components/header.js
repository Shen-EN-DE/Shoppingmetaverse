import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../pages/routes'
import logo from '../style/images/logo.png'

const Header = () => {
    const { pathname } = useLocation();
    const path = pathname.slice(1)
    return (
        <header>
            <div className="header">
                <Container>
                    <Row>
                        <Col md={3}>
                            <div className="full">
                                <div className="center-desk">
                                    <div className="logo">
                                        <Link to={routes.home}><img id="logo" src={logo} alt="#" /></Link>
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
                                        <li className={`nav-item ${path === routes.home ? "active" : ""}`}>
                                            <Link className="nav-link" to={routes.home}>Home</Link>
                                        </li>
                                        <li className={`nav-item ${path === routes.staking ? "active" : ""}`}>
                                            <Link className="nav-link" to={routes.staking}>Staking</Link>
                                        </li>
                                        <li className={`nav-item ${path === routes.profile ? "active" : ""}`}>
                                            <Link className="nav-link" to={routes.profile}>Profile</Link>
                                        </li>
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