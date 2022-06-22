import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { routes } from '../../pages/routes'
import Hero from '../../style/images/img.png'
import bg from '../../style/images/test.png'


const Landing = () => {

    return (
        <section className='banner_main'>
            <Container>
                <Row>
                    <Col md={5}>
                        <div className='text-bg'>
                            <h1>Shopbank</h1>
                            <span>未來電商 3.0</span>
                            <p>價值轉移、代幣借貸、永續成就、DAO投票</p>
                            <Link to={routes.staking}>開始體驗</Link>

                        </div>
                        <span>Awesome</span>

                    </Col>
                    <Col md={7}>
                        <div className='text-img'>
                            <figure>
                                <img src={Hero} />
                            </figure>
                        </div>
                    </Col>
                </Row>
            </Container>

        </section>
    )
}


export default Landing