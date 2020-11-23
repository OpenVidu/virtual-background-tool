## openvidu-virtual-background-tool


 ### Build docker image

 Under `docker/` directory:

```bash
./run.sh
```

## Running docker container

```bash
docker run -v {your-local-directory}:/opt/openvidu/openvidu-virtual-background-tool/recordings/ -p 127.0.0.1:5000:5000 openvidu/openvidu-virtual-background-tool
```