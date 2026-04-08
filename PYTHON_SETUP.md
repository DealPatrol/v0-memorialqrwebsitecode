# Python Setup Guide

This project includes Python dependencies for extended functionality.

## Prerequisites

- Python 3.12 or higher
- pip (Python package manager)

## Installation

### Using pip

Install Python dependencies using:

```bash
pip install -r requirements.txt
```

Or install directly:

```bash
pip install llama-stack
```

### Using a Virtual Environment (Recommended)

For isolated dependency management:

```bash
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Dependencies

- **llama-stack** (v0.3.2): Meta's Llama Stack framework for building LLM applications

## Verification

To verify the installation:

```bash
pip show llama-stack
```

## Notes

- Python dependencies are managed separately from Node.js dependencies
- The `venv/` directory is excluded from version control (see `.gitignore`)
- Python packages are installed in user space or in a virtual environment
