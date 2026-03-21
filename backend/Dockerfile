FROM python:3.11-slim

RUN useradd -m -u 1000 user
USER user

ENV PATH="/home/user/.local/bin:$PATH"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production
ENV MODEL_DIR=/home/user/app/models
ENV HF_DATASET_REPO=aqibniazi/crime-analytics-models

WORKDIR /home/user/app

COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt huggingface_hub

COPY --chown=user . .

EXPOSE 7860

CMD python download_models.py && \
    gunicorn "app:create_app()" \
    --bind 0.0.0.0:7860 \
    --workers 1 \
    --timeout 120