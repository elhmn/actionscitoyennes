# ************************************************************************** #
#                                                                            #
#   Dockerfile                                                               #
#                                                                            #
#   By: elhmn <www.elhmn.com>                                                #
#             <nleme@live.fr>                                                #
#                                                                            #
#   Created: Sun Aug 26 16:16:29 2018                        by elhmn        #
#   Updated: Sun Aug 26 16:16:31 2018                        by bmbarga      #
#                                                                            #
# ************************************************************************** #

FROM mysql/mysql-server:5.7
WORKDIR /var/www/html
COPY create_tokens_table.sql .
COPY install.sh .
ARG MYSQL_ROOT_PASSWORD=test
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV DBNAME=ac_authentication
ENTRYPOINT sh install.sh ${MYSQL_ROOT_PASSWORD} ${DBNAME}
