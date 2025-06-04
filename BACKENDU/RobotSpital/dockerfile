# Use an official Python runtime as the base image
FROM python:3.13-slim

# Set working directory in the container
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
      gcc \
      libpq-dev \
      build-essential \
      python3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Run Alembic migrations and start FastAPI
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --reload --host 0.0.0.0 --port $PORT"]