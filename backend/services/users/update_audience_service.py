from sqlmodel import Session, delete, select

from backend.core.constants import TagAssociationEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.user import User
from backend.schemas.user import UpdateUserRequest
from backend.utils.database import save


async def update_audience(
    db: Session, current_user: User, request: UpdateUserRequest
) -> User:
    try:
        for attr, value in request:
            if attr != "tags" and value is not None:
                setattr(current_user, attr, value)

        db.exec(
            delete(TagAssociation).where(
                TagAssociation.entity_id == current_user.id,
                TagAssociation.entity_code == TagAssociationEntityCode.USER,
            )
        )

        if request.tags:
            tags = db.exec(select(Tag.id).where(Tag.id.in_(request.tags))).all()
            if (not tags) or (len(request.tags) != len(tags)):
                raise BadRequestException(
                    ErrorCode.ERR_TAG_NOT_FOUND, ErrorMessage.ERR_TAG_NOT_FOUND
                )
            user_tags = [
                TagAssociation(
                    entity_id=current_user.id,
                    tag_id=tag,
                    entity_code=TagAssociationEntityCode.USER,
                )
                for tag in request.tags
            ]
            db.add_all(user_tags)

        current_user.updated_by = current_user.id
        current_user = save(db, current_user)
        return current_user

    except Exception as e:
        db.rollback()
        raise e
