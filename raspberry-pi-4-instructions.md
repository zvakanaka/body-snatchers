# Install VNC
`sudo apt install tightvncserver`

# Crontab
Edit your crontab with:
`$ crontab -e`
```sh
USER=pi
DISPLAY=:1
@reboot vncserver >> /home/pi/vncserver.log

```

# [Force resolution](https://softsolder.com/2016/12/23/raspberry-pi-forcing-vnc-display-resolution/)
> You can use VNC with a headless Raspberry Pi, but, absent a display with which to negotiate the screen resolution, X defaults something uselessly small: 720×480. To force a more reasonable resolution, edit /boot/config.txt and set the framebuffer size:
```
framebuffer_width=1920
framebuffer_height=1280
```

VNC Error logs (if you have problems):
```sh
$ tail -f ~/.vnc/raspberrypi:1.log
$ tail -f ~/.xsession-errors
$ tail /var/mail/pi
```

# If you get `No session for pid:` window
`sudo mv /usr/bin/lxpolkit /usr/bin/lxpolkit.bak`
[source](https://github.com/meefik/linuxdeploy/issues/978#issuecomment-414258833)

# View your screen from another computer's browser
https://github.com/novnc/noVNC
