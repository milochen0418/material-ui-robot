#!/bin/bash
#docker-compose stop -d cfssl
#docker-compose stop -d nginx
#docker-compose up -d cfssl
#docker-compose up -d nginx
echo "If there is no suitable docker images, please refering the README.md to setup first."
docker-compose stop
docker-compose start
echo "Start to subscribe MQTT message"
echo "You can run ./utils_supervisor_autopub.sh to automaticlly publish message, so that this subscriber can get message."
mqtt sub -t 'jsonrpc_service_req' -h '127.0.0.1' -p 3100 -v
