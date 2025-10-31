import multiprocessing
import os


def _env_int(name: str, default: int) -> int:
    value = os.environ.get(name)
    if value is None:
        return default
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return default


cpu_count = multiprocessing.cpu_count()
default_workers = max(2, cpu_count)

# Ensure the service can handle concurrent requests by default.
workers = _env_int("GUNICORN_WORKERS", default_workers)
threads = _env_int("GUNICORN_THREADS", 2)
worker_class = "gthread"
timeout = _env_int("GUNICORN_TIMEOUT", 120)
keepalive = _env_int("GUNICORN_KEEPALIVE", 5)
