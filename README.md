# material-ui-robot

## Broker
\$ brew services restart mosquitto  
 
## MQTT subscriber 
\$ mqtt sub -t 'jsonrpc_service_req' -h '127.0.0.1' -p 3100 -v  

## MQTT Simulator publisher
\$ cd ./mqtt_utils 
\$ ./utils_supervisor_menupub.sh
