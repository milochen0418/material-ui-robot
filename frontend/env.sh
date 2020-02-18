#!/bin/bash

set -e

# Recreate config file
rm -rf ./env-config.js
touch ./env-config.js

# Add assignment
echo "window._env_ = {" >> ./env-config.js

# Read each line in .env file
# Each line represents key=value pairs, but we're going to use only keys
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")

  # Append configuration property to JS file
  if [ -n "$value" ]; then
    echo "  $varname: \"$value\"," >> ./env-config.js
  fi
done < .env

echo "}" >> ./env-config.js
