FROM ubuntu:latest

# Install environment
RUN apt-get update && \
    apt-get install -y maven openjdk-21-jdk && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /home/

# Expose the port
EXPOSE 3000

# Compile & run
CMD ["bash", "-c", "cd devapp && mvn compile"]
