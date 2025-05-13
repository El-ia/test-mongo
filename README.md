
# Livre d'or Website Deployment

## Launch

1.  Start your VM
2.  Make your VM publicly accessible
3.  Connect via SSH

-   Use your terminal to connect to your server via SSH

4.  Package updates

-   Run the following commands to update your system packages. This ensures you have the latest software versions and security patches:
-   sudo apt update
-   sudo apt upgrade

## Necessary Installations

### Installing Node.js

1.  Install NVM to switch to LTS

-   NVM (Node Version Manager) allows you to manage multiple versions of Node.js. To install the LTS (Long Term Support) version, use the following commands. It's important to align Node.js versions between development and production environments:
-   curl [https://raw.githubusercontent.com/creationix/nvm/master/install.sh](https://raw.githubusercontent.com/creationix/nvm/master/install.sh) | bash
-   source ~/.bashrc
-   nvm --version (source ~/.bashrc reloads your shell configuration file so that NVM is immediately available. nvm --version verifies that the installation was successful.)

2.  Install Node.js and npm

-   Run the following command to install Node.js and npm:
-   nvm install --lts
-   node --version (node --version verifies the Node.js installation.)

### Installing PostgreSQL

1.  Install PostgreSQL

-   Run the following command to install PostgreSQL:
-   sudo apt install postgresql

2.  Create a user and database

-   Login as the 'postgres' user, which is the default user with administrator privileges on PostgreSQL:
-   sudo -i -u postgres psql
-   Then, create a new user and database, and assign the database to the user:
-   CREATE USER <username> WITH PASSWORD <password>;
-   CREATE DATABASE <your\_database\_name>;
-   ALTER DATABASE <your\_database\_name> OWNER TO <username>;
-   Install memory store for session leaks
-   Note: Make sure to choose a secure password for the database user.

## Project Retrieval

-   Clone the project from GitHub
-   Use the git clone <repository-URL> command to retrieve the project source code and set up the SSH key if necessary.

## Project Configuration

1.  Install production packages

-   Run the following command to install the necessary dependencies for production, excluding development dependencies:
-   npm install --omit=dev

2.  Configure the .env file

-   Fill the .env file with the environment variables needed for your project. Using VS Code can make this task easier thanks to the remote SSH extension rather than using nano or VIM.

3.  Create the database

-   Run the following command to create tables and initialize the database:
-   npm run db

4.  Populate the database

-   Run the following command to populate the database (this is to verify that the application works in production, afterward you'll need to reset the database):
-   npm run db

5.  Start the project

-   Start the application by running the following command:
-   npm start

## Configuring Nginx for the reverse proxy

1.  Install Nginx

-   Run the following command to install Nginx, a web server that can also be used as a reverse proxy:
-   sudo apt install nginx

2.  Configure Nginx

-   Create a configuration file for the "livredor" project:
-   sudo nano /etc/nginx/sites-available/livredor
-   You can base it on the default configuration file to start:

# You can use the default configuration file as a starting point:
server {
    # Port listened to by Nginx
    listen 80;

    # Domain handled by Nginx: you can configure
    # multiple domains on the same server
    server_name <your-domain-name>;

    # Base route for the domain
    location / {
        # Forward useful headers to Node.js
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        # THIS IS THE KEY LINE:
        # Tells Nginx to forward the web request to Node.js
        # (which runs on 127.0.0.1:3000)
        # Node.js will return the HTTP response to Nginx
        proxy_pass http://127.0.0.1:3000;
    }
}

-   Use Ctrl + O to save, then Ctrl + X to exit.
-   Note: Replace <your-domain-name> with the domain name associated with your server.

3.  Enable the configuration

-   Remove the symbolic link and the default file once it's no longer needed:
-   sudo rm /etc/nginx/sites-enabled/default
-   Create a symbolic link to your new configuration file:
-   sudo ln -s /etc/nginx/sites-available/livredor /etc/nginx/sites-enabled/
-   Check the configuration to make sure there are no errors:
-   sudo nginx -t
-   Restart Nginx to apply the changes:
-   sudo systemctl restart nginx

## More configurations

1.  Configure HTTPS

-   Use Let's Encrypt which allows you to obtain free and automatic HTTP certificates.
-   To secure your site with HTTPS, follow the instructions available here: Certbot - Instructions
-   Install Certbot:
-   sudo snap install --classic certbot
-   Create a symbolic link for Certbot:
-   sudo ln -s /snap/bin/certbot /usr/bin/certbot
-   Configure SSL for Nginx with Certbot:
-   sudo certbot --nginx
-   Note: Make sure the virtual machine is publicly accessible and use the domain name configured for the cloud.

2.  Set up pm2

-   Installing PM2
-   Run the following command to install PM2, a process manager that allows, among other things, to automatically restart our server in case of a crash:
-   npm install pm2@latest -g
-   Start the application with PM2
-   Use the following command to start the application with PM2:
-   pm2 start npm -- start
-   Configure PM2 to start at system launch (BONUS)
-   Configure PM2 to start automatically with the system:
-   pm2 startup systemd
-   Copy-paste the provided command in the terminal.
-   Save the configuration:
-   pm2 save
-   You can test that it works by restarting the VM:
-   sudo reboot
-   To manage PM2 processes:
-   pm2 stop <name> to stop a process
-   pm2 restart <name> to restart a process
