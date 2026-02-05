## Setup
Assumptions in this config:<br/>
* App runs in host.
* ES, filebeat, kibana runs in docker (same docker network)
* filebeat collects logs from `$(pwd)/logs/*`

### ENV
```
ES_HOST=http://localhost:9200
ES_USER=elastic
ES_PASSWORD=MySecurePasswd

ES_HOST_KIBANA=http://elasticsearch:9200
```
`ES_HOST_KIBANA` is used so containers can communicate with each other.

### docker-compose.yml
```yml
version: '3.3'

services:
  elasticsearch:
    container_name: MYAPP-elasticsearch
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.3
    environment:
      - ELASTIC_PASSWORD=${ES_PASSWORD:-}
      - xpack.security.enabled=true
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms256m -Xmx256m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    cap_add:
      - IPC_LOCK
    volumes:
      - MYAPP_elastic_data:/usr/share/elasticsearch/data
#      - ./elasticsearch/data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
      - "9300:9300"
    networks:
      - MYAPP

  # One-off: set kibana_system password so Kibana can connect (Kibana 8.x cannot use elastic).
  setup-kibana-user:
    image: curlimages/curl:latest
    container_name: MYAPP-setup-kibana-user
    environment:
      - ES_PASSWORD=${ES_PASSWORD:-}
      - ES_HOST_KIBANA=${ES_HOST_KIBANA:-http://elasticsearch:9200}
    networks:
      - MYAPP
    depends_on:
      - elasticsearch
    restart: "no"
    command:
      - sh
      - -c
      - |
        ES_BASE=$${ES_HOST_KIBANA%/}
        until curl -sf -u "elastic:$$ES_PASSWORD" "$$ES_BASE/_cluster/health" 2>/dev/null; do echo waiting for Elasticsearch...; sleep 3; done
        curl -sf -X POST -u "elastic:$$ES_PASSWORD" "$$ES_BASE/_security/user/kibana_system/_password" \
          -H "Content-Type: application/json" \
          -d '{"password":"'"$$ES_PASSWORD"'"}'
        echo kibana_system password set

  kibana:
    container_name: MYAPP-kibana
    image: docker.elastic.co/kibana/kibana:8.5.3
    restart: unless-stopped
    environment:
      - ELASTICSEARCH_HOSTS=${ES_HOST_KIBANA:-http://elasticsearch:9200}
      # Kibana 8.x cannot use "elastic"; must use kibana_system. Set its password in ES then set KIBANA_ES_PASSWORD (or same as ES_PASSWORD if you set kibana_system to match).
      - ELASTICSEARCH_USERNAME=${ES_USER_KIBANA:-kibana_system}
      - ELASTICSEARCH_PASSWORD=${ES_PASSWORD:-${ES_PASSWORD}}
    ports:
      - "5601:5601"
    networks:
      - MYAPP
    depends_on:
      - elasticsearch
      - setup-kibana-user
  
  filebeat:
    container_name: MYAPP-filebeat
    image: docker.elastic.co/beats/filebeat:8.5.3
    restart: unless-stopped
    user: root
    environment:
      - ES_HOST_KIBANA=${ES_HOST_KIBANA:-http://elasticsearch:9200}
      - ES_USER=${ES_USER:-elastic}
      - ES_PASSWORD=${ES_PASSWORD:-}
      - NODE_NAME=MYAPP-filebeat
      - FILEBEAT_LOG_LEVEL=${FILEBEAT_LOG_LEVEL:-info}
    configs:
      - source: filebeat_config
        target: /usr/share/filebeat/filebeat.yml
    # Filebeat requires config file to be owned by root; Docker configs may not be. Copy and chown.
    command: ["sh", "-c", "cp /usr/share/filebeat/filebeat.yml /tmp/filebeat.yml && chown root:root /tmp/filebeat.yml && exec filebeat -e -c /tmp/filebeat.yml"]
    volumes:
      - filebeat_data:/usr/share/filebeat/data
      # Use case 1 & 2: app on host → bind mount (default)
      - ${FILEBEAT_LOG_PATH:-./logs}:/usr/share/filebeat/logs:ro
      # Use case 3 (Gunicorn in Docker): comment line above and use shared volume instead:
      # - MYAPP_logs:/usr/share/filebeat/logs:ro
    networks:
      - MYAPP

configs:
  filebeat_config:
    file: ./filebeat.yml

volumes:
  MYAPP_elastic_data:
  filebeat_data:

networks:
  MYAPP:
    driver: bridge
```

