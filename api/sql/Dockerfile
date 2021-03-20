# ************************************************************************** #
#                                                                            #
#   Dockerfile                                                               #
#                                                                            #
#   By: elhmn <www.elhmn.com>                                                #
#             <nleme@live.fr>                                                #
#                                                                            #
#   Created: Sun Aug 26 16:15:26 2018                        by elhmn        #
#   Updated: Sun Aug 26 16:15:29 2018                        by bmbarga      #
#                                                                            #
# ************************************************************************** #

FROM mysql/mysql-server:5.7
WORKDIR /var/www/html
COPY actions_citoyennes.sql .
COPY install.sh .
ARG MYSQL_ROOT_PASSWORD=test
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV DBNAME=actions_citoyennes
ENTRYPOINT sh install.sh ${MYSQL_ROOT_PASSWORD} ${DBNAME}
