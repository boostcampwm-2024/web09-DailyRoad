#!/bin/bash

install_docker() {
  if ! command -v docker &>/dev/null; then
    echo "Docker is not installed. Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y \
      ca-certificates \
      curl \
      gnupg \
      lsb-release

    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    sudo usermod -aG docker $USER
    echo "Docker installed successfully. Please log out and log back in to use Docker without sudo."
  else
    echo "Docker is already installed."
  fi
}

install_docker_compose() {
  if ! command -v docker-compose &>/dev/null; then
    echo "Docker Compose is not installed. Installing via apt..."
    sudo apt-get update
    sudo apt-get install -y docker-compose
    echo "Docker Compose installed successfully."
  else
    echo "Docker Compose is already installed."
  fi
}

install_docker
install_docker_compose
