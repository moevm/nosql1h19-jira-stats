FROM centos:centos7
WORKDIR /usr/jira-stats
ARG ARG_MONGODB_HOST
ARG ARG_MONGODB_PORT
ARG ARG_MONGODB_NAME
ARG ARG_JIRA_URL
ARG ARG_JIRA_USER
ARG ARG_JIRA_PASSWORD
ENV MONGODB_HOST=$ARG_MONGODB_HOST MONGODB_PORT=$ARG_MONGODB_PORT MONGODB_NAME=$ARG_MONGODB_NAME JIRA_URL=$ARG_JIRA_URL JIRA_USER=$ARG_JIR_USER JIRA_PASSWORD=$ARG_JIRA_PASSWORD
COPY requirements.txt .
RUN yum install -y https://centos7.iuscommunity.org/ius-release.rpm && \
    yum -y update && \
    yum -y install python36u python36u-libs python36u-devel python36u-pip && \
    pip3.6 install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python3.6", "manage.py", "runserver", "-h", "0.0.0.0", "-p", "5000"]