# Database Management Commands

## Quick Reset Database (For Testing)

```bash
cd backend

# Complete database reset
python3 -c "
import asyncio
from app.config import database, engine
from app.models import Base

async def reset_db():
    await database.connect()
    print('🗑️  Dropping all tables...')
    Base.metadata.drop_all(bind=engine)
    print('🏗️  Creating fresh tables...')
    Base.metadata.create_all(bind=engine)
    await database.disconnect()
    print('✅ Database reset completed!')

asyncio.run(reset_db())
"
```

## Create Admin User

```bash
cd backend

python3 -c "
import asyncio
from app.config import database
import bcrypt
from sqlalchemy import text
import uuid

async def create_admin():
    await database.connect()
    admin_id = str(uuid.uuid4())
    hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    query = '''
    INSERT INTO profiles (id, email, full_name, role, is_default_admin, password_hash, is_active)
    VALUES (:id, :email, :full_name, :role, :is_default_admin, :password_hash, :is_active)
    '''
    
    await database.execute(query, {
        'id': admin_id,
        'email': 'admin@arotours.com',
        'full_name': 'Admin User',
        'role': 'super_admin',
        'is_default_admin': True,
        'password_hash': hashed_password,
        'is_active': True
    })
    
    print('✅ Admin user created: admin@arotours.com / admin123')
    await database.disconnect()

asyncio.run(create_admin())
"
```

## Check Database Tables

```bash
cd backend

python3 -c "
import asyncio
from app.config import database
from sqlalchemy import text

async def check_tables():
    await database.connect()
    
    # Get all table names
    query = '''
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
    '''
    
    result = await database.fetch_all(query)
    print('📋 Database Tables:')
    for row in result:
        print(f'  - {row[0]}')
    
    # Count records in each table
    for row in result:
        table_name = row[0]
        count_query = f'SELECT COUNT(*) FROM {table_name}'
        count_result = await database.fetch_one(count_query)
        print(f'  {table_name}: {count_result[0]} records')
    
    await database.disconnect()

asyncio.run(check_tables())
"
```

## Clear All Data (Keep Structure)

```bash
cd backend

python3 -c "
import asyncio
from app.config import database
from sqlalchemy import text

async def clear_data():
    await database.connect()
    
    tables = ['contact_submissions', 'blog_posts', 'flight_deals', 'umrah_packages', 'tour_packages', 'homepage_banners', 'website_settings', 'profiles']
    
    for table in tables:
        try:
            await database.execute(f'DELETE FROM {table}')
            print(f'✅ Cleared {table}')
        except Exception as e:
            print(f'⚠️  Could not clear {table}: {e}')
    
    await database.disconnect()
    print('✅ All data cleared!')

asyncio.run(clear_data())
"
```

## Backup Database (PostgreSQL)

```bash
# Create backup
pg_dump -U username -h localhost -d aro_cms_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -U username -h localhost -d aro_cms_db < backup_file.sql
```

## Migration Commands

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Check current migration
alembic current

# Show migration history
alembic history
``` 