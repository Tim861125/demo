# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docker Compose-based OpenSearch development environment providing a single-node OpenSearch cluster and OpenSearch Dashboards for local development and testing.

**Stack:**
- OpenSearch 3.2.0 (distributed search and analytics engine)
- OpenSearch Dashboards 3.2.0 (data visualization tool)
- Docker Compose (orchestration)
- Just (command runner)

## Common Commands

### Environment Management

```bash
# Initialize data directory (required before first run)
just init

# Start services (detached mode)
docker compose up -d

# Stop services
docker compose down

# View logs (follow mode)
docker compose logs -f

# Reset data directory (clears all OpenSearch data)
just reset
```

### Available Just Commands

Run `just` or `just --list` to see all available commands defined in the justfile.

## Architecture

**Single-Node Setup:**
- OpenSearch runs as a single node with combined master, data, and ML roles
- Security plugin is disabled for development convenience
- Data persists in `./data` directory (mounted volume)

**Service Endpoints:**
- OpenSearch API: http://localhost:9200
- OpenSearch Performance Analyzer: http://localhost:9600
- OpenSearch Dashboards: http://localhost:5601

**Configuration:**
- Admin password: `1qaz2wsx!QAZ@WSX` (dev environment only)
- Security disabled on both OpenSearch and Dashboards
- Discovery type: single-node

## Data Persistence

All OpenSearch data is stored in `./data` directory, which is mounted to `/usr/share/opensearch/data` in the container. This directory is gitignored and can be completely reset using `just reset`.
