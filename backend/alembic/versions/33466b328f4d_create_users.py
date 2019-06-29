"""create users

Revision ID: 33466b328f4d
Revises: b6e66f4b055f
Create Date: 2019-06-29 15:49:27.701241

"""
from alembic import op
import sqlalchemy as sa

import os

import load_env
from src.repos.user import encrypt_password


# revision identifiers, used by Alembic.
revision = '33466b328f4d'
down_revision = 'b6e66f4b055f'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()

    email = os.environ.get('ADMIN_EMAIL')
    password = encrypt_password(os.environ.get('ADMIN_PASSWORD'))

    conn.execute(
        f"""
            INSERT INTO \"user\" (id,email,name,password,group_id) 
            VALUES (1,'{email}','Admin','{password}',3);
        """
    )


def downgrade():
    conn = op.get_bind()

    conn.execute("""
        DELETE FROM "user"
        WHERE id=1;
    """)

