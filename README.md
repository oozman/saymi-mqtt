# saymi-mqtt
An MQTT interface for your Mi Home Devices.

## Installation
Before installing make sure you have nodejs 6.6+ and npm 4+ installed already.

* Clone this repository.
* Install dependencies: `npm install`
* Rename `confg/airpurifier.env.example` to `config/airpurifier.env`
* Edit your `config/airpurifier.env` file and replace all the necessary information. Like MQTT credentials, etc.
* Install [PM2](http://pm2.keymetrics.io): `npm install -g pm2`
* Finally run: `pm2 start process.json`


## Documentation

Currently working on it... 


## Available Devices

<table>
  <thead></thead>
  <tbody>
    <td>Mi Air Purifier 1, 2 and Pro</td>
    <td><img src="https://firebasestorage.googleapis.com/v0/b/saymi-9b0bd.appspot.com/o/airpurifier.jpg?alt=media&token=16e22ec7-3cc0-450b-b9b3-aa322c53bbd1" alt="Air Purifier" width="200"/></td>
  </tbody>
</table>

*More devices will be added soon...*
