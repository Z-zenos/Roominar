from typing import Any

import google.generativeai as genai
from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.exception import BadRequestException
from backend.models import Tag, User
from backend.schemas.event import GenerateEventAIRequest
from backend.utils.logger import logger
from backend.utils.parse_gemini_json_response import parse_gemini_json_response

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


async def generate_event_description(
    request: GenerateEventAIRequest,
) -> dict[str, Any]:
    """
    Generate a detailed event description using Gemini 2.0 Flash.

    Args:
        request: The event generation request

    Returns:
        A dictionary containing the structured event details
    """
    try:
        # Create Gemini model
        model = genai.GenerativeModel("gemini-2.0-flash-lite")

        # Format event duration in hours and minutes
        duration = request.end_at - request.start_at
        duration_hours = duration.total_seconds() // 3600
        duration_minutes = (duration.total_seconds() % 3600) // 60
        duration_text = (
            f"{int(duration_hours)} giờ {int(duration_minutes)} phút"
            if duration_minutes
            else f"{int(duration_hours)} giờ"
        )

        # Format tags
        tags_text = ", ".join(request.tags) if request.tags else "không có"

        # Construct an optimized prompt
        prompt = f"""
            Bạn là một chuyên gia viết nội dung sự kiện với nhiều năm kinh nghiệm trong lĩnh vực marketing và tổ chức sự kiện tại Việt Nam.

            # THÔNG TIN SỰ KIỆN
            - Tên đề xuất: {request.name}
            - Hình thức: {" ".join(filter(None, ["Trực tuyến" if request.is_online else None, "Trực tiếp" if request.is_offline else None]))}
            - Địa điểm: {request.organize_address if request.is_offline else ""}
            - Thời gian diễn ra: {request.start_at.strftime('%d/%m/%Y %H:%M')} → {request.end_at.strftime('%d/%m/%Y %H:%M')} ({duration_text})
            - Đăng ký từ: {request.application_start_at.strftime('%d/%m/%Y %H:%M')} đến {request.application_end_at.strftime('%d/%m/%Y %H:%M')}
            - Giá vé: {"Miễn phí" if request.price == 0 else f"{request.price:,} VND"}
            - Số lượng vé: {request.total_ticket_number} vé
            - Tag liên quan: {tags_text}

            # YÊU CẦU NỘI DUNG
            Hãy tạo nội dung sự kiện hoàn chỉnh với các thành phần sau:

            1. **Tên sự kiện** - Đề xuất tên sự kiện thu hút, chuyên nghiệp (có thể giữ nguyên hoặc cải tiến từ tên đề xuất)

            2. **Mô tả sự kiện** - Viết mô tả sự kiện hấp dẫn, cung cấp đầy đủ thông tin về:
               - Lý do tổ chức và giá trị của sự kiện
               - Đối tượng nên tham gia
               - Lợi ích khi tham gia sự kiện
               - Nội dung chính và điểm nổi bật
               - Thông tin đăng ký và liên hệ

               *Định dạng: Sử dụng HTML đơn giản (thẻ <p>, <strong>, <ul>, <li>, <h3>, v.v.) và emoji phù hợp để tăng tính sinh động*

            3. **Lịch trình khuyến nghị** - Chi tiết các hoạt động chính theo khung giờ
               (Chỉ cần nếu sự kiện kéo dài trên 2 giờ)

            4. **5 hashtag gợi ý** - Các hashtag phổ biến, phù hợp với chủ đề sự kiện

            # YÊU CẦU ĐỊNH DẠNG
            Phản hồi dưới dạng JSON với cấu trúc chính xác như sau:
            ```json
            {{
                "title": "Tên sự kiện đầy đủ",
                "description": "<p>Nội dung mô tả sự kiện với HTML đơn giản</p>",
                "recommended_schedule": [
                    {{
                        "time": "09:00 - 09:30",
                        "activity": "Đón tiếp khách mời và đăng ký 📋"
                    }},
                    {{
                        "time": "09:30 - 10:00",
                        "activity": "Khai mạc và giới thiệu 🎤"
                    }}
                ],
                "suggested_tags": ["#TagVíDụ1", "#TagVíDụ2", "#TagVíDụ3", "#TagVíDụ4", "#TagVíDụ5"]
            }}
            ```

            Lưu ý: Sử dụng tiếng Việt, tạo nội dung chất lượng cao, chuyên nghiệp, phù hợp với văn hóa Việt Nam và ngành tổ chức sự kiện.
        """

        # Generate content and handle response
        response = model.generate_content(prompt)

        # Look for JSON content (sometimes Gemini might include explanatory text)
        event_data = parse_gemini_json_response(
            response_text=response.text,
            required_fields=["title", "description"],
            default_values={
                "title": request.name,
                "description": f"<p>Tham gia sự kiện {request.name}! Chi tiết sẽ được cập nhật sớm.</p>",
                "recommended_schedule": [],
                "suggested_tags": [],
            },
            entity_name=f"event '{request.name}'",
        )

        return event_data

    except Exception as e:
        logger.exception("Error generating event description with Gemini: %s", str(e))
        return {
            "title": request.name,
            "description": f"<p>Tham gia sự kiện {request.name}! Chi tiết sẽ được cập nhật sớm.</p>",
            "recommended_schedule": [],
            "suggested_tags": [],
        }


async def generate_event_ai(
    db: Session, organizer: User, request: GenerateEventAIRequest
) -> dict[str, Any]:
    """
    Generate an AI-enhanced event based on user request.

    Args:
        db: Database session
        organizer: User creating the event
        request: Event generation request data

    Returns:
        Dictionary with the event details and AI-generated content

    Raises:
        BadRequestException: When tag validation fails
        Exception: On other errors
    """
    try:
        # Get tag names for better description generation
        if request.tags:
            tags = db.exec(select(Tag.name).where(Tag.id.in_(request.tags))).all()
            request.tags = [tag for tag in tags]

        # Generate AI description
        event_data = await generate_event_description(request)

        # Create a new event with AI-generated content
        # You can implement this part based on your application needs
        # event = Event(
        #    name=event_data["title"],
        #    description=event_data["description"],
        #    # ... other fields
        # )
        # db.add(event)
        # db.commit()

        # Return the AI-generated event data
        return event_data

    except BadRequestException as e:
        raise e
    except Exception as e:
        logger.exception("Error in generate_event_ai: %s", str(e))
        raise e
