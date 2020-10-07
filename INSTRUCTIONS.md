# Generate Lambda Function

1. Install Docker Desktop App: <https://www.docker.com/products/docker-desktop>
2. For Windows:
    a) Install Ubuntu terminal app: <https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6?activetab=pivot:overviewtab>
    b) Enable WSL2 integration (enables docker commands in terminal): <https://docs.docker.com/docker-for-windows/wsl/>
    c) Open Ubuntu terminal and navigate to this project directory: `cd /mnt/c/Users/<userName>/<path-to-project>`
3. From root project directory: `cd ./amazon-linux-nodejs12.7-docker`
4. Run command from `0-build-docker.sh`
5. Run command from `1-create-container.sh`. From Docker command line
    a) `cd ./lambda`
    b) `npm install`
    c) `exit`
6. Zip lambda folder files from bash terminal
    a) Navigate back to project root: `cd ../`
    b) `cd ./lambda; zip -r ../image-resize-function.zip ./*; cd -`
