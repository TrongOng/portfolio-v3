# Start with Python 3.10 base image
FROM python:3.10

# Set working directory
WORKDIR /api

# Copy application files
COPY ./ /api/

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /api/requirements.txt

# # Expose port
# EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
