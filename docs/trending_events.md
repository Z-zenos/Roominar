## FEATURE: Tính năng hiển thị sự kiện đang hot (Trending)

Để xây dựng khu vực "Sự kiện đang hot" trên trang chủ, hệ thống cần có khả năng xác định những sự kiện đang thu hút sự chú ý và tương tác nhiều nhất từ người dùng trong một khoảng thời gian gần đây. Giải pháp sẽ tập trung vào phương pháp chấm điểm dựa trên các luật xác định trước (rule-based score), kết hợp với việc phân tích hành vi người dùng trong cơ sở dữ liệu.

Cụ thể, mỗi sự kiện sẽ được tính một điểm số tổng hợp gọi là hotness score, phản ánh mức độ quan tâm thực tế của cộng đồng người dùng dành cho sự kiện đó. Điểm số này được tính toán từ các chỉ số tương tác chính, bao gồm: số lượt xem (view), số lượt bookmark, số lượng vé đã bán ra, số lượt chia sẻ (share), tốc độ tăng trưởng tương tác (growth score), và mức độ gần đến thời gian bắt đầu sự kiện (time bonus). Công thức được sử dụng như sau:

hotness_score = (view_count × 1.0) + (bookmark_count × 2.0) + (ticket_sold_count × 3.0) + (share_count × 2.0) + (growth_score × 2.0) + time_bonus

Trong đó:
• View count: số lượt người dùng truy cập vào trang chi tiết của sự kiện, phản ánh mức độ quan tâm ban đầu.
• Bookmark count: thể hiện ý định ghi nhớ hoặc quay lại sự kiện của người dùng.
• Ticket sold count: thể hiện sự cam kết rõ ràng của người dùng đối với sự kiện.
• Share count: đánh giá khả năng lan truyền và mức độ cộng đồng của sự kiện, thông qua hành vi chia sẻ.
• Growth score: phản ánh tốc độ gia tăng tương tác gần đây, bằng cách so sánh lượt xem trong 3 ngày gần nhất với 4 ngày trước đó.
• Time bonus: điểm cộng thêm cho các sự kiện sắp diễn ra trong vòng 5 ngày tới, nhằm tăng khả năng tiếp cận đúng lúc cho người dùng.

Việc tính toán hotness score chỉ áp dụng cho các sự kiện vẫn còn hiệu lực (chưa diễn ra và còn khả năng đăng ký), đồng thời giới hạn dữ liệu phân tích trong phạm vi 7 ngày gần nhất để đảm bảo tính thời sự. Từ điểm số tổng hợp này, hệ thống sẽ sắp xếp các sự kiện theo thứ tự giảm dần và lựa chọn ra danh sách các sự kiện đang hot nhất để hiển thị trên trang chủ.

---

## IMPLEMENTATION PLAN

### Database Model Changes

Event model đã được cập nhật với các trường đếm tự động:

- `view_count: Optional[int] = Field(default=0)` - Đếm số view
- `bookmark_count: Optional[int] = Field(default=0)` - Đếm số bookmark
- `sold_ticket_count: Optional[int] = Field(default=0)` - Đếm số vé đã bán
- `share_count: Optional[int] = Field(default=0)` - Đếm số lượt share

### API Implementation

#### 1. Route Definition

```python
# backend/routes/events.py
@router.get(
    "/trending",
    response_model=ListingTrendingEventsResponse,
    responses=public_api_responses,
)
async def listing_trending_events(
    db: Session = Depends(get_read_db),
    user: User | None = Depends(get_user_if_logged_in),
    query_params: SearchEventsQueryParams = Depends(SearchEventsQueryParams),
):
    events, total = await events_service.listing_trending_events(db, user, query_params)
    return ListingTrendingEventsResponse(
        page=query_params.page,
        per_page=query_params.per_page,
        total=total,
        data=events
    )
```

#### 2. Schema Definitions

```python
# backend/schemas/event.py

class ListingTrendingEventsResponse(PaginationResponse[SearchEventsItem]):
    pass
```

#### 3. Service Implementation Strategy

**Simplified Implementation với Event Model Counters:**

