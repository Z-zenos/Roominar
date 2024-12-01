from sqlmodel import Session, desc, func, select

from backend.core.constants import TagAssociationEntityCode
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation


async def listing_tag_rank(db: Session):
    tags = (
        db.exec(
            select(Tag.id, Tag.name, Tag.image_url)
            .outerjoin(TagAssociation, Tag.id == TagAssociation.tag_id)
            .where(
                TagAssociation.entity_code.in_(
                    TagAssociationEntityCode.USER, TagAssociationEntityCode.EVENT
                )
            )
            .group_by(Tag.id)
            .order_by(desc(func.count(Tag.id)))
            .limit(5)
        )
        .mappings()
        .all()
    )

    return tags
