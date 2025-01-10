import fetch from 'node-fetch';
import fs from 'fs-extra';
import https from 'https';

const KOMINFO_URL = 'https://trustpositif.kominfo.go.id/assets/db/domains';
const OUTPUT_FILE = 'blocked_domains.txt';

async function fetchBlockedDomains() {
    try {
        console.log('Fetching domains from Kominfo...');
        const agent = new https.Agent({
            rejectUnauthorized: false // Required for some SSL certificates
        });
        
        console.log(`Requesting: ${KOMINFO_URL}`);
        const response = await fetch(KOMINFO_URL, { 
            agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Response received, processing data...');
        const data = await response.text();
        const domains = data.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#')); // Remove empty lines and comments

        console.log(`Found ${domains.length} domains`);
        console.log('Sample domains:', domains.slice(0, 5));

        // Save to file
        console.log(`Writing to ${OUTPUT_FILE}...`);
        await fs.writeFile(OUTPUT_FILE, domains.join('\n'));
        
        // Verify file was written
        const stats = await fs.stat(OUTPUT_FILE);
        console.log(`File written successfully. Size: ${stats.size} bytes`);

    } catch (error) {
        console.error('Error details:', error);
        process.exit(1); // Exit with error code
    }
}

// Run the fetcher
fetchBlockedDomains();