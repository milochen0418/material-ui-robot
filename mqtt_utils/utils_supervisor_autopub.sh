#!/bin/bash
BROKER_HOST=127.0.0.1
PORT=3100

echo "publish MQTT message to MQTT broker in every second"
while true; do
mqtt pub -t 'healthStatus' -h "$BROKER_HOST" -p $PORT -m '{"robot_name":"C-3PO","limit_finding": "not_run_yet", "manual_control": "yes", "power_on_self_test": "ok", "emergency_stop": false}'
sleep 1
mqtt pub -t 'healthStatus' -h "$BROKER_HOST" -p $PORT -m '{"robot_name":"C-3PO","limit_finding": "not_run_yet", "manual_control": "no", "power_on_self_test": "ok", "emergency_stop": false}'
sleep 1 
done
