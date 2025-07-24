import asyncio
import time

import pytest
from httpx import AsyncClient


@pytest.mark.performance
class TestPerf:
    @pytest.mark.asyncio
    async def test_concurrent_requests(self, async_client: AsyncClient, init_events):
        async def make_request():
            response = await async_client.get("/api/v1/events")
            return response.status_code

        start_time = time.time()
        tasks = [make_request() for _ in range(1000)]
        results = await asyncio.gather(*tasks)
        end_time = time.time()

        print(f"Time taken: {end_time - start_time} seconds")

        assert all(status == 200 for status in results)

        assert (end_time - start_time) < 5.0

    @pytest.mark.asyncio
    async def test_large_dataset_pagination(
        self, async_client: AsyncClient, init_events
    ):
        # Test pagination performance
        start_time = time.time()
        response = await async_client.get("/api/v1/events?page=1&per_page=50")
        end_time = time.time()

        assert response.status_code == 200
        data = response.json()

        print("Time taken: ", end_time - start_time)
        assert data["total"] == 100

        # Should complete quickly
        assert (end_time - start_time) < 1.0
