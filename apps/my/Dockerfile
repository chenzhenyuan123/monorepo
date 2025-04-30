FROM harbor.kamelnet.com:8080/tools/nodejs18-20-2-pm2-runtime:v240428
WORKDIR /
USER root
COPY .output /flylinking-monorepo-my
COPY ecosystem.config.js /flylinking-monorepo-my/ecosystem.config.js
COPY package.json /flylinking-monorepo-my/package.json
EXPOSE 3000
ENTRYPOINT ["pm2-runtime /flylinking-monorepo-my/ecosystem.config.js"]
