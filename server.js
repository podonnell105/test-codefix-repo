const http = require('http');
const fs = require('fs');
const path = require('path');

// Sample event data
let events = [
    { id: 1, title: 'Team Meeting', date: '2024-01-15', time: '10:00 AM', description: 'Weekly team sync' },
    { id: 2, title: 'Project Demo', date: '2024-01-20', time: '2:00 PM', description: 'Showcase new features' },
    { id: 3, title: 'Code Review', date: '2024-01-25', time: '11:00 AM', description: 'Review latest changes' },
    { id: 4, title: 'Client Presentation', date: '2024-01-30', time: '3:00 PM', description: 'Present to stakeholders' }
];

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve static files
    if (url === '/' || url === '/index.html') {
        serveFile('index.html', 'text/html', res);
    } else if (url === '/style.css') {
        serveFile('style.css', 'text/css', res);
    } else if (url === '/script.js') {
        serveFile('script.js', 'text/javascript', res);
    }
    // API endpoints
    else if (url === '/api/events' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(events));
    } else if (url === '/api/events' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newEvent = JSON.parse(body);
                newEvent.id = events.length + 1;
                events.push(newEvent);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newEvent));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (url.startsWith('/api/events/') && method === 'DELETE') {
        const eventId = parseInt(url.split('/')[3]);
        events = events.filter(event => event.id !== eventId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Event deleted' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

function serveFile(filename, contentType, res) {
    fs.readFile(path.join(__dirname, filename), (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 