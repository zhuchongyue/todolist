FROM quay.io/minio/minio

ENV MINIO_ROOT_USER=admin MINIO_ROOT_PASSWORD=admin123

VOLUME /data

CMD ["minio", "server", "/data", "--console-address", ":9090"]