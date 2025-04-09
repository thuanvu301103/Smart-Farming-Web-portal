# Smart-Farming-Web-portal Backend

## [Back-end Server](be-server)

## Database

### MongoDB

The web portal uses MongoDB as a DBMS

### FTP Server

An FTP (File Transfer Protocol) server is a type of server that allows users to transfer files between their local computer and the server. It's commonly used for website maintenance, file sharing, and data storage

Steps to set up an FTP server on Windows:

- **Step 1: Install FTP Server Feature**
	- **Open Control Panel**: Go to the `Control Panel` and select `Programs and Features`.
	- **Turn Windows Features On or Off**: Click on `Turn Windows features on or off`.
	- **Enable FTP Server**: Expand `Internet Information Services`, then expand `FTP Server`, and check `FTP Service`. Click `OK` to install the necessary components.

- **Step 2: Configure FTP Server**
	- **Open IIS Manager**: Go to the `Control Panel`, open `Administrative Tools`, and select `Internet Information Services (IIS) Manager`.
	- **Add FTP Site**: Right-click on `Sites` and select `Add FTP Site`.
	- **Enter Details**: Enter a name for your FTP site and specify the physical path to the directory you want to share.
	- **Configure Bindings**: Set the IP address and port for the FTP site. By default, FTP uses port `21`. Choose `No SSL` for simplicity unless you require a secure connection.
	- **Set Authentication and Authorization**: Choose `Basic` for authentication and specify which users can access your FTP server. Set permissions to `Read` or `Read/Write` as needed.

- **Step 3: Configure Windows Firewall**
	- **Open Windows Firewall Settings**: Go to the `Control Panel`, open `System and Security`, and click on `Windows Defender Firewall`.
	- **Allow FTP**: Click on `Allow an app or feature through Windows Defender Firewall`.
	- **Enable FTP**: Check the boxes for FTP Server under both "Private" and "Public" network settings.

- **Step 4: Test FTP Server**
	- **Open FTP Client**: Use an FTP client (e.g., FileZilla) to connect to your FTP server.
	- **Enter Credentials**: Provide the FTP server address, username, and password.
	- **Access Files**: Verify that you can access and transfer files to and from the FTP server.
