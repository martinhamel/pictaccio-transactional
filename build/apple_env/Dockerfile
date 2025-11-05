FROM library/debian:11.11-slim
MAINTAINER Roxanne Courchesne <rcourchesne@loufa.io>

ENV SERVER_NAME prod.photosf.ca
ARG EMAIL_SENDGRID_APIKEY

RUN apt-get update && apt-get -y upgrade; \
	apt-get -y install apt-utils; \
	apt-get -y install apt-transport-https lsb-release ca-certificates curl gnupg2; \
	curl https://packages.sury.org/php/apt.gpg | apt-key add -; \
	echo "deb https://packages.sury.org/php $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list; apt-get update; \
	apt-get -y install nginx php5.6 php5.6-mbstring php5.6-fpm php5.6-mysql php5.6-curl php5.6-zip php5.6-xml cron file php5.6-pgsql; \
    NODE_MAJOR=20; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list; \
    apt-get update; \
    apt-get install -y nodejs; \
	rm /etc/timezone; \
	ln -s /usr/share/zoneinfo/America/Montreal /etc/timezone

ADD build/apple_env/nginx-config.conf /etc/nginx/sites-available/photosf.conf
ADD build/apple_env/environment_php /etc/environment_php
ADD build/apple_env/environment /etc/environment
RUN echo -n "EMAIL_SENDGRID_APIKEY=${EMAIL_SENDGRID_APIKEY}" >> /etc/environment_php ; \
    sed -i 's/;cgi.fix_pathinfo/cgi.fix_pathinfo=0;/' /etc/php/5.6/fpm/php.ini; \
	sed -i 's/memory_limit = [0-9]*M/memory_limit = -1/' /etc/php/5.6/fpm/php.ini; \
	sed -i 's/post_max_size = [0-9]*M/post_max_size = 1000M/' /etc/php/5.6/fpm/php.ini; \
	sed -i 's/upload_max_filesize = [0-9]*M/upload_max_filesize = 1000M/' /etc/php/5.6/fpm/php.ini; \
	sed -i '/# server_tokens off;/a 	client_max_body_size 10000M;' /etc/nginx/nginx.conf; \
    sed -i 's/session.gc_maxlifetime = 1440/session.gc_maxlifetime = 2629746/' /etc/php/5.6/fpm/php.ini; \
    sed -i 's/max_execution_time = 30/max_execution_time = 600/' /etc/php/5.6/fpm/php.ini; \
    sed -i 's/;clear_env = no/clear_env = no/' /etc/php/5.6/fpm/pool.d/www.conf; \
	rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default; \
	ln -s /etc/nginx/sites-available/photosf.conf /etc/nginx/sites-enabled/photosf.conf; \
	mkdir /var/log/$SERVER_NAME/; \
	mkdir -p /run/php && touch /run/php/php5.6-fpm.sock && chown www-data:www-data -R /run/php && chmod 600 /run/php/php5.6-fpm.sock; \
	touch /var/log/php5.6-fpm.log && chown www-data:www-data /var/log/php5.6-fpm.log && chmod 600 /var/log/php5.6-fpm.log; \
	touch /run/nginx.pid && chown www-data:www-data /run/nginx.pid && chmod 600 /run/nginx.pid; \
	mkdir -p /var/log/photosf.ca && touch /var/log/photosf.ca/nginx_access.log && chown www-data:www-data /var/log/photosf.ca/nginx_access.log && chmod 600 /var/log/photosf.ca/nginx_access.log; \
	chmod +x /var/log/photosf.ca; \
	nginx -t

ADD cms/ /srv/photosf
RUN chown www-data:www-data -R /srv; \
	chmod 400 -R /srv/photosf; \
	chmod +x -R /srv/photosf; \
	chmod 600 -R /srv/photosf/app/tmp

RUN (crontab -l; echo "0 0 * * * curl http://localhost:8080/chronics/emit/Backgrounds.popularityReport") | crontab -; \
    systemctl enable cron; \
    service cron start

WORKDIR /srv/photosf
USER www-data
EXPOSE 8080
CMD /usr/sbin/php-fpm5.6 -D; nginx -g 'daemon off;'
