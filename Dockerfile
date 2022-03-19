FROM node:14-slim

USER node
WORKDIR /home/node/app
CMD ["sh", "-c", "npm i && tail -f /dev/null"]
