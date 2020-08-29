FROM amazonlinux:2

WORKDIR /tmp
#install the dependencies
RUN yum -y install gcc-c++ && yum -y install findutils
RUN yum -y install tar bzip2 gzip

RUN touch ~/.bashrc && chmod +x ~/.bashrc

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.3/install.sh | bash

RUN source ~/.bashrc && nvm install 12.7

WORKDIR /build

