#!/bin/bash
cd ~/aeolus  # project folder of aeolus
./bin/dr enter
cd /code
roslaunch bringup dummy_user.launch
cd -
exit
cd -
