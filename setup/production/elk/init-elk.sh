#!/bin/bash

cd ../docker-elk || exit
sudo docker-compose down

cd ..
sudo rm -rf docker-elk
