#!/bin/bash
pushd ../frontend/
npm install && npm run build

popd
pushd ../
ls
docker build -f docker/Dockerfile -t openvidu/openvidu-virtual-background-tool .

