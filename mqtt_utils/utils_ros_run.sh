#!/bin/bash
cd ~/aeolus  # project folder of aeolus
./bin/dr enter
cd /code
RUN_USERINFRA=true rosrun bringup robot.sh 
cd -
exit
cd -
