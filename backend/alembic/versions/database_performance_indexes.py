"""Add comprehensive database indexes for performance optimization

Revision ID: database_performance_indexes
Revises: previous_migration
Create Date: 2024-01-15 10:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision: str = "database_performance_indexes"
down_revision: Union[str, None] = "b0400a0e91d6"  # Update this to latest migration
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Add comprehensive indexes for performance optimization
    Based on query analysis of the Roominar application
    """

    # ==== EVENTS TABLE INDEXES ====
    # Most frequently queried table with complex filtering patterns

    # 1. Organization-based queries (very common)
    op.create_index("idx_events_organization_id", "events", ["organization_id"])

    # 2. Status and published date for public events listing
    op.create_index("idx_events_status_published", "events", ["status", "published_at"])

    # 3. Date range queries for event scheduling
    op.create_index("idx_events_start_at", "events", ["start_at"])

    op.create_index("idx_events_end_at", "events", ["end_at"])

    # 4. Application period queries
    op.create_index(
        "idx_events_application_dates",
        "events",
        ["application_start_at", "application_end_at"],
    )

    # 5. City-based location filtering
    op.create_index("idx_events_city_code", "events", ["organize_city_code"])

    # 6. Event type filtering (online/offline)
    op.create_index("idx_events_online_offline", "events", ["is_online", "is_offline"])

    # 7. Composite index for trending/search queries
    op.create_index(
        "idx_events_trending_composite",
        "events",
        ["published_at", "status", "start_at"],
    )

    # 8. Slug lookup (already exists but ensure it's optimized)
    # op.create_index('idx_events_slug', 'events', ['slug'])  # Already exists

    # ==== USERS TABLE INDEXES ====

    # 1. Email lookup for authentication
    op.create_index("idx_users_email", "users", ["email"])

    # 2. Organization membership queries
    op.create_index("idx_users_organization_id", "users", ["organization_id"])

    # 3. Role-based queries
    op.create_index("idx_users_role_code", "users", ["role_code"])

    # 4. Token-based operations
    op.create_index("idx_users_verify_email_token", "users", ["verify_email_token"])

    op.create_index("idx_users_reset_password_token", "users", ["reset_password_token"])

    # ==== NOTIFICATIONS TABLE INDEXES ====

    # 1. Receiver-based queries (most common)
    op.create_index("idx_notifications_receiver_id", "notifications", ["receiver_id"])

    # 2. Read status filtering
    op.create_index(
        "idx_notifications_receiver_read", "notifications", ["receiver_id", "is_read"]
    )

    # 3. Creation date ordering
    op.create_index("idx_notifications_created_at", "notifications", ["created_at"])

    # 4. Composite for notification listing
    op.create_index(
        "idx_notifications_listing",
        "notifications",
        ["receiver_id", "created_at", "is_read"],
    )

    # ==== APPLICATIONS TABLE INDEXES ====

    # 1. Event-based queries
    op.create_index("idx_applications_event_id", "applications", ["event_id"])

    # 2. User-based queries
    op.create_index("idx_applications_user_id", "applications", ["user_id"])

    # 3. Email lookup
    op.create_index("idx_applications_email", "applications", ["email"])

    # 4. Creation date for ordering
    op.create_index("idx_applications_created_at", "applications", ["created_at"])

    # 5. Composite for event attendee lists
    op.create_index(
        "idx_applications_event_created", "applications", ["event_id", "created_at"]
    )

    # ==== BOOKMARKS TABLE INDEXES ====

    # 1. User bookmarks listing
    op.create_index("idx_bookmarks_user_id", "bookmarks", ["user_id"])

    # 2. Event popularity tracking
    op.create_index("idx_bookmarks_event_id", "bookmarks", ["event_id"])

    # 3. Unique constraint prevention (user can't bookmark same event twice)
    op.create_index(
        "idx_bookmarks_user_event_unique",
        "bookmarks",
        ["user_id", "event_id"],
        unique=True,
    )

    # ==== TRANSACTIONS & TRANSACTION_ITEMS INDEXES ====

    # 1. User transaction history
    op.create_index("idx_transactions_user_id", "transactions", ["user_id"])

    op.create_index("idx_transaction_items_user_id", "transaction_items", ["user_id"])

    # 2. Transaction status filtering
    op.create_index("idx_transactions_status", "transactions", ["status"])

    op.create_index("idx_transaction_items_status", "transaction_items", ["status"])

    # 3. Event-based transaction tracking
    op.create_index("idx_transaction_items_event_id", "transaction_items", ["event_id"])

    # 4. Creation date ordering
    op.create_index("idx_transactions_created_at", "transactions", ["created_at"])

    op.create_index(
        "idx_transaction_items_created_at", "transaction_items", ["created_at"]
    )

    # ==== TAG_ASSOCIATIONS TABLE INDEXES ====

    # 1. Entity-based queries (events, users, etc.)
    op.create_index(
        "idx_tag_associations_entity", "tag_associations", ["entity_code", "entity_id"]
    )

    # 2. Tag-based queries
    op.create_index("idx_tag_associations_tag_id", "tag_associations", ["tag_id"])

    # ==== USER_ACTIONS TABLE INDEXES ====

    # 1. Event analytics tracking
    op.create_index("idx_user_actions_event_id", "user_actions", ["event_id"])

    # 2. Action type filtering
    op.create_index("idx_user_actions_type", "user_actions", ["action_type"])

    # 3. Time-based analytics
    op.create_index("idx_user_actions_action_at", "user_actions", ["action_at"])

    # 4. Composite for trending calculations
    op.create_index(
        "idx_user_actions_trending",
        "user_actions",
        ["event_id", "action_type", "action_at"],
    )

    # ==== CHECK_INS TABLE INDEXES ====

    # 1. Transaction item lookup
    op.create_index(
        "idx_check_ins_transaction_item_id", "check_ins", ["transaction_item_id"]
    )

    # 2. Event-based check-in tracking
    op.create_index("idx_check_ins_event_id", "check_ins", ["event_id"])

    # 3. Check-in time ordering
    op.create_index("idx_check_ins_checked_in_at", "check_ins", ["checked_in_at"])

    # ==== USER_NOTIFICATION_TOKENS TABLE INDEXES ====

    # 1. User token lookup
    op.create_index(
        "idx_user_notification_tokens_user_id", "user_notification_tokens", ["user_id"]
    )

    # 2. FCM token cleanup
    op.create_index(
        "idx_user_notification_tokens_fcm_token",
        "user_notification_tokens",
        ["fcm_token"],
    )

    # ==== TICKETS & TICKET_INVENTORY INDEXES ====

    # 1. Event ticket lookup
    op.create_index("idx_tickets_event_id", "tickets", ["event_id"])

    op.create_index("idx_ticket_inventory_event_id", "ticket_inventory", ["event_id"])

    # 2. Ticket ordering
    op.create_index("idx_tickets_order", "tickets", ["id"])  # For ORDER BY Ticket.id

    # ==== SURVEYS & QUESTIONS INDEXES ====

    # 1. Survey ordering
    op.create_index("idx_surveys_created_at", "surveys", ["created_at"])

    # 2. Question ordering within surveys
    op.create_index(
        "idx_questions_survey_order", "questions", ["survey_id", "order_number"]
    )

    # 3. Answer ordering within questions
    op.create_index(
        "idx_answers_question_order", "answers", ["question_id", "order_number"]
    )

    # ==== SPEAKERS TABLE INDEXES ====

    # 1. Organization speakers
    op.create_index("idx_speakers_organization_id", "speakers", ["organization_id"])

    # ==== SITE_VISITS TABLE INDEXES ====

    # 1. Analytics tracking
    op.create_index("idx_site_visits_visited_at", "site_visits", ["visited_at"])

    op.create_index("idx_site_visits_user_id", "site_visits", ["user_id"])


