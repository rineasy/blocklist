import fetch from 'node-fetch';
import fs from 'fs-extra';
import https from 'https';

const URLS = [
    'https://trustpositif.kominfo.go.id/assets/db/domains',
    'https://trustpositif.kominfo.go.id/downloaddb/domains',
    'https://trustpositif.kominfo.go.id/database/domains'
];

const OUTPUT_FILE = 'blocked_domains.txt';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retryCount = 0) {
    try {
        console.log(`Attempting to fetch from ${url} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        const agent = new https.Agent({
            rejectUnauthorized: false,
            timeout: 10000
        });
        
        const response = await fetch(url, { 
            agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/plain,text/html,*/*'
            },
            timeout: 10000 // 10 seconds timeout
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        if (!data || data.trim().length === 0) {
            throw new Error('Empty response received');
        }

        return data;
    } catch (error) {
        console.error(`Error fetching from ${url}:`, error.message);
        
        if (retryCount < MAX_RETRIES - 1) {
            console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
            await sleep(RETRY_DELAY);
            return fetchWithRetry(url, retryCount + 1);
        }
        throw error;
    }
}

async function fetchBlockedDomains() {
    for (const url of URLS) {
        try {
            console.log(`Trying URL: ${url}`);
            const data = await fetchWithRetry(url);
            
            const domains = data.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));

            if (domains.length === 0) {
                console.log('No domains found, trying next URL...');
                continue;
            }

            console.log(`Found ${domains.length} domains`);
            console.log('Sample domains:', domains.slice(0, 5));

            await fs.writeFile(OUTPUT_FILE, domains.join('\n'));
            const stats = await fs.stat(OUTPUT_FILE);
            console.log(`File written successfully. Size: ${stats.size} bytes`);
            return; // Success, exit function
        } catch (error) {
            console.error(`Failed with URL ${url}:`, error.message);
            // Continue to next URL
        }
    }
    
    // If we get here, all URLs failed
    console.error('All URLs failed');
    process.exit(1);
}

// Run the fetcher
fetchBlockedDomains();