# Setup to ~/supervisor project 
\$ cp utils_* ~/supervisor/  

# Utils of supervisor
The two following scripts of supervsior is enough for development  
## utils_supervisor_restart.sh
Restart all dockers(frontend, backend, mqtt broker) , and then start mqtt subscriber.  

## utils_supervisor_autopub.sh
The script will automatic send publish mqtt message to Broken, so that browser can see changing of UI.  
Please use Ctrl+C to leave this program. 
The actions in menu is follow supervisor project about how to control MQTT.  
you can extend this script for your owned need to test app easily.    

# ROS Control (optional)
## utils_ros_launch.sh  
Utils of ROS launch . TODO  

## utils_ros_run.sh  
Utils of ROS run
 






