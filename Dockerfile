FROM node:slim

# Install environment
RUN apt-get update && \
    #apt-get install -y npm && \
    rm -rf /var/lib/apt/lists/* 

# Set the working directory
WORKDIR /home/

# Expose the port
EXPOSE 3000

# Compile & run
CMD ["bash", "-c", "cd devapp && npm install && npm run dev"]
