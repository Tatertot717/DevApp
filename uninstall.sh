docker compose down
docker builder prune --filter "label=com.docker.compose.project=DevApp" --force
docker image prune --filter "label=com.docker.compose.project=DevApp" --force
docker rmi devappimage
