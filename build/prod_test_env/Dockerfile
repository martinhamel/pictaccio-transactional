FROM library/debian:bullseye-slim
MAINTAINER Roxanne Courchesne <rcourchesne@loufa.io>

ENV SERVER_NAME prod.photosf.ca

RUN apt-get update && apt-get -y upgrade \
&&  apt-get -y install apt-utils \
&&  apt-get -y install apt-transport-https lsb-release ca-certificates curl gnupg2 build-essential gnupg \
&&  curl https://packages.sury.org/php/apt.gpg | apt-key add - \
&&  echo "deb https://packages.sury.org/php $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list; apt-get update \
&&  apt-get -y install nginx php5.6 php5.6-mbstring php5.6-fpm php5.6-mysql php5.6-curl php5.6-zip php5.6-xml php5.6-pgsql cron file vim \
&&  mkdir -p /etc/apt/keyrings \
&&  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
&&  NODE_MAJOR=20 \
&&  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
&&  apt-get update \
&&  apt-get install -y nodejs \
&&  rm /etc/timezone \
&&  ln -s /usr/share/zoneinfo/America/Montreal /etc/timezone \
&&  groupmod --gid 19999 www-data \
&&  usermod --uid 19999 -d /var/app -s /bin/bash www-data

ADD build/prod_test_env/nginx-config.conf /etc/nginx/sites-available/pictaccio.conf
RUN sed -i 's/;cgi.fix_pathinfo/cgi.fix_pathinfo=0;/' /etc/php/5.6/fpm/php.ini \
&&  sed -i 's/memory_limit = [0-9]*M/memory_limit = -1/' /etc/php/5.6/fpm/php.ini \
&&  sed -i 's/post_max_size = [0-9]*M/post_max_size = 1000M/' /etc/php/5.6/fpm/php.ini \
&&  sed -i 's/upload_max_filesize = [0-9]*M/upload_max_filesize = 1000M/' /etc/php/5.6/fpm/php.ini \
&&  sed -i '/# server_tokens off;/a 	client_max_body_size 10000M;' /etc/nginx/nginx.conf \
&&  sed -i 's/session.gc_maxlifetime = 1440/session.gc_maxlifetime = 2629746/' /etc/php/5.6/fpm/php.ini \
&&  sed -i 's/max_execution_time = 30/max_execution_time = 600/' /etc/php/5.6/fpm/php.ini \
&&  sed -i 's/error_log = \/var\/log\/php5.6-fpm.log/error_log = \/var\/log\/php\/php5.6-fpm.log/' /etc/php/5.6/fpm/php-fpm.conf \
&&  sed -i 's/;clear_env = no/clear_env = no/' /etc/php/5.6/fpm/pool.d/www.conf \
&&  rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default \
&&  ln -s /etc/nginx/sites-available/pictaccio.conf /etc/nginx/sites-enabled/pictaccio.conf \
&&  mkdir /var/log/pictaccio/ \
&&  mkdir -p /run/php && touch /run/php/php5.6-fpm.sock && chown 19999:www-data -R /run/php && chmod 600 /run/php/php5.6-fpm.sock \
&&  touch /var/log/php5.6-fpm.log && chown www-data:www-data /var/log/php5.6-fpm.log && chmod 600 /var/log/php5.6-fpm.log \
&&  touch /run/nginx.pid && chown www-data:www-data /run/nginx.pid && chmod 600 /run/nginx.pid \
&&  mkdir -p /var/log/pictaccio && touch /var/log/pictaccio/nginx_access.log && chown www-data:www-data /var/log/pictaccio/nginx_access.log && chmod 600 /var/log/pictaccio/nginx_access.log \
&&  touch /var/log/access.log && touch /var/log/error.log && chown www-data:www-data -R /var/log/nginx && chmod 600 -R /var/log/nginx && chmod 700 /var/log/nginx \
&&  chmod +x /var/log/pictaccio \
&&  nginx -t

ADD cms/ /srv/pictaccio
RUN chown www-data:www-data -R /srv \
&&  chmod 400 -R /srv/pictaccio \
&&  chmod 600 -R /srv/pictaccio/app/Config \
&&  chmod +x -R /srv/pictaccio \
&&  chmod 600 -R /srv/pictaccio/app/tmp
#	sed -i "/<\/head>/i <!-- Global site tag (gtag.js) - Google Analytics --> \
#			<script async src="https://www.googletagmanager.com/gtag/js?id=G-FCJ18FWY42"></script> \
#			<script> \
#                window.dataLayer = window.dataLayer || []; \
#                function gtag(){dataLayer.push(arguments);} \
#                gtag('js', new Date()); \
#                gtag('config', 'G-FCJ18FWY42'); \
#            </script>" /srv/photosf/app/View/Layouts/default.ctp;

RUN (crontab -l; echo "0 0 * * * curl http://localhost:3000/chronics/emit/Backgrounds.popularityReport") | crontab - \
&&  systemctl enable cron \
&&  service cron start

RUN echo "#!/bin/bash" > /entrypoint.sh && \
    echo "mkdir -p /srv/pictaccio/app/tmp/cache/models" >> /entrypoint.sh && \
    echo "mkdir -p /srv/pictaccio/app/tmp/cache/persistent" >> /entrypoint.sh && \
    echo "mkdir -p /srv/pictaccio/app/tmp/cache/views" >> /entrypoint.sh && \
    echo "mkdir -p /srv/pictaccio/app/tmp/logs" >> /entrypoint.sh && \
    echo "mkdir -p /srv/pictaccio/app/tmp/sessions" >> /entrypoint.sh && \
    echo "mkdir -p /srv/pictaccio/app/tmp/tests" >> /entrypoint.sh && \
    echo "mkdir -p /srv/pictaccio/app/tmp/paks" >> /entrypoint.sh && \
    echo "/usr/sbin/php-fpm5.6 -D" >> /entrypoint.sh && \
    echo "nginx&" >> /entrypoint.sh && \
    echo "" >> /entrypoint.sh && \
    echo "while ! curl -s http://localhost:3000/ > /dev/null; do" >> /entrypoint.sh && \
    echo "  echo \"Waiting for nginx to start...\"" >> /entrypoint.sh && \
    echo "  sleep 0.1" >> /entrypoint.sh && \
    echo "done" >> /entrypoint.sh && \
    echo "" >> /entrypoint.sh && \
    echo "sleep 30" >> /entrypoint.sh && \
    echo "echo Running init..." >> /entrypoint.sh && \
    echo "node /srv/pictaccio/companion/entry.js --init" >> /entrypoint.sh && \
    echo "echo Running companion..." >> /entrypoint.sh && \
    echo "node /srv/pictaccio/companion/entry.js &" >> /entrypoint.sh && \
    echo "wait" >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

WORKDIR /srv/pictaccio
USER 19999
EXPOSE 3000
CMD /entrypoint.sh
