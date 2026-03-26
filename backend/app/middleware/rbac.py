from fastapi import Request, HTTPException
from app.core.security import verify_token

def rbac_required(allowed_roles: list):
    def decorator(func):
        async def wrapper(*args, request: Request, **kwargs):
            auth_header = request.headers.get("Authorization")

            if not auth_header:
                raise HTTPException(status_code=403, detail="Missing token")

            token = auth_header.split(" ")[1]

            payload = verify_token(token)
            user_role = payload.get("role")

            if user_role not in allowed_roles:
                raise HTTPException(status_code=403, detail="Access denied")

            return await func(*args, request=request, **kwargs)
        return wrapper
    return decorator