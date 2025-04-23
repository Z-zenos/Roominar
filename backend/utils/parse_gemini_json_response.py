import json
from typing import Any

from backend.utils.logger import logger


def parse_gemini_json_response(
    response_text: str,
    required_fields: list[str] = None,
    default_values: dict[str, Any] = None,
    entity_name: str = "entity",
) -> dict[str, Any]:
    """
    Parse and validate JSON response from Gemini AI.

    Args:
        response_text: The raw text response from Gemini
        required_fields: List of fields that must be present in the response
        default_values: Dictionary of default values for missing fields
        entity_name: Name of the entity for error messages
        logger: Logger instance for error reporting

    Returns:
        A dictionary containing the parsed and validated response
    """

    if required_fields is None:
        required_fields = []

    if default_values is None:
        default_values = {}

    try:
        # Look for JSON content (sometimes Gemini might include explanatory text)
        response_text = response_text.strip()

        # Try to find JSON content between backticks if present
        json_start = response_text.find("{")
        json_end = response_text.rfind("}") + 1

        if json_start >= 0 and json_end > json_start:
            json_content = response_text[json_start:json_end]

            # Parse the JSON response
            parsed_data = json.loads(json_content)

            # Validate the response has required fields
            if required_fields and not all(
                field in parsed_data for field in required_fields
            ):
                missing = [
                    field for field in required_fields if field not in parsed_data
                ]
                logger.warning(f"Missing required fields in Gemini response: {missing}")

            # Apply default values for missing fields
            result = {**default_values}
            result.update(parsed_data)

            return result
        else:
            logger.warning(
                f"Could not extract JSON from Gemini response for {entity_name}"
            )
            return default_values

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON from Gemini response: {str(e)}")
        logger.debug(f"Raw response: {response_text}")
        return default_values
    except Exception as e:
        logger.exception(f"Unexpected error parsing Gemini response: {str(e)}")
        return default_values
