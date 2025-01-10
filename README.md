# Domain List Fetcher

This repository automatically fetches and maintains an updated list of domains from various sources.

## How it Works

- GitHub Actions workflow runs every 6 hours
- Fetches latest domain list
- Automatically commits and pushes updates
- Maintains history of changes

## Files

- `blocked_domains.txt`: The main list of domains
- `index.js`: Node.js script for fetching domains
- `.github/workflows/update-domains.yml`: GitHub Actions workflow configuration

## Setup

1. Fork this repository
2. Enable GitHub Actions in your fork
3. The workflow will run automatically every 6 hours, or you can trigger it manually from the Actions tab

## Local Development

```bash
# Install dependencies
npm install

# Run the fetcher
npm start
```

## Note

This tool is for educational and research purposes only. Please comply with all applicable laws and regulations in your jurisdiction.
