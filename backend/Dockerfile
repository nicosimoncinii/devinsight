FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN groupadd --system devinsight \
    && useradd --system --gid devinsight --create-home devinsight

COPY pyproject.toml README.md ./
COPY app ./app
RUN python -m pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir ".[dev]"

COPY alembic.ini ./
COPY migrations ./migrations
COPY tests ./tests

RUN chown -R devinsight:devinsight /app
USER devinsight

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
