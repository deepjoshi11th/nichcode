"""Configuration and Supabase client setup."""
import os
from supabase import create_client, Client


SUPABASE_URL: str = str(os.environ.get("SUPABASE_URL"))
SUPABASE_KEY: str = str(os.environ.get("SUPABASE_SECRET_KEY"))
SUPABASE_SERVICE_ROLE_KEY: str = str(os.environ.get("SUPBASE_SERVICE_ROLE_KEY"))
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
