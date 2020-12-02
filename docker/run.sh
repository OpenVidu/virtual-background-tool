#!/bin/bash
pushd ../frontend/
npm install && npm run build

popd
pushd ../
docker build -f docker/Dockerfile -t openvidu/openvidu-virtual-background-tool .
docker run -d -v /opt/openvidu-virtual-background-tool/recordings/:/opt/openvidu-virtual-background-tool/recordings/ -p 5000:5000 openvidu/openvidu-virtual-background-tool

