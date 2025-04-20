from sqlmodel import Session, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.target import Target
from backend.models.user import User
from backend.schemas.target import CreateTargetRequest
from backend.utils.database import save


async def create_target(db: Session, organizer: User, request: CreateTargetRequest):
    try:
        target = db.exec(
            select(Target).where(
                Target.name == request.name,
                Target.organization_id == organizer.organization_id,
            )
        ).one_or_none()

        if target:
            raise BadRequestException(
                ErrorCode.ERR_TARGET_ALREADY_EXISTED,
                ErrorMessage.ERR_TARGET_ALREADY_EXISTED,
            )

        target = Target(
            name=request.name,
            organization_id=organizer.organization_id,
            industry_codes=request.industry_codes,
            job_type_codes=request.job_type_codes,
        )
        target.created_by = organizer.id
        target = save(db, target)

        return target.id
    except Exception as e:
        db.rollback()
        raise e
