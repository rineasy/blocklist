import fetch from 'node-fetch';
import fs from 'fs-extra';
import https from 'https';

const KOMINFO_URL = 'https://trustpositif.kominfo.go.id/assets/db/domains';
const OUTPUT_FILE = 'blocked_domains.txt';

async function fetchBlockedDomains() {
    try {
        console.log('Fetching domains from Kominfo...');
        const agent = new https.Agent({
            rejectUnauthorized: false // Note: Only use this for testing
        });
        
        const response = await fetch(KOMINFO_URL, { agent });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        const domains = data.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#')); // Remove empty lines and comments

        // Save to file
        await fs.writeFile(OUTPUT_FILE, domains.join('\n'));
        
        console.log(`Successfully saved ${domains.length} domains to ${OUTPUT_FILE}`);
        console.log('Sample of first 5 domains:');
        console.log(domains.slice(0, 5).join('\n'));

    } catch (error) {
        console.error('Error fetching domains:', error.message);
    }
}

// Run the fetcher
fetchBlockedDomains();