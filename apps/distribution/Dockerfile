FROM harbor-ca.inflyway.com/tools/nodejs22-21-0-pm2:v251028
WORKDIR /
USER root
COPY .output /flylinking-monorepo-distribution
COPY ecosystem.config.js /flylinking-monorepo-distribution/ecosystem.config.js
COPY package.json /flylinking-monorepo-distribution/package.json
EXPOSE 3000
ENTRYPOINT ["pm2-runtime /flylinking-monorepo-distribution/ecosystem.config.js"]
