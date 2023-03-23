import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import "./App.css";
const { Configuration, OpenAIApi } = require("openai");

function VoiceRecognitionComponent() {
  const [transcript, setTranscript] = useState("");
  const [repsuestaOpenAI, setRespuestaOpenAI] = useState("");
  const apiKey = "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";
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);
  const model = "gpt-3.5-turbo";
  const messages = [
    {
      role: "user",
      content: transcript,
    },
  ];
  const handleRead = () => {
    const message = new SpeechSynthesisUtterance(repsuestaOpenAI);
    message.voiceURI = "native";
    message.lang = "es-MX";
    message.volume = 1;
    message.rate = 1.1;
    message.pitch = 0.7;
    speechSynthesis.speak(message);
  };

  const call = async () => {
    const completion = await openai.createChatCompletion({
      model,
      messages,
    });
    console.log(completion?.data?.choices[0]?.message?.content);
    setRespuestaOpenAI(completion?.data?.choices[0]?.message?.content);
  };

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "es-LA";
  recognition.onresult = (event) => {
    console.log(event.results[0][0].transcript);
    setTranscript(event.results[0][0].transcript);
  };

  const startListening = () => {
    recognition.start();
  };

  const stopListening = () => {
    recognition.stop();
    call();
  };
  useEffect(() => {
    handleRead();
    console.log(repsuestaOpenAI);
    console.log(transcript);
  }, [repsuestaOpenAI]);

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <div className="border border-3 border-primary"></div>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-uppercase ">GPT</h2>
                  <div className="mb-3">
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Button variant="success" onClick={startListening}>
                          Comenzar a escuchar
                        </Button>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Transcripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          placeholder="Transcripción"
                          value={transcript}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3 align-items-center"
                        controlId="formBasicPassword"
                      >
                        <Button variant="danger" onClick={stopListening}>
                          Dejar de escuchar
                        </Button>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Respuesta</Form.Label>
                        <Form.Control
                          as="textarea"
                          placeholder="Respuesta"
                          value={repsuestaOpenAI}
                          disabled
                        />
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default VoiceRecognitionComponent;
