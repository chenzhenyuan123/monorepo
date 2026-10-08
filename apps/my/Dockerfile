FROM harbor-ca.inflyway.com/tools/nodejs22-21-0-pm2:v251028
WORKDIR /
USER root
COPY .output /flylinking-monorepo-my
COPY ecosystem.config.js /flylinking-monorepo-my/ecosystem.config.js
COPY package.json /flylinking-monorepo-my/package.json
EXPOSE 3000
ENTRYPOINT ["pm2-runtime /flylinking-monorepo-my/ecosystem.config.js"]
