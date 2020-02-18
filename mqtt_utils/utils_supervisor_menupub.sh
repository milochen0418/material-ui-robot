#!/bin/bash

# MQTT configuration
BROKER_HOST=127.0.0.1
PORT=3100

# what machine 
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac
echo ${machine}


# Guide to install dailog command
if [ ! $(which dialog) ]
then
	echo 'The linux command "dialog" is not exist. please agree it to install '
	if [ $machine == "Mac" ]
	then
		brew install dialog
	elif [ $machine == "Linux" ]
	then
		sudo apt install dialog -y
	else
		echo "TODO: support dialog command except Mac, Debian and Ubuntu"
	fi
	echo "install ready, and please execute the script $0 again"
	exit
fi

# dialog text ui configuration
HEIGHT=15
WIDTH=80
CHOICE_HEIGHT=7
BACKTITLE="Please call utils_supervisor_restart.sh again and then refresh your browser when menu's action cannot change your GUI"
TITLE="MQTT manual testing tool (Ctrl+C to leave program)"
MENU="Choose action (Ctrl+C to leave program) (will pub to $BROKER_HOST:$PORT)"

OPTIONS=(1 "Limit finding available"
         2 "Limit finding already run"
         3 "Manual control not run yet"
	 4 "Joints list response (make sure that id matches request)"
	 5 "Limit finding error (make sure that id matches request)"
	 6 "Limit finding success (make sure that id matches request)"
	 7 "Exit"
	 )
while true; do

	CHOICE=$(dialog --clear \
                --backtitle "$BACKTITLE" \
                --title "$TITLE" \
                --menu "$MENU" \
                $HEIGHT $WIDTH $CHOICE_HEIGHT \
                "${OPTIONS[@]}" \
                2>&1 >/dev/tty)

	clear
	case $CHOICE in
		1)
			echo "You chose Option 1"
			mqtt pub -t 'healthStatus' -h "$BROKER_HOST" -m '{"robot_name":"C-3PO","limit_finding": "not_run_yet", "manual_control": "yes", "power_on_self_test": "ok", "emergency_stop": false}' -p $PORT
			;;
		2)
			echo "You chose Option 2"
			mqtt pub -t 'healthStatus' -h "$BROKER_HOST" -m '{"robot_name":"C-3PO","limit_finding": "ok", "manual_control": "yes", "power_on_self_test": "ok", "emergency_stop": false}'  -p $PORT
			;;
		3)
			echo "You chose Option 3"
			mqtt pub -t 'healthStatus' -h "$BROKER_HOST" -m '{"robot_name":"C-3PO","limit_finding": "not_run_yet", "manual_control": "no", "power_on_self_test": "ok", "emergency_stop": false}'  -p $PORT
			;;
		4)
			echo "You chose Option 4"
			mqtt pub -t 'jsonrpc_service_res' -h "$BROKER_HOST" -m '{"data":"{\"jsonrpc\":\"2.0\",\"id\":\"1581021436275\",\"result\":{\"joints\": \"center/torso_lift center/torso_rotate center/left_wheel center/right_wheel center/head_nod center/head_pan left_arm/shoulder_swing left_arm/shoulder_yaw left_arm/shoulder_rotate left_arm/elbow_swing left_arm/elbow_rotate left_arm/wrist_swing left_arm/wrist_rotate left_arm/gripper_tf right_arm/shoulder_swing right_arm/shoulder_yaw right_arm/shoulder_rotate right_arm/elbow_swing right_arm/elbow_rotate right_arm/wrist_swing right_arm/wrist_rotate right_arm/gripper_tf right_arm/gripper_flex left_arm/gripper_flex\"}}"}'  -p $PORT
			;;
		5)
			echo "You chose Option 5"
			mqtt pub -t 'jsonrpc_service_res' -h "$BROKER_HOST" -m '{"data":"{\"jsonrpc\":\"2.0\",\"error\":{\"code\":123,\"message\":\"Error message from robot\"},\"id\":1580162417862}"}'  -p $PORT
			;;
		6)
			echo "You chose Option 6"
			mqtt pub -t 'jsonrpc_service_res' -h "$BROKER_HOST" -m '{"data":"{\"jsonrpc\":\"2.0\",\"result\":1,\"id\":1581021436276}"}' -p $PORT
			;;
		7)
			echo "You chose Option 7"
			echo "Exit"
			break
			;;
	esac
done
