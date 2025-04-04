from backend.core import redis_client
from backend.core.kafka_client import get_kafka_consumer

consumer = get_kafka_consumer()

for message in consumer:
    data = message.value
    transaction_id = data.get("transaction_id")
    status = data.get("status")

    session_token = redis_client.redis_client.get(f"session:{transaction_id}")

    if session_token:
        redis_client.redis_client.set(f"session_status:{session_token}", status)
        print(f"Updated session {session_token} with status {status}")
    else:
        print(f"Transaction {transaction_id} not found in session mapping.")
