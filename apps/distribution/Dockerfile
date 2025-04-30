FROM harbor.kamelnet.com:8080/tools/nodejs18-20-2-pm2-runtime:v240428
WORKDIR /
USER root
COPY .output /flylinking-monorepo-distribution
COPY ecosystem.config.js /flylinking-monorepo-distribution/ecosystem.config.js
COPY package.json /flylinking-monorepo-distribution/package.json
EXPOSE 3000
ENTRYPOINT ["pm2-runtime /flylinking-monorepo-distribution/ecosystem.config.js"]
