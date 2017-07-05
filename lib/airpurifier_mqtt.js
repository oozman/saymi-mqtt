/**
 * Air Purifier MQTT class.
 */
class AirPurifierMQTT {

    /**
     * The constructor.
     *
     * @param mqtt
     * @param env
     */
    constructor(mqtt, env) {

        const AirPurifer = require('../node_modules/saymi/lib/airpurifier');

        this.mqtt = mqtt;
        this.env = env;
        this.helper = require('./helper');
        this._ = require('lodash');

        this.airpurifier = new AirPurifer(this.env.DEVICE_IP, this.env.DEVICE_TOKEN);

        // Generate MQTT topic.
        this.topicStat = this.helper.generateTopic(this.env.MQTT_TOPIC_PREFIX, this.env.DEVICE_ID, this.env.MQTT_TOPIC_STAT);
        this.topicTele = this.helper.generateTopic(this.env.MQTT_TOPIC_PREFIX, this.env.DEVICE_ID, this.env.MQTT_TOPIC_TELE);
        this.topicSetPower = this.helper.generateTopic(this.env.MQTT_TOPIC_PREFIX, this.env.DEVICE_ID, this.env.MQTT_TOPIC_SETPOWER);
        this.topicGetData = this.helper.generateTopic(this.env.MQTT_TOPIC_PREFIX, this.env.DEVICE_ID, this.env.MQTT_TOPIC_GETDATA);
        this.topicSetMode = this.helper.generateTopic(this.env.MQTT_TOPIC_PREFIX, this.env.DEVICE_ID, this.env.MQTT_TOPIC_SETMODE);
        this.topicGetModes = this.helper.generateTopic(this.env.MQTT_TOPIC_PREFIX, this.env.DEVICE_ID, this.env.MQTT_TOPIC_GETMODES);

    }

    /**
     * Run.
     */
    run() {

        console.log('Connecting to MQTT...');

        this.mqtt.on('connect', () => {

            console.log('Air Purifier has been connected to MQTT.');

            this.subscribeToTopics();

        });

        this.mqtt.on('message', (topic, message) => {

            this.processPayload(topic, message);

        });

        this.mqtt.on('error', () => {

            throw(new Error('[Air Purifier] Something is wrong. MQTT Error.'));

        });

    }

    /**
     * Subscribe to topics.
     */
    subscribeToTopics() {

        //this.mqtt.subscribe(this.topicStat);
        //this.mqtt.subscribe(this.topicTele);
        this.mqtt.subscribe(this.topicGetData);
        this.mqtt.subscribe(this.topicSetPower);
        this.mqtt.subscribe(this.topicSetMode);
        this.mqtt.subscribe(this.topicGetModes);

        console.log('Subscribed to topics.');

        this.refreshData();

    }

    /**
     * Process payload.
     *
     * @param topic
     * @param payload
     */
    processPayload(topic, payload) {

        if (this._.isEqual(topic, this.topicSetPower)) { // Set device power.

            this.setPower(payload);

        } else if (this._.isEqual(topic, this.topicGetData)) {

            this.refreshData();

        } else if (this._.isEqual(topic, this.topicSetMode)) {

            this.setMode(payload);

        } else if (this._.isEqual(topic, this.topicGetModes)) {

            this.getModes();

        }

    }

    /**
     * Set device power.
     *
     * @param payload
     */
    setPower(payload) {

        payload = this._.trim(payload.toString());

        const action = this._.isEqual(this._.toLower(payload), 'on') ? 'on' : 'off';

        this.airpurifier.setPower(action).then(data => {

            this.mqtt.publish(this.topicTele, JSON.stringify({
                power_status: data.status
            }), {qos: this.env.MQTT_QOS});

            this.refreshData();

        }, error => {

            this.sendError(error.message);
            console.log(error.message);

        })

    }

    /**
     * Set device mode.
     *
     * @param payload
     */
    setMode(payload) {

        const mode = this._.trim(payload.toString());

        this.airpurifier.setMode(mode).then(data => {

            this.mqtt.publish(this.topicTele, JSON.stringify(data));

            this.refreshData();

        }, error => {

            this.sendError(error.message);
            console.log(error.message);

        })

    }

    /**
     * Get device modes.
     */
    getModes() {

        this.airpurifier.getModes().then(data => {

            this.mqtt.publish(this.topicTele, JSON.stringify({modes: data}));

            this.refreshData();

        }, error => {

            this.sendError(error.message);
            console.log(error.message);

        })

    }

    /**
     * Get device data.
     *
     * @param message
     */
    getData() {

        this.airpurifier.getData().then(data => {

            // Only send MQTT data if data is complete.
            if (this._.get(data, 'temperature', false)) {

                this.mqtt.publish(this.topicStat, JSON.stringify(data));

            }

        }, error => {

            this.sendError(error.message);
            console.log(error.message);

        })

    }

    /**
     * Refresh device data.
     */
    refreshData() {

        setTimeout(() => this.getData(), 2000);

    }

    /**
     * Send error message.
     *
     * @param message
     */
    sendError(message) {

        this.mqtt.publish(this.topicTele, JSON.stringify({error: message}));

    }
}

module.exports = AirPurifierMQTT;