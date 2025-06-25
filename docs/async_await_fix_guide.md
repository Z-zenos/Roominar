# Async/Await Fix Guide for Roominar API

## Problem Description

The Roominar backend has several service functions marked as `async` but they are actually synchronous functions (they don't use `await` internally). This causes `TypeError: object str can't be used in 'await' expression` when these functions are called with `await` in the routes.

## Root Cause

Many service functions in `backend/services/events/` are marked as `async def` but perform only synchronous database operations using SQLModel/SQLAlchemy's synchronous API. These functions should be regular synchronous functions.

## Fixed Functions

✅ **Already Fixed:**

- `search_events` - Fixed in `backend/services/events/search_events_service.py`
- `listing_trending_events` - Fixed in `backend/services/events/listing_trending_events_service.py`

## Remaining Functions to Fix

The following functions need the same treatment (remove `async` from function definition and `await` from route calls):

### Event Service Functions (`backend/services/events/`)

- `listing_event_rank`
- `listing_event_options`
- `listing_my_events`
- `listing_recommendation_events`
- `get_draft_event`
- `get_event_detail`
- `listing_related_events`
- `create_event_bookmark`
- `delete_event_bookmark`
- `create_draft_event`
- `save_draft_event`
- `generate_event_ai`
- `publish_event`
- `listing_organization_events`
- `listing_events_timeline`
- `listing_top_organization_events`

### Route Files to Update (`backend/routes/`)

- `events.py` - Multiple await calls need removal
- `organizations.py` - Event service await calls need removal

## Fix Pattern

For each function:

1. **In Service File**: Remove `async` keyword

   ```python
   # Before
   async def function_name(params):

   # After
   def function_name(params):
   ```

2. **In Route File**: Remove `await` keyword

   ```python
   # Before
   result = await service.function_name(params)

   # After
   result = service.function_name(params)
   ```

## Test Status

✅ **Verified Working:**

- `search_events` API endpoint now works correctly
- `listing_trending_events` API endpoint now works correctly

## Quick Fix Script

To fix all remaining functions at once, you can run this pattern for each service file:

```bash
# Remove async from service functions (be careful with regex)
sed -i 's/^async def \(.*\):/def \1:/' backend/services/events/*.py

# Remove await from route calls (manual verification recommended)
sed -i 's/await events_service\./events_service\./g' backend/routes/events.py
sed -i 's/await events_service\./events_service\./g' backend/routes/organizations.py
```

**⚠️ Warning**: Manual verification is recommended for each change to ensure no truly async functions are affected.

## Future Prevention

1. **Code Review**: Check that functions marked as `async` actually use `await`
2. **Linting Rules**: Consider adding ESLint-style rules for Python to catch this pattern
3. **Type Hints**: Use proper return type hints to make async vs sync clear

## Notes

- The linter errors visible in the output are pre-existing SQLAlchemy type annotation issues and are not related to the async/await fix
- The caching decorators work correctly with both sync and async functions
- Rate limiting middleware is unaffected by these changes

## Example Complete Fix

Here's an example of a complete fix for one function:

**Before** (`backend/services/events/listing_event_rank_service.py`):

```python
async def listing_event_rank(db: Session):
    # synchronous code here
    return results
```

**After** (`backend/services/events/listing_event_rank_service.py`):

```python
def listing_event_rank(db: Session):
    # synchronous code here
    return results
```

**Route Update** (`backend/routes/events.py`):

```python
# Before
events = await events_service.listing_event_rank(db)

# After
events = events_service.listing_event_rank(db)
```

This fix resolves the `TypeError` and ensures proper function execution.
