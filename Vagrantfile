Vagrant.configure("2") do |config|
    if ARGV[0] != 'destroy' && ARGV[0] != 'ssh'
        if ENV['EMAIL_SENDGRID_APIKEY'].nil? || ENV['EMAIL_SENDGRID_APIKEY'].empty?
            abort("Please set the EMAIL_SENDGRID_APIKEY environment variable")
        end
    end

    config.vm.box = "ubuntu/jammy64"

    config.vm.provider :virtualbox do |vb|
        vb.memory = 1024
        vb.cpus = 2
        vb.customize ["modifyvm", :id, "--uartmode1", "disconnected"]
    end

    config.vm.network "private_network", ip: "192.168.56.11"

    config.vm.synced_folder "cms", "/srv/photosf", owner: "www-data", group: "www-data", :mount_options => ['dmode=774','fmode=775']
    config.vm.synced_folder "../../dist/app/admin-api/src/public", "/srv/photosf/app/webroot/pub", owner: "www-data", group: "www-data", :mount_options => ['dmode=774','fmode=775']

    config.vm.provision "file", source: "build/qa_env/nginx-config.conf", destination: "/home/vagrant/nginx-config.conf"
    config.vm.provision "file", source: "build/photosf.sql", destination: "/home/vagrant/photosf.sql"
    config.vm.provision "file", source: "build/vagrant/20-xdebug.ini", destination: "/home/vagrant/20-xdebug.ini"
    config.vm.provision "file", source: "build/vagrant/db_vars.php", destination: "/home/vagrant/db_vars.php"
    config.vm.provision "file", source: "build/vagrant/environment", destination: "/tmp/environment"
    config.vm.provision "file", source: "build/vagrant/environment_php", destination: "/tmp/environment_php"
    config.vm.provision "shell", inline: <<SHELL
        echo -n "EMAIL_SENDGRID_APIKEY=#{ENV['EMAIL_SENDGRID_APIKEY']}" >> /tmp/environment_php

        apt-get update && apt-get -y upgrade
        apt-get -y install apt-utils
        apt-get -y install apt-transport-https lsb-release ca-certificates curl gnupg2 vim lnav \
                           mariadb-server apache2 ubuntu-keyring
        DEBIAN_FRONTEND=noninteractive apt-get install -y phpmyadmin

        add-apt-repository ppa:ondrej/php
        curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
            | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
        echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
            http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
            | sudo tee /etc/apt/sources.list.d/nginx.list
        echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
            | sudo tee /etc/apt/preferences.d/99nginx
        apt-get -y install nginx php5.6 php5.6-mbstring php5.6-fpm php5.6-mysql php5.6-curl php5.6-zip php5.6-xml php5.6-xdebug file php5.6-pgsql
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
        NODE_MAJOR=18
        echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
        apt-get update
        apt-get install -y nodejs

        rm /etc/timezone
        ln -s /usr/share/zoneinfo/America/Montreal /etc/timezone

        sudo cp /tmp/environment /etc/environment
        sudo cp /tmp/environment_php /etc/environment_php
        cp /home/vagrant/nginx-config.conf /etc/nginx/conf.d/photosf.conf
        cp /home/vagrant/20-xdebug.ini /etc/php/5.6/fpm/conf.d/
        cp /home/vagrant/db_vars.php /srv/photosf/app/Config/db_vars.php
        sed -i 's/;cgi.fix_pathinfo/cgi.fix_pathinfo=0;/' /etc/php/5.6/fpm/php.ini
        sed -i 's/memory_limit = [0-9]*M/memory_limit = -1/' /etc/php/5.6/fpm/php.ini
        sed -i '/sendfile on;/a client_max_body_size 1000M;' /etc/nginx/nginx.conf
        sed -i 's/^;clear_env = no/clear_env = no/' /etc/php/5.6/fpm/pool.d/www.conf
        rm /etc/nginx/sites-enabled/default
        mkdir /var/log/photosf.ca/
        nginx -t
        nginx -s reload
        service php5.6-fpm restart
        mkdir -p /run/php && touch /run/php/php5.6-fpm.sock && chown www-data:www-data -R /run/php && chmod 600 /run/php/php5.6-fpm.sock
        touch /var/log/php5.6-fpm.log && chown www-data:www-data /var/log/php5.6-fpm.log && chmod 600 /var/log/php5.6-fpm.log
        touch /run/nginx.pid && chown www-data:www-data /run/nginx.pid && chmod 600 /run/nginx.pid

        chmod 400 -R /srv/photosf
        chmod +x -R /srv/photosf
        chmod 600 -R /srv/photosf/app/tmp

        mysql < /home/vagrant/photosf.sql

        ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-enabled/phpmyadmin.conf
        a2enmod proxy_fcgi setenvif

        mkdir -p /etc/systemd/system/php5.6-fpm.service.d
        echo '[Service]' >> /etc/systemd/system/php5.6-fpm.service.d/override.conf
        echo 'EnvironmentFile=/etc/environment_php' >> /etc/systemd/system/php5.6-fpm.service.d/override.conf

        ln -s /vagrant/resources/companion/node_modules /srv/photosf/companion/

        service apache2 restart
        service nginx start
SHELL

end
