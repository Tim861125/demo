# OpenSearch Docker Environment

## Project Overview

This project provides a simple and convenient way to run an OpenSearch and OpenSearch Dashboards environment using Docker Compose. It is pre-configured for a single-node setup, making it ideal for local development and testing.

- **OpenSearch:** A distributed, open-source search and analytics engine.
- **OpenSearch Dashboards:** A visualization tool for data in OpenSearch.
- **Docker Compose:** To define and run the multi-container Docker application.
- **Just:** A command runner for project-specific tasks.

## Building and Running

### Prerequisites

- Docker
- Docker Compose
- [Just](https://github.com/casey/just)

### Commands

The `justfile` provides convenient commands for managing the environment:

- **Initialize the data directory:**
  ```bash
  just init
  ```

- **Start the services:**
  ```bash
  docker compose up -d
  ```

- **Stop the services:**
  ```bash
  docker compose down
  ```

- **View service logs:**
  ```bash
  docker compose logs -f
  ```

- **Reset the data directory:**
  ```bash
  just reset
  ```

## Development Conventions

- Project-specific commands are defined in the `justfile`. Use `just` to see a list of available commands.
- The OpenSearch data is persisted in the `./data` directory.
- The OpenSearch admin password is set in `docker compose.yml`. For development, it's `1qaz2wsx!QAZ@WSX`.
- Security is disabled by default for both OpenSearch and OpenSearch Dashboards for ease of development.
