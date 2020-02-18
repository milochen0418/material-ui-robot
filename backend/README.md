# user-infra-api
This repository contains API service for User Infrastructure project.

## Installation

### Install yarn
If you don't have `yarn` installed then check newest instructions on how to install it at https://yarnpkg.com/en/docs/install

### Install dependencies

```sh
$ yarn install
```

### Check config file
Check contents of file `src/Config.ts` for env variables used and either use default values or provide whatever works
for your environment.

### Run app in dev mode

```sh
$ yarn start:dev
```

## Available commands for the server.

- Run the server in development mode: `yarn start:dev`.
- Run all unit-tests: `yarn test`.
- Run a single unit-test: `yarn test -- --testFile="name of test file" (i.e. --testFile=Users)`.
- Check for linting errors: `yarn lint`.
- Build the project for production: `yarn build`.
- Run the production build: `yarn start`.
- Run production build with a different env file `yarn start -- --env="name of env file" (default is production)`.


## HOW TOs

### Using DI
TODO

### TODO:
1. Topic per robot (request)

### Sample MQTT messages

Limit finding available
```bash
mqtt pub -t 'healthStatus' -h '127.0.0.1' -m '{"robot_name":"C-3PO","limit_finding": "not_run_yet", "manual_control": "yes", "power_on_self_test": "ok", "emergency_stop": false}'
```

Limit finding already run
```bash
mqtt pub -t 'healthStatus' -h '127.0.0.1' -m '{"robot_name":"C-3PO","limit_finding": "ok", "manual_control": "yes", "power_on_self_test": "ok", "emergency_stop": false}'
```

Manual control not run yet
```bash
mqtt pub -t 'healthStatus' -h '127.0.0.1' -m '{"robot_name":"C-3PO","limit_finding": "not_run_yet", "manual_control": "no", "power_on_self_test": "ok", "emergency_stop": false}'
```

Joints list response (make sure that `id` matches request)
```bash
mqtt pub -t 'jsonrpc_service_res' -h '127.0.0.1' -m '{"data":"{\"jsonrpc\":\"2.0\",\"id\":\"1581021436275\",\"result\":{\"joints\": \"center/torso_lift center/torso_rotate center/left_wheel center/right_wheel center/head_nod center/head_pan left_arm/shoulder_swing left_arm/shoulder_yaw left_arm/shoulder_rotate left_arm/elbow_swing left_arm/elbow_rotate left_arm/wrist_swing left_arm/wrist_rotate left_arm/gripper_tf right_arm/shoulder_swing right_arm/shoulder_yaw right_arm/shoulder_rotate right_arm/elbow_swing right_arm/elbow_rotate right_arm/wrist_swing right_arm/wrist_rotate right_arm/gripper_tf right_arm/gripper_flex left_arm/gripper_flex\"}}"}'
```

Limit finding error (make sure that `id` matches request)
```bash
mqtt pub -t 'jsonrpc_service_res' -h '127.0.0.1' -m '{"data":"{\"jsonrpc\":\"2.0\",\"error\":{\"code\":123,\"message\":\"Error message from robot\"},\"id\":1580162417862}"}'
```

Limit finding success (make sure that `id` matches request)
```bash
mqtt pub -t 'jsonrpc_service_res' -h '127.0.0.1' -m '{"data":"{\"jsonrpc\":\"2.0\",\"result\":1,\"id\":1581021436276}"}'
```