### django logging
```py
#settings.py
...
MIDDLEWARE = [
    'apps.logging.middleware.RequestIdMiddleware',
    ...
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    ...
    'apps.logging.middleware.LoggingContextMiddleware',
    ...
]
...
def _logging_handlers():
    handlers = {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
            'filters': ['request_id'],
            'stream': 'ext://sys.stdout',
        },
        'console_stderr': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
            'filters': ['request_id'],
            'stream': 'ext://sys.stderr',
            'level': 'WARNING',
        },
        'null': {
            'class': 'logging.NullHandler',
        },
    }
    # Always log to file (FILEBEAT_LOG_PATH or default 'logs'); also always log to console
    filebeat_log_path = (os.environ.get('FILEBEAT_LOG_PATH') or 'logs').strip()
    log_dir = os.path.join(BASE_DIR, filebeat_log_path) if not os.path.isabs(filebeat_log_path) else filebeat_log_path
    os.makedirs(log_dir, exist_ok=True)
    handlers['file'] = {
        'class': 'logging.FileHandler',
        'formatter': 'json',
        'filters': ['request_id'],
        'filename': os.path.join(log_dir, 'app.json'),
        'mode': 'a',
        'encoding': 'utf-8',
    }
    return handlers


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': 'apps.logging.formatters.JsonFormatter',
        },
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'filters': {
        'request_id': {
            '()': 'apps.logging.filters.RequestIdFilter',
        },
    },
    'handlers': _logging_handlers(),
    'root': {
        'handlers': ['console', 'console_stderr', 'file'],
        'level': 'DEBUG',
    },
    'loggers': {
        'celery': {
            'handlers': ['console', 'console_stderr', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.security.DisallowedHost': {
            'handlers': ['null'],
            'propagate': False,
        },
    },
}
```
use `apps.logging` or any request-id package to include request-id on logs. otherwise drop this part from logging config filters 

### kibana.yml
```yml
# Filebeat config for Django JSON logs. ES connection via env: ES_HOST, ES_USER, ES_PASSWORD
#
# Use cases (same idea: Django writes JSON to a file, Filebeat tails it):
#   1. Local dev (runserver)     → LOGGING file handler to ./logs/app.json ; Filebeat mounts ./logs
#   2. Gunicorn + PM2            → same file handler; PM2 cwd or log path under ./logs or /var/log/MYAPP
#   3. Gunicorn in Docker        → app writes to a volume; Filebeat mounts same volume (see compose)

filebeat.inputs:
  - type: log
    id: MYAPP-json-logs
    enabled: true
    paths:
      - /usr/share/filebeat/logs/*.json
      - /usr/share/filebeat/logs/*.log
    json.keys_under_root: true
    json.add_error_key: true
    json.message_key: message
    # Optional: drop empty or non-JSON lines from mixed streams
    # exclude_lines: ['^$']
    fields:
      app: MYAPP
    fields_under_root: true

filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false

processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded

output.elasticsearch:
  hosts: ["${ES_HOST_KIBANA}"]
  username: ${ES_USER}
  password: ${ES_PASSWORD}
  index: "MYAPP-logs-%{+yyyy.MM.dd}"

# Required when using a custom index name
setup.ilm.enabled: false
setup.template.name: "MYAPP-logs"
setup.template.pattern: "MYAPP-logs-*"

logging.level: info
logging.to_stderr: true
logging.to_files: false
```

### Run in browser:
* Go to `http://localhost:5601` and login using `elastic` user and password
* Go to `Discover`. If filebeat can reach Elastic you'll see logs.
* From the left bar search and select columns, eg: message, request_id, user, email etc.
* From the top search bar kibana search syntax will help you filter logs.
* request_id helps visualize all the logs written in a single HTTP request and with a timestamped waterfall view.

### TBD
* timestapped request_id based waterfall view along with graph.

