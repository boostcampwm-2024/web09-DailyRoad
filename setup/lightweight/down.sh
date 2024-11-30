#!/bin/bash

cd mysql || exit
sudo docker-compose down
sudo rm -rf data
mkdir data
cd ..

cd elasticsearch || exit
sudo docker-compose down
cd ..

sudo docker volume prune -f
