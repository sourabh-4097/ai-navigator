from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
import logging

class Database:
    client: AsyncIOMotorClient = None
    
    def get_db(self):
        if self.client:
            return self.client[settings.DB_NAME]
        return None
    
    def connect_to_mongo(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGO_URL, serverSelectionTimeoutMS=5000)
            # Validate connection
            self.client.server_info()
            logging.info("Connected to MongoDB successfully")
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            self.client = None
        
    def close_mongo_connection(self):
        if self.client:
            self.client.close()

db = Database()