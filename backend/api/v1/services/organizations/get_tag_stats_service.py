from sqlmodel import Session, text

from backend.models.user import User


async def get_tag_stats(db: Session, organizer: User):
    query = text(
        """
        WITH tags AS (
            SELECT
                t.name AS tag_name,
                COUNT(*) AS usage_count
            FROM tag_associations ta
            JOIN tags t ON ta.tag_id = t.id
            JOIN events e ON ta.entity_id = e.id
            WHERE (ta.entity_code = 'EVENT' AND e.organization_id = :org_id) OR
                  (ta.entity_code = 'ORGANIZATION' AND ta.entity_id = :org_id) AND
                    e.status = 'PUBLIC'
            GROUP BY t.name
        ),
        industry_usage AS (
            SELECT
                industry_code AS industry_name,
                COUNT(*) AS usage_count
            FROM (
                SELECT unnest(industry_codes) AS industry_code
                FROM targets
                WHERE id IN (
                    SELECT target_id
                    FROM events
                    WHERE target_id IS NOT NULL AND organization_id = :org_id AND status = 'PUBLIC'
                )
            ) AS industry_list
            GROUP BY industry_code
        ),
        job_category_usage AS (
            SELECT
                job_type_code AS job_category_name,
                COUNT(*) AS usage_count
            FROM (
                SELECT unnest(job_type_codes) AS job_type_code
                FROM targets
                WHERE id IN (
                    SELECT target_id
                    FROM events
                    WHERE target_id IS NOT NULL AND organization_id = :org_id AND status = 'PUBLIC'
                )
            ) AS job_list
            GROUP BY job_type_code
        )
        SELECT
            'TAG' AS category, t.tag_name AS name, t.usage_count
        FROM tags t
        UNION ALL
        SELECT
            'INDUSTRY' AS category, iu.industry_name AS name, iu.usage_count
        FROM industry_usage iu
        UNION ALL
        SELECT
            'JOB_CATEGORY' AS category, jc.job_category_name AS name, jc.usage_count
        FROM job_category_usage jc
        ORDER BY category, usage_count DESC;
        """
    )

    tag_stats = (
        db.exec(query, params={"org_id": organizer.organization_id}).mappings().all()
    )
    return tag_stats
