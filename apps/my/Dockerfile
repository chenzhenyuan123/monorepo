FROM harbor.kamelnet.com:8080/tools/nodejs18-20-2-pm2-runtime:v240428
WORKDIR /
USER root
COPY .output /flylinking-distributor-front
COPY ecosystem.config.js /flylinking-distributor-front/ecosystem.config.js
COPY package.json /flylinking-distributor-front/package.json
EXPOSE 3000
ENTRYPOINT ["pm2-runtime /flylinking-distributor-front/ecosystem.config.js"]
