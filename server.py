# ----------------------------------------------------
# TECH TATTVA - Local Development Server
# Supports SPA fallback, .env parsing & local JSON file updates
# ----------------------------------------------------
import http.server
import socketserver
import os
import json

PORT = 3000

# Helper to load .env variables
def load_env():
    env_vars = {}
    env_path = os.path.join(os.getcwd(), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env_vars[k.strip()] = v.strip()
    return env_vars

ENV = load_env()
ADMIN_PASSCODE = ENV.get('ADMIN_PASSCODE', 'techtattva2026')

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        url_path = self.path.split('?')[0]
        full_path = os.path.join(os.getcwd(), url_path.lstrip('/'))
        
        if not os.path.exists(full_path) and not '.' in os.path.basename(url_path):
            self.path = '/index.html'
            
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/admin':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                body = json.loads(post_data.decode('utf-8'))
                action = body.get('action')

                # Verify Passcode Action
                if action == 'verifyAuth':
                    passcode = body.get('passcode')
                    if passcode == ADMIN_PASSCODE:
                        response = {"success": True, "message": "Authenticated successfully"}
                        self.send_response(200)
                    else:
                        response = {"success": False, "message": "Incorrect passcode"}
                        self.send_response(401)
                    
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return

                # Save Data Action
                if action == 'saveData':
                    events = body.get('events')
                    announcements = body.get('announcements')

                    if events is not None:
                        events_path = os.path.join(os.getcwd(), 'data', 'events.json')
                        with open(events_path, 'w', encoding='utf-8') as f:
                            json.dump(events, f, indent=2, ensure_ascii=False)

                    if announcements is not None:
                        ann_path = os.path.join(os.getcwd(), 'data', 'announcements.json')
                        with open(ann_path, 'w', encoding='utf-8') as f:
                            json.dump(announcements, f, indent=2, ensure_ascii=False)

                    response = {"success": True, "message": "Saved changes directly to local JSON files!"}
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return

            except Exception as e:
                response = {"success": False, "error": str(e)}
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SPARequestHandler) as httpd:
        print(f"Tech Tattva local server running on http://localhost:{PORT}")
        httpd.serve_forever()
