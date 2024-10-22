"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, session, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



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
    
    session['user_id'] = user.id
    
    return jsonify({
        "message": "Inicio de sesion correcto",
        "user": {
            "id": user.id,
            "email": user.email,
            "balance": user.balance
        }
    }), 200

@api.route('/add-funds', methods=['POST'])
def add_funds():
    if 'user_id' not in session:
        return '', 403
    
    data = request.get_json()
    amount= data.get('amount')

    if not amount or float(amount) <= 0:
        return jsonify({"error": "Cantidad no valida"}), 400

    user = User.query.get(session['user_id'])

    stripe_payment_url = "https://buy.stripe.com/test_14k9ACdnx2DQ6U8aEF"

    return jsonify({
        "message": "Redirigiendo a Stripe para procesar el pago",
        "stripe_url": stripe_payment_url
    }), 200

@api.route('/session-info', methods=['GET'])
def session_info():
    if 'user_id' in session:
        return jsonify({"message": "Sesión activa", "user_id": session['user_id']}), 200
    return jsonify({"error": "No hay sesion activa"}), 403