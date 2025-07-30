#!/usr/bin/env python3
"""
Address Normalization Example
Using Here Technologies API (most cost-effective for bulk processing)
"""

import requests
import json
import time
import csv
from typing import List, Dict, Optional
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class NormalizedAddress:
    """Represents a normalized address"""
    original: str
    normalized: str
    confidence: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None

class HereAddressNormalizer:
    """Address normalizer using Here Technologies API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://geocode.search.hereapi.com/v1/geocode"
        self.session = requests.Session()
        
    def normalize_address(self, address: str) -> Optional[NormalizedAddress]:
        """
        Normalize a single address using Here Technologies API
        
        Args:
            address: The address to normalize
            
        Returns:
            NormalizedAddress object or None if normalization failed
        """
        try:
            params = {
                'q': address,
                'apiKey': self.api_key,
                'limit': 1
            }
            
            response = self.session.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if not data.get('items'):
                logger.warning(f"No results found for address: {address}")
                return None
                
            item = data['items'][0]
            address_data = item['address']
            position = item.get('position', {})
            
            # Construct normalized address
            normalized_parts = []
            
            if address_data.get('houseNumber'):
                normalized_parts.append(address_data['houseNumber'])
            if address_data.get('street'):
                normalized_parts.append(address_data['street'])
            if address_data.get('city'):
                normalized_parts.append(address_data['city'])
            if address_data.get('state'):
                normalized_parts.append(address_data['state'])
            if address_data.get('postalCode'):
                normalized_parts.append(address_data['postalCode'])
            if address_data.get('countryCode'):
                normalized_parts.append(address_data['countryCode'])
                
            normalized_address = ", ".join(normalized_parts)
            
            return NormalizedAddress(
                original=address,
                normalized=normalized_address,
                confidence=item.get('scoring', {}).get('queryScore', 0.0),
                latitude=position.get('lat'),
                longitude=position.get('lng'),
                country=address_data.get('countryName'),
                state=address_data.get('state'),
                city=address_data.get('city'),
                postal_code=address_data.get('postalCode')
            )
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed for address '{address}': {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error normalizing address '{address}': {e}")
            return None
    
    def normalize_batch(self, addresses: List[str], delay: float = 0.1) -> List[NormalizedAddress]:
        """
        Normalize a batch of addresses with rate limiting
        
        Args:
            addresses: List of addresses to normalize
            delay: Delay between requests in seconds (for rate limiting)
            
        Returns:
            List of NormalizedAddress objects
        """
        results = []
        
        for i, address in enumerate(addresses):
            logger.info(f"Processing address {i+1}/{len(addresses)}: {address}")
            
            result = self.normalize_address(address)
            if result:
                results.append(result)
            
            # Rate limiting
            if i < len(addresses) - 1:  # Don't delay after the last request
                time.sleep(delay)
                
        return results

def load_addresses_from_csv(filename: str) -> List[str]:
    """Load addresses from a CSV file"""
    addresses = []
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if row:  # Skip empty rows
                addresses.append(row[0].strip())
    return addresses

def save_results_to_csv(results: List[NormalizedAddress], filename: str):
    """Save normalized addresses to CSV file"""
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'Original Address',
            'Normalized Address', 
            'Confidence',
            'Latitude',
            'Longitude',
            'Country',
            'State',
            'City',
            'Postal Code'
        ])
        
        for result in results:
            writer.writerow([
                result.original,
                result.normalized,
                result.confidence,
                result.latitude,
                result.longitude,
                result.country,
                result.state,
                result.city,
                result.postal_code
            ])

def create_deduplication_key(normalized_address: NormalizedAddress) -> str:
    """
    Create a deduplication key from normalized address
    This allows you to identify duplicate addresses
    """
    # Create a standardized key for comparison
    parts = [
        normalized_address.normalized.lower(),
        str(normalized_address.latitude) if normalized_address.latitude else '',
        str(normalized_address.longitude) if normalized_address.longitude else '',
        normalized_address.postal_code or '',
        normalized_address.city or '',
        normalized_address.state or ''
    ]
    
    return "|".join(parts)

def find_duplicates(results: List[NormalizedAddress]) -> Dict[str, List[NormalizedAddress]]:
    """
    Find duplicate addresses based on normalized form
    
    Returns:
        Dictionary mapping deduplication keys to lists of addresses
    """
    duplicates = {}
    
    for result in results:
        key = create_deduplication_key(result)
        if key not in duplicates:
            duplicates[key] = []
        duplicates[key].append(result)
    
    # Filter to only show actual duplicates (more than one address)
    return {k: v for k, v in duplicates.items() if len(v) > 1}

def main():
    """Example usage"""
    
    # You'll need to get an API key from Here Technologies
    # https://developer.here.com/
    API_KEY = "YOUR_HERE_API_KEY"  # Replace with your actual API key
    
    # Initialize the normalizer
    normalizer = HereAddressNormalizer(API_KEY)
    
    # Example addresses (your three variations)
    test_addresses = [
        "123 Main Street 90210",
        "123 Main St Beverly Hills 90210", 
        "123 MAIN ST BEVERLY HILLS"
    ]
    
    print("Normalizing test addresses...")
    results = normalizer.normalize_batch(test_addresses)
    
    print("\nResults:")
    for result in results:
        print(f"Original: {result.original}")
        print(f"Normalized: {result.normalized}")
        print(f"Confidence: {result.confidence}")
        print(f"Location: {result.latitude}, {result.longitude}")
        print("---")
    
    # Find duplicates
    duplicates = find_duplicates(results)
    
    print(f"\nFound {len(duplicates)} groups of duplicate addresses:")
    for key, address_list in duplicates.items():
        print(f"\nDuplicate group:")
        for addr in address_list:
            print(f"  - {addr.original} -> {addr.normalized}")
    
    # Save results to CSV
    save_results_to_csv(results, "normalized_addresses.csv")
    print(f"\nResults saved to 'normalized_addresses.csv'")

if __name__ == "__main__":
    main()