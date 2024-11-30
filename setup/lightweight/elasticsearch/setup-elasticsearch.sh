#!/bin/bash

source .env

docker-compose up setup
docker-compose up -d