```python
# backend/services/events/listing_trending_events_service.py
async def listing_trending_events(
    db: Session,
    user: User | None,
    query_params: ListingTrendingEventsQueryParams
):
    # Base query for eligible events
    base_query = select(Event).where(
        Event.published_at.isnot(None),
        Event.status == EventStatusCode.PUBLIC,
        Event.start_at > datetime.now(timezone.utc),  # Future events only
        or_(
            Event.application_end_at > datetime.now(timezone.utc),  # Application ongoing
            Event.application_end_at > datetime.now(timezone.utc) - timedelta(days=7)  # Recently ended
        )
    )

    # Calculate growth score from UserActions (last 3 days vs previous 4 days)
    now = datetime.now(timezone.utc)
    recent_period = now - timedelta(days=3)
    older_period = now - timedelta(days=7)

    # Growth score calculation subquery
    GrowthScore = (
        select(
            UserAction.event_id,
            (
                func.count(case((UserAction.action_at >= recent_period, 1))).cast(Float) -
                func.count(case((UserAction.action_at < recent_period, 1))).cast(Float)
            ) / func.greatest(func.count(case((UserAction.action_at < recent_period, 1))), 1).label("growth_score")
        )
        .select_from(UserAction)
        .where(
            UserAction.action_type == UserActionTypeCode.VIEW,
            UserAction.action_at >= older_period,
            UserAction.event_id.isnot(None)
        )
        .group_by(UserAction.event_id)
        .subquery()
    )

    # Main query with hotness score calculation
    query = (
        select(
            Event,
            Organization.name.label("organization_name"),
            (
                Event.view_count * 1.0 +
                Event.bookmark_count * 2.0 +
                Event.sold_ticket_count * 3.0 +
                Event.share_count * 2.0 +
                func.coalesce(GrowthScore.c.growth_score, 0) * 2.0 +
                case(
                    (Event.start_at <= now + timedelta(days=1), 50),
                    (Event.start_at <= now + timedelta(days=3), 30),
                    (Event.start_at <= now + timedelta(days=5), 20),
                    else_=0
                )
            ).label("hotness_score"),
            # Check if user bookmarked this event
            func.coalesce(
                case((user and Bookmark.user_id == user.id, True), else_=False),
                False
            ).label("is_bookmarked")
        )
        .select_from(Event)
        .join(Organization, Event.organization_id == Organization.id)
        .outerjoin(GrowthScore, Event.id == GrowthScore.c.event_id)
        .outerjoin(
            Bookmark,
            and_(Event.id == Bookmark.event_id, Bookmark.user_id == user.id if user else False)
        )
        .where(base_query.whereclause)
        .order_by(text("hotness_score DESC"))
        .offset((query_params.page - 1) * query_params.per_page)
        .limit(query_params.per_page)
    )

    # Execute query and format response
    results = db.exec(query).mappings().all()

    # Get total count for pagination
    total_query = select(func.count(Event.id)).where(base_query.whereclause)
    total = db.exec(total_query).scalar()

    return results, total
```

### Performance Optimizations

#### 1. Database Indexes

```sql
-- Recommended indexes for trending functionality
CREATE INDEX idx_events_trending ON events(published_at, status, start_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_user_actions_trending ON user_actions(event_id, action_type, action_at) WHERE event_id IS NOT NULL;
CREATE INDEX idx_bookmarks_user_event ON bookmarks(user_id, event_id);
```

#### 2. Background Job for Counter Updates

Tạo background job để cập nhật counters định kỳ:

```python
# backend/schedulers/event_scheduler.py
@celery_app.task
def update_event_counters():
    """Update event counters for trending calculation"""
    # Update view_count from UserActions
    # Update bookmark_count from Bookmarks
    # Update sold_ticket_count from TicketInventory
    # Update share_count from UserActions
```

### Testing Strategy

1. **Unit Tests**: Test hotness score calculation với different scenarios
2. **Performance Tests**: Load testing với large datasets
3. **Integration Tests**: End-to-end API testing
4. **Edge Cases**: Empty data, extreme values, timezone handling

### Monitoring & Analytics

- Track API response times
- Monitor trending algorithm effectiveness
- Log score distributions for tuning
- A/B test different weight configurations

### Migration Requirements

1. Add new fields to Event model
2. Create database migration script
3. Populate initial counter values from existing data
4. Set up background jobs for counter maintenance

This updated implementation takes advantage of the new counter fields in the Event model, significantly simplifying the trending calculation while maintaining accuracy and performance.
