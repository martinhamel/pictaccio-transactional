FROM library/debian:bullseye-slim
MAINTAINER Roxanne Courchesne <rcourchesne@loufa.io>

ENV SERVER_NAME photosf.ca

RUN apt-get update && apt-get -y upgrade; \
	apt-get -y install apt-utils; \
	apt-get -y install apt-transport-https lsb-release ca-certificates curl gnupg2 cron; \
	curl https://packages.sury.org/php/apt.gpg | apt-key add -; \
	echo "deb https://packages.sury.org/php $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list; apt-get update; \
	apt-get -y install nginx php5.6 php5.6-mbstring php5.6-fpm php5.6-mysql php5.6-curl php5.6-zip php5.6-xml cron file; \
	rm /etc/timezone; \
	ln -s /usr/share/zoneinfo/America/Montreal /etc/timezone

ADD build/qa_env/nginx-config.conf /etc/nginx/sites-available/photosf.conf
RUN sed -i 's/;cgi.fix_pathinfo/cgi.fix_pathinfo=0;/' /etc/php/5.6/fpm/php.ini; \
	sed -i 's/memory_limit = [0-9]*M/memory_limit = -1/' /etc/php/5.6/fpm/php.ini; \
	sed -i 's/session.gc_maxlifetime = 1440/session.gc_maxlifetime = 2629746/' /etc/php/5.6/fpm/php.ini; \
    sed -i 's/post_max_size = [0-9]*M/post_max_size = 1000M/' /etc/php/5.6/fpm/php.ini; \
    sed -i 's/upload_max_filesize = [0-9]*M/upload_max_filesize = 1000M/' /etc/php/5.6/fpm/php.ini; \
	sed -i '/sendfile on;/a client_max_body_size 1000M;' /etc/nginx/nginx.conf; \
    sed -i '/sendfile on;/a proxy_request_buffering off;' /etc/nginx/nginx.conf; \
	rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default; \
	ln -s /etc/nginx/sites-available/photosf.conf /etc/nginx/sites-enabled/photosf.conf; \
	mkdir /var/log/$SERVER_NAME/; \
	nginx -t; \
	mkdir -p /run/php && touch /run/php/php5.6-fpm.sock && chown www-data:www-data -R /run/php && chmod 600 /run/php/php5.6-fpm.sock; \
	touch /var/log/php5.6-fpm.log && chown www-data:www-data /var/log/php5.6-fpm.log && chmod 600 /var/log/php5.6-fpm.log; \
	touch /run/nginx.pid && chown www-data:www-data /run/nginx.pid && chmod 600 /run/nginx.pid

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
