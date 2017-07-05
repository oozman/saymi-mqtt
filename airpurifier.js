// Load env variables.
require('dotenv').config({path: './config/airpurifier.env'});
const Mqtt = require('mqtt');

// Instantiate MQTT.
const mqtt = Mqtt.connect('mqtt://' + process.env.MQTT_HOST + ':' + process.env.MQTT_PORT, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
});

// Instantiate Air Purifier.
const AirPurifier = require('./lib/airpurifier_mqtt');
const airpurifier = new AirPurifier(mqtt, process.env);

// Start running.
airpurifier.run();
