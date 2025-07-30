# Address Normalization Implementation Guide

## Quick Start

### 1. Choose Your Provider

Based on the cost analysis, here are the recommended providers:

**For Maximum Cost Savings:**
- **Here Technologies** ($0.0005 per address)
- **Melissa Data** ($0.0015 per address for US)

**For Best Value:**
- **SmartyStreets** ($0.0025 per address, USPS-certified)

### 2. Get API Keys

#### Here Technologies (Recommended for cost)
1. Go to https://developer.here.com/
2. Create a free account
3. Create a new project
4. Get your API key

#### SmartyStreets (USPS-certified)
1. Go to https://smartystreets.com/
2. Sign up for a free trial
3. Get your API key

#### Melissa Data (Enterprise)
1. Contact sales for enterprise pricing
2. Request bulk processing capabilities

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Example

```bash
python address_normalization_example.py
```

---

## Cost Optimization Strategies

### 1. Pre-processing to Reduce API Calls

Before sending addresses to APIs, implement these filters:

```python
def preprocess_addresses(addresses: List[str]) -> List[str]:
    """Remove obvious duplicates and clean addresses before API calls"""
    cleaned = set()
    
    for addr in addresses:
        # Basic cleaning
        cleaned_addr = addr.strip().lower()
        
        # Remove common variations
        cleaned_addr = cleaned_addr.replace('street', 'st')
        cleaned_addr = cleaned_addr.replace('avenue', 'ave')
        cleaned_addr = cleaned_addr.replace('road', 'rd')
        
        # Remove extra spaces
        cleaned_addr = ' '.join(cleaned_addr.split())
        
        cleaned.add(cleaned_addr)
    
    return list(cleaned)
```

### 2. Batch Processing

Most providers offer batch APIs. Here's how to implement it:

```python
def batch_normalize(addresses: List[str], batch_size: int = 100) -> List[NormalizedAddress]:
    """Process addresses in batches to optimize API usage"""
    results = []
    
    for i in range(0, len(addresses), batch_size):
        batch = addresses[i:i + batch_size]
        batch_results = normalizer.normalize_batch(batch)
        results.extend(batch_results)
        
        # Progress tracking
        print(f"Processed {min(i + batch_size, len(addresses))}/{len(addresses)} addresses")
    
    return results
```

### 3. Hybrid Approach

Use free services for initial filtering, then paid services for final normalization:

```python
def hybrid_normalization(addresses: List[str]) -> List[NormalizedAddress]:
    """Use free services first, then paid services for remaining addresses"""
    
    # Step 1: Use free USPS API for US addresses (if applicable)
    us_addresses = filter_us_addresses(addresses)
    usps_results = normalize_with_usps(us_addresses)
    
    # Step 2: Use paid service for remaining addresses
    remaining_addresses = [addr for addr in addresses if addr not in us_addresses]
    paid_results = normalizer.normalize_batch(remaining_addresses)
    
    return usps_results + paid_results
```

---

## Production Implementation

### 1. Database Integration

```python
import sqlite3
from typing import List, Dict

class AddressDatabase:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database schema"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS addresses (
                    id INTEGER PRIMARY KEY,
                    original_address TEXT NOT NULL,
                    normalized_address TEXT,
                    confidence REAL,
                    latitude REAL,
                    longitude REAL,
                    country TEXT,
                    state TEXT,
                    city TEXT,
                    postal_code TEXT,
                    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_normalized 
                ON addresses(normalized_address)
            """)
    
    def save_normalized_addresses(self, addresses: List[NormalizedAddress]):
        """Save normalized addresses to database"""
        with sqlite3.connect(self.db_path) as conn:
            for addr in addresses:
                conn.execute("""
                    INSERT INTO addresses 
                    (original_address, normalized_address, confidence, 
                     latitude, longitude, country, state, city, postal_code)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    addr.original, addr.normalized, addr.confidence,
                    addr.latitude, addr.longitude, addr.country,
                    addr.state, addr.city, addr.postal_code
                ))
    
    def find_duplicates(self) -> List[Dict]:
        """Find duplicate addresses in the database"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("""
                SELECT normalized_address, COUNT(*) as count,
                       GROUP_CONCAT(original_address) as originals
                FROM addresses 
                WHERE normalized_address IS NOT NULL
                GROUP BY normalized_address 
                HAVING COUNT(*) > 1
            """)
            return cursor.fetchall()
```

