FROM python:3.11

WORKDIR /app/backend

COPY requirements.txt .

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y --fix-missing

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]

EXPOSE 8000