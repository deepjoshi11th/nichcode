"""Authentication endpoints."""
from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import HTMLResponse
from .models import SignupRequest, LoginRequest, UserResponse
from .config import supabase, supabase_admin
from .dependencies import get_current_user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=dict)
async def signup(request_body: SignupRequest, request: Request):
    """
    Sign up with email and password.
    """
    try:
        redirect_url = str(request.url).replace("signup", "callback")
        response = supabase.auth.sign_up({
            "email": request_body.email,
            "password": request_body.password,
            "options": {
                "email_redirect_to": redirect_url
            }
        })
        return {
            "user": {
                "id": response.user.id,
                "email": response.user.email,
            },
            "session": {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
            } if response.session else None,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {str(e)}",
        )

@router.get("/callback")
async def signup_callback_proxy():
    # We return a tiny HTML/JS script. 
    # The browser runs this, reads the '#', and redirects to our second endpoint with a '?'
    html_content = """
    <!DOCTYPE html>
    <html>
    <head><title>Authenticating...</title></head>
    <body>
        <script src="/js/client.js"></script>
        <script src="/js/auth.js"></script>
        <script>
            async function handler() {
                debugger;
                const hash = window.location.hash.substring(1);
                if (hash) {
                    const result = await AUTH.handleProcesssAuth(hash);
                    if (result.success) {
                        window.location.href = "/"
                    } else {
                        alert("Please refresh and login again.")
                    }
                }
            }
            handler()
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.get("/process")
async def signup_callback(request:Request):
    """
    Handle Supabase email confirmation callback.
    Processes the authentication tokens from Supabase redirect.
    """
    try:
        # Extract tokens from URL parameters
        token = request.query_params.get("access_token")
        token_type = request.query_params.get("type")
        
        if not token or token_type != "signup":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid callback parameters"
            )

        return {
            "session": {
                "access_token": request.query_params.get("access_token"),
                "refresh_token": request.query_params.get("refresh_token"),
            }
        }            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Callback processing failed: {str(e)}"
        )


@router.post("/login", response_model=dict)
async def login(request: LoginRequest):
    """
    Log in with email and password.
    """
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        return {
            "user": {
                "id": response.user.id,
                "email": response.user.email,
            },
            "session": {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
            },
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}",
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(user: dict = Depends(get_current_user)):
    """
    Get current authenticated user profile.
    """
    return UserResponse(
        id=user.id,
        email=user.email,
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint (token invalidation happens on client side).
    """
    return {"message": "Logged out successfully"}

@router.delete("/delete")
async def delete(user: dict = Depends(get_current_user)):
    """
    Delete current authenticated user account.
    """
    try:
        response = supabase_admin.auth.admin.delete_user(user.id)
    except Exception as e:      
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Account deletion failed: {str(e)}",
        )
    return {"message": "Account deleted successfully"}