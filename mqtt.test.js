const mqtt = require('mqtt');
const assert = require('assert');

describe('MQTT Broker Tests', () => {
  const brokerUrl = 'mqtt://localhost:1883'; // Endereço do broker MQTT
  let client;

  before((done) => {
    // Conectar ao broker MQTT antes de rodar os testes
    client = mqtt.connect(brokerUrl);
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      done();
    });

    client.on('error', (err) => {
      console.error('Connection error:', err);
      done(err);
    });
  });

  after((done) => {
    // Desconectar após os testes
    if (client.connected) {
      client.end(() => {
        console.log('Disconnected from MQTT broker');
        done();
      });
    } else {
      done();
    }
  });

  it('should connect to the MQTT broker', () => {
    assert.strictEqual(client.connected, true, 'Client should be connected');
  });

  it('should publish and receive a message', (done) => {
    const topic = 'test/topic';
    const message = 'Hello MQTT';
  
    // Inscrever-se no tópico antes de publicar
    client.subscribe(topic, (err) => {
      if (err) return done(err);
  
      client.on('message', (receivedTopic, receivedMessage) => {
        if (receivedTopic === topic) {
          console.log(`Received message: ${receivedMessage.toString()}`); // Exibe a mensagem no terminal
          assert.strictEqual(receivedMessage.toString(), message, 'Received message should match the published message');
          done();
        }
      });
  
      // Publicar a mensagem no tópico
      client.publish(topic, message, (err) => {
        if (err) return done(err);
      });
    });
  });
  
});
