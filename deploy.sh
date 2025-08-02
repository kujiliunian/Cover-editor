#!/bin/bash
# chkconfig: 2345 55 25
# description: xyserver Cloud Service

### BEGIN INIT INFO
# Provides:          bawei
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts xyserver
# Description:       starts the xyserver
### END INIT INFO
UZ_HOME=/home/admin/Cover_editor/dist  # 从package.tgz中解压出来的jar包放到这个目录下
WWW_HOME=/www/wwwroot/testcover.mochiani.com
mkdir -p ${WWW_HOME}

panel_status()
{
    echo -e "查看当前状态... \c";
}

start_application() {
   echo "start"
}

stop_application() {
   echo "stop"
}
install_application(){
  echo "install"
  rm -rf ${WWW_HOME}/*

  cp -rf ${UZ_HOME}/* ${WWW_HOME}
}
case "$1" in
        'start')
                start_application
                ;;
        'stop')
                stop_application
                ;;
        'install')
                install_application
        ;;
        'restart')
                stop_application
                sleep 0.2
                start_application
                ;;
        'status')
                panel_status
                ;;
        'default')

                ;;
        *)
                echo "Usage: /etc/init.d/xyserver {start|stop|restart|reload|default}"
        ;;
esac

