"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200

# @api.route('/db-esquema', methods=['GET'])
# def db_esquema():
#     result = db.engine.execute("""
#         SELECT column_name, data_type 
#         FROM information_schema.columns 
#         WHERE table_name = 'user';
#     """)
#     esquema = [{"columna": row['column_name'], "tipo": row['data_type']} for row in result]
#     return jsonify(esquema), 200

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400
    
    # si el usuario ya existe
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "El usuario ya existe"}), 400
    
    # Crear usuario con saldo de 200€
    new_user = User(email=email, password=password, is_active=True, balance=200.00)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Usuario registrado con exito",
        "balance": new_user.balance
    }), 201

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]
    return jsonify(users_list), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email y contraseña obligatorios"}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify({"error": "Datos incorrectos"}), 400
    
    return jsonify({
        "message": "Inicio de sesion correcto",
        "user": {
            "id": user.id,
            "email": user.email,
            "balance": user.balance
        }
    }), 200