FROM centos:centos7
WORKDIR /usr/jira-stats
COPY requirements.txt .
RUN yum install -y https://centos7.iuscommunity.org/ius-release.rpm && \
    yum -y update && \
    yum -y install python36u python36u-libs python36u-devel python36u-pip && \
    pip3.6 install -r requirements.txt
COPY site .
EXPOSE 5000
CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:5000"]