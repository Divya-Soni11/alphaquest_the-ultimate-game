import http from 'http';

const server = http.createServer((req, res) => {
  res.statusCode = 200; // Success status
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, world!\n');
});

const PORT = 3000; // Port to listen on
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
