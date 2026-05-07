from flask import Flask, request, jsonify
import sqlite3, jwt, datetime
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret123'


# ---------- DB ----------
def get_db():
    return sqlite3.connect('users.db')


def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    ''')
    conn.commit()
    conn.close()


init_db()


# ---------- AUTH ----------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Invalid token'}), 401

        return f(data, *args, **kwargs)

    return decorated


# ---------- REGISTER ----------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    username = data['username']
    password = generate_password_hash(data['password'])  # 🔐 FIXED
    role = data.get('role', 'user')

    conn = get_db()
    c = conn.cursor()

    try:
        c.execute(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            (username, password, role)
        )
        conn.commit()
        return jsonify({'message': 'User registered'})
    except:
        return jsonify({'message': 'User already exists'}), 400


# ---------- LOGIN ----------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    username = data['username']
    password = data['password']

    conn = get_db()
    c = conn.cursor()

    c.execute("SELECT * FROM users WHERE username=?", (username,))
    user = c.fetchone()

    if user and check_password_hash(user[2], password):
        token = jwt.encode({
            'user': username,
            'role': user[3],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({'token': token, 'role': user[3]})

    return jsonify({'message': 'Invalid credentials'}), 401


# ---------- ADMIN ----------
@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    if current_user['role'] != 'admin':
        return jsonify({'message': 'Access denied'}), 403

    conn = get_db()
    c = conn.cursor()

    c.execute("SELECT id, username, role FROM users")
    users = c.fetchall()

    return jsonify(users)


# ---------- RUN ----------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
