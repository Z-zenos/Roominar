import json

from kafka import KafkaConsumer, KafkaProducer

from backend.core.config import logger, settings


def get_kafka_producer():
    return KafkaProducer(
        bootstrap_servers=f"{settings.KAFKA_BROKER_HOST}:{settings.KAFKA_BROKER_PORT}",
        api_version=(0, 10, 1),
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )


def get_kafka_consumer():
    logger.info(f"Connecting to Kafka topic: {settings.KAFKA_TOPIC}")
    try:
        kafka_consumer = KafkaConsumer(
            settings.KAFKA_TOPIC,
            bootstrap_servers=f"{settings.KAFKA_BROKER_HOST}:{settings.KAFKA_BROKER_PORT}",
            api_version=(0, 10, 1),
            value_deserializer=lambda m: json.loads(m.decode("utf-8")),
            auto_offset_reset="earliest",
        )

        logger.info(f"Connected to Kafka topic: {settings.KAFKA_TOPIC}")
        return kafka_consumer
    except Exception as e:
        logger.error(f"Failed to connect to Kafka: {e}")
        return None