def downgrade() -> None:
    """
    Remove all performance indexes
    """

    # Drop all indexes in reverse order
    indexes_to_drop = [
        # Site visits
        "idx_site_visits_user_id",
        "idx_site_visits_visited_at",
        # Speakers
        "idx_speakers_organization_id",
        # Surveys & Questions
        "idx_answers_question_order",
        "idx_questions_survey_order",
        "idx_surveys_created_at",
        # Tickets
        "idx_tickets_order",
        "idx_ticket_inventory_event_id",
        "idx_tickets_event_id",
        # User notification tokens
        "idx_user_notification_tokens_fcm_token",
        "idx_user_notification_tokens_user_id",
        # Check-ins
        "idx_check_ins_checked_in_at",
        "idx_check_ins_event_id",
        "idx_check_ins_transaction_item_id",
        # User actions
        "idx_user_actions_trending",
        "idx_user_actions_action_at",
        "idx_user_actions_type",
        "idx_user_actions_event_id",
        # Tag associations
        "idx_tag_associations_tag_id",
        "idx_tag_associations_entity",
        # Transactions
        "idx_transaction_items_created_at",
        "idx_transactions_created_at",
        "idx_transaction_items_event_id",
        "idx_transaction_items_status",
        "idx_transactions_status",
        "idx_transaction_items_user_id",
        "idx_transactions_user_id",
        # Bookmarks
        "idx_bookmarks_user_event_unique",
        "idx_bookmarks_event_id",
        "idx_bookmarks_user_id",
        # Applications
        "idx_applications_event_created",
        "idx_applications_created_at",
        "idx_applications_email",
        "idx_applications_user_id",
        "idx_applications_event_id",
        # Notifications
        "idx_notifications_listing",
        "idx_notifications_created_at",
        "idx_notifications_receiver_read",
        "idx_notifications_receiver_id",
        # Users
        "idx_users_reset_password_token",
        "idx_users_verify_email_token",
        "idx_users_role_code",
        "idx_users_organization_id",
        "idx_users_email",
        # Events
        "idx_events_trending_composite",
        "idx_events_online_offline",
        "idx_events_city_code",
        "idx_events_application_dates",
        "idx_events_end_at",
        "idx_events_start_at",
        "idx_events_status_published",
        "idx_events_organization_id",
    ]

    for index_name in indexes_to_drop:
        try:
            op.drop_index(index_name)
        except Exception:
            # Index might not exist, continue
            pass
