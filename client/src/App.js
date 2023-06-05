import {useState} from "react";

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function App() {

  const [cities, setCities]=useState([]);

  const [weather, setWeather]=useState(null);

  const [loading, setLoading]=useState(false);

  const submitHandler=async(event)=>{

    event.preventDefault();

    setWeather(null);

    setLoading(true);

    const c=event.target.tarea.value.trim().split("\n").map((city)=>city.toLowerCase());

    setCities([...new Set(c)]);

    const response=await fetch("/getWeather",{
      method: "POST",
      headers:{
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          cities: c
      }),
    }).then(res=>res.json());

    setLoading(false);

    setWeather(response.weather);
  };


  return (
    <Container>
      <h2 style={{textAlign:"center", margin:"4%"}}>Weather API</h2>
      <Row>
        <Col md={5}>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="source">
              <Form.Label><b>Enter city names 1 in each line :</b></Form.Label>
              <textarea id="tarea" rows="5" style={{width:"100%", border:"2px solid black"}} required/>
            </Form.Group>
            <div className="text-center mb-5">
              <Button variant="primary" type="submit">
                Check Weather
              </Button>
            </div>
          </Form>
        </Col>
        <Col />
        <Col md={6}>
          <Form.Label>
            <b>
            Weather data will be displayed below.
            </b>
          </Form.Label>
          <div style={{
            height:"100%", 
            overflow:"scroll", 
            overflowX:"hidden", 
            border:"2px solid black"}}>
            {loading && <b style={{padding:"10px"}}>Loading data...</b>}
            {weather && cities.map((city)=>(
              <b style={{padding:"10px"}}>
                {city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} : {weather[city]==='City not found'?weather[city]:weather[city] + ' C'}<br />
              </b>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
