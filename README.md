A project Euler clone written with the lovely Meteor framework. Utilizes JavaScript, Bootstrap and some leftover CoffeeScript.

# Installation
- Install [Meteor](http://meteor.com)
- Download or clone this into /some/path
- cd /some/path
- Run `meteor`

# Admin privileges
During the upstart of the application it checks the number of registered users, if there is only one, he/she will be given admin privileges. So after the installation steps are finished, simply register a user in the app, then kill the server and start it up again with `meteor`.

# Setup in DigitalOcean
1. Create a new droplet with Ubuntu and at least 2GB of RAM (can be reduced later, but must be 2GB for the install)
2. Log in to the droplet and download Programming Ladder  
    `git clone https://github.com/MAPSuio/programming-ladder.git`
3. Install Meteor  
    `curl https://install.meteor.com/ | sh`
4. Setup port forwarding from port `3000` to port `80` by running the following
   command. Add it to `/etc/rc.local` to make it persist through reboots  
    `iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to 3000`
5. Setup `startup` to make programming ladder a service by creating the file
   `/etc/init/ladder.conf`, and put the following into it:
    ```
    description "Knowit Programming Ladder"
    author      "knowit"

    start on started mountall
    stop on shutdown
    respawn
    respawn limit 99 5

    script
    export HOME="/root"

    cd /root/programming-ladder && exec /usr/local/bin/meteor >> /var/log/ladder.log 2>&1
    end script
    ```
6. Build the Programming Ladder Meteor project by starting it with `start ladder`. Watch the progress with `tail -f /var/log/ladder.log`

Now Programming Ladder runs whenever the droplet is restarted. Stop it with
`stop ladder`. You may now also shutdown the droplet and resize it to whatever
size you want.

You can see the web interface by directing a browser to
`http://<your-droplet-ip>`.
