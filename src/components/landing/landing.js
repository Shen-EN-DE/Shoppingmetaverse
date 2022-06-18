import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useConnect } from 'wagmi'
import Hero from '../../style/images/img.png'


const Landing = () => {
    const [
        {
            data: { connector, connectors },
            error,
            loading,
        },
        connect,
    ] = useConnect()
    console.log(connectors)
    return (
        <section className='banner_main'>
            <Container>
                <Row>
                    <Col md={5}>
                        <div className='text-bg'>
                            <h1>The points pawn shop</h1>
                            <span>sub title</span>
                            <p>1232432</p>
                            <Row>
                                <Col>
                                    {connectors.map((x, i) => (
                                        <a disabled={!x.ready} key={`${x.name}-${i}`} onClick={() => connect(x)}>
                                            {x.name}
                                            {!x.ready && ' (unsupported)'}
                                            {loading && x.name === connector?.name && '…'}
                                        </a>
                                    ))}
                                </Col>
                                {/* <Col>
                                    {activeConnector && (
                                        <a onClick={() => disconnect()}>
                                            Disconnect from {activeConnector.name}
                                        </a>
                                    )}
                                </Col> */}
                            </Row>
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