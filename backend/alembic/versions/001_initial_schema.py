"""Initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create profiles table
    op.create_table('profiles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('super_admin', 'admin', 'editor', 'viewer', name='userrole'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_default_admin', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_profiles_email'), 'profiles', ['email'], unique=True)
    op.create_index(op.f('ix_profiles_id'), 'profiles', ['id'], unique=False)

    # Create hero_scenes table
    op.create_table('hero_scenes',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('name_bn', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=False),
        sa.Column('gradient_class', sa.String(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_hero_scenes_id'), 'hero_scenes', ['id'], unique=False)

    # Create hero_content table
    op.create_table('hero_content',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('headline_en', sa.String(), nullable=False),
        sa.Column('headline_bn', sa.String(), nullable=False),
        sa.Column('subtitle_en', sa.String(), nullable=False),
        sa.Column('subtitle_bn', sa.String(), nullable=False),
        sa.Column('cta_text_en', sa.String(), nullable=False),
        sa.Column('cta_text_bn', sa.String(), nullable=False),
        sa.Column('cta_link', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_hero_content_id'), 'hero_content', ['id'], unique=False)

    # Create contact_info table
    op.create_table('contact_info',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('company_name', sa.String(), nullable=False),
        sa.Column('company_name_bn', sa.String(), nullable=False),
        sa.Column('tagline_en', sa.String(), nullable=False),
        sa.Column('tagline_bn', sa.String(), nullable=False),
        sa.Column('address_en', sa.String(), nullable=False),
        sa.Column('address_bn', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('phone_display_bn', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('working_hours_en', sa.String(), nullable=False),
        sa.Column('working_hours_bn', sa.String(), nullable=False),
        sa.Column('social_links', sa.JSON(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_contact_info_id'), 'contact_info', ['id'], unique=False)

    # Create service_options table
    op.create_table('service_options',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name_en', sa.String(), nullable=False),
        sa.Column('name_bn', sa.String(), nullable=False),
        sa.Column('description_en', sa.String(), nullable=True),
        sa.Column('description_bn', sa.String(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_service_options_id'), 'service_options', ['id'], unique=False)

    # Create blog_posts table
    op.create_table('blog_posts',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('slug', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('excerpt', sa.String(), nullable=True),
        sa.Column('featured_image', sa.String(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=False),
        sa.Column('published_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_blog_posts_id'), 'blog_posts', ['id'], unique=False)
    op.create_index(op.f('ix_blog_posts_slug'), 'blog_posts', ['slug'], unique=True)

    # Create contact_submissions table
    op.create_table('contact_submissions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('service', sa.String(), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_contact_submissions_id'), 'contact_submissions', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_contact_submissions_id'), table_name='contact_submissions')
    op.drop_table('contact_submissions')
    op.drop_index(op.f('ix_blog_posts_slug'), table_name='blog_posts')
    op.drop_index(op.f('ix_blog_posts_id'), table_name='blog_posts')
    op.drop_table('blog_posts')
    op.drop_index(op.f('ix_service_options_id'), table_name='service_options')
    op.drop_table('service_options')
    op.drop_index(op.f('ix_contact_info_id'), table_name='contact_info')
    op.drop_table('contact_info')
    op.drop_index(op.f('ix_hero_content_id'), table_name='hero_content')
    op.drop_table('hero_content')
    op.drop_index(op.f('ix_hero_scenes_id'), table_name='hero_scenes')
    op.drop_table('hero_scenes')
    op.drop_index(op.f('ix_profiles_id'), table_name='profiles')
    op.drop_index(op.f('ix_profiles_email'), table_name='profiles')
    op.drop_table('profiles')
    op.execute('DROP TYPE userrole')
