## openvidu-virtual-background-tool

> [!WARNING]
> **This repository is no longer maintained.**


 ### Build docker image

 Under `docker/` directory:

```bash
./run.sh
```

## Running docker container

```bash
docker run -d -v {}your-local-directory}:/opt/openvidu-virtual-background-tool/recordings/ -p {your-port}:5000 openvidu/openvidu-virtual-background-tool
```