### 2. Error Handling and Retry Logic

```python
import time
from functools import wraps

def retry_on_failure(max_retries: int = 3, delay: float = 1.0):
    """Decorator for retrying failed API calls"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise e
                    time.sleep(delay * (2 ** attempt))  # Exponential backoff
            return None
        return wrapper
    return decorator

class RobustAddressNormalizer:
    def __init__(self, api_key: str):
        self.normalizer = HereAddressNormalizer(api_key)
    
    @retry_on_failure(max_retries=3)
    def normalize_address(self, address: str) -> Optional[NormalizedAddress]:
        return self.normalizer.normalize_address(address)
```

### 3. Progress Tracking and Logging

```python
import logging
from tqdm import tqdm
import json

class ProgressTracker:
    def __init__(self, log_file: str = "normalization_progress.json"):
        self.log_file = log_file
        self.progress = self.load_progress()
    
    def load_progress(self) -> Dict:
        """Load progress from file"""
        try:
            with open(self.log_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"processed": [], "failed": [], "total": 0}
    
    def save_progress(self):
        """Save progress to file"""
        with open(self.log_file, 'w') as f:
            json.dump(self.progress, f, indent=2)
    
    def track_processing(self, addresses: List[str]):
        """Track processing progress"""
        processed = set(self.progress["processed"])
        failed = set(self.progress["failed"])
        
        # Skip already processed addresses
        remaining = [addr for addr in addresses if addr not in processed and addr not in failed]
        
        print(f"Resuming from previous run:")
        print(f"  Already processed: {len(processed)}")
        print(f"  Previously failed: {len(failed)}")
        print(f"  Remaining to process: {len(remaining)}")
        
        return remaining

def process_with_progress(addresses: List[str], normalizer) -> List[NormalizedAddress]:
    """Process addresses with progress tracking"""
    tracker = ProgressTracker()
    remaining = tracker.track_processing(addresses)
    
    results = []
    
    with tqdm(total=len(remaining), desc="Normalizing addresses") as pbar:
        for address in remaining:
            try:
                result = normalizer.normalize_address(address)
                if result:
                    results.append(result)
                    tracker.progress["processed"].append(address)
                else:
                    tracker.progress["failed"].append(address)
            except Exception as e:
                logger.error(f"Failed to process {address}: {e}")
                tracker.progress["failed"].append(address)
            
            tracker.save_progress()
            pbar.update(1)
    
    return results
```

---

## Cost Calculation Examples

### Example 1: 1 Million Addresses

**Here Technologies:**
- Cost: $0.0005 per address
- Total: $500
- Processing time: ~3-5 days (with rate limiting)

**Melissa Data:**
- Cost: $0.0015 per address  
- Total: $1,500
- Processing time: ~1-2 days (batch processing)

**SmartyStreets:**
- Cost: $0.0025 per address
- Total: $2,500
- Processing time: ~1-2 days (batch processing)

### Example 2: 10 Million Addresses

**Here Technologies:**
- Cost: $5,000
- Volume discount available: ~$3,500

**Melissa Data:**
- Cost: $15,000
- Volume discount available: ~$10,000

**SmartyStreets:**
- Cost: $25,000
- Volume discount available: ~$18,000

---

## Best Practices

### 1. Start Small
- Test with 1,000 addresses first
- Verify accuracy and cost
- Optimize your implementation

### 2. Monitor Quality
- Check confidence scores
- Review failed normalizations
- Validate results manually

### 3. Plan for Scale
- Use batch processing
- Implement proper error handling
- Set up monitoring and logging

### 4. Negotiate Pricing
- Contact providers for volume discounts
- Consider annual contracts
- Ask about enterprise pricing

---

## Next Steps

1. **Choose your provider** based on cost and requirements
2. **Get API keys** and test with small batches
3. **Implement the solution** using the provided code
4. **Monitor results** and adjust as needed
5. **Scale up** gradually to full dataset

Would you like me to help you implement this with a specific provider?