from flask import Blueprint, request, jsonify, session
from api.models import db, User
from datetime import datetime, timedelta
import re

auth = Blueprint('auth', __name__)

# RUTA DE REGISTRO
@auth.route('/register', methods=['POST'])
def register():
    # Obtener los datos del email, password, username y fecha de nacimiento
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    birthdate_str = data.get('birthdate')  # Fecha de nacimiento en formato YYYY-MM-DD

    # Validar que se envíen todos los campos requeridos
    if not email or not password or not username or not birthdate_str:
        return jsonify({"error": "Email, contraseña, nombre de usuario y fecha de nacimiento son obligatorios"}), 400

    # Verificar si tanto el email como el nombre de usuario ya existen
    existing_user = User.query.filter_by(email=email).first()
    existing_username = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "El correo electrónico ya está registrado"}), 400
    if existing_username:
        return jsonify({"error": "El nombre de usuario ya está en uso"}), 400

    # Validación de la contraseña: mínimo 6 caracteres y al menos un número
    if len(password) < 6 or not re.search(r'\d', password):
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres y contener un número"}), 400

    # Verificar que el usuario sea mayor de 18 años
    birthdate = datetime.strptime(birthdate_str, "%Y-%m-%d")
    age = (datetime.now() - birthdate) // timedelta(days=365.25)
    if age < 18:
        return jsonify({"error": "Debes ser mayor de 18 años para registrarte"}), 400

    # Crear el usuario con un saldo inicial de 200€
    new_user = User(email=email, password=password, username=username, is_active=True, balance=200.00, birthdate=birthdate)
    db.session.add(new_user)
    db.session.commit()

    # Usuario registrado exitosamente
    return jsonify({
        "message": "Usuario registrado con éxito",
        "balance": new_user.balance
    }), 201


# RUTA DE INICIO DE SESIÓN
@auth.route('/login', methods=['POST'])
def login():
    # Obtener los datos del nombre de usuario y contraseña
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Validar que se envíen el nombre de usuario y la contraseña
    if not username or not password:
        return jsonify({"error": "Usuario y contraseña obligatorios"}), 400

    # Verificar si el usuario existe y si la contraseña es correcta
    user = User.query.filter_by(username=username).first()
    if not user or user.password != password:
        # Datos equivocados
        return jsonify({"error": "Datos incorrectos"}), 400

    # Iniciar sesión: guardar el id del usuario en la sesión
    session['user_id'] = user.id

    # Inicio de sesión exitoso, devolver la información del usuario
    return jsonify({
        "message": "Inicio de sesión correcto",
        "user": {
            "id": user.id,
            "username": user.username,  # Devuelve el username en la respuesta de login
            "email": user.email,
            "balance": user.balance
        }
    }), 200


# RUTA DE CIERRE DE SESIÓN
@auth.route('/logout', methods=['POST'])
def logout():
    # Limpiar toda la sesión en el servidor
    session.clear()
    return jsonify({"message": "Sesión cerrada"}), 200


# RUTA PARA COMPROBAR SI LA SESIÓN ESTÁ INICIADA Y OBTENER EL BALANCE ACTUALIZADO
@auth.route('/session-info', methods=['GET'])
def session_info():
    # Verificar si el usuario tiene una sesión activa
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            # Retorna la información de la sesión con el balance actualizado
            return jsonify({
                "message": "Sesión activa",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "balance": user.balance
                }
            }), 200
        return jsonify({"error": "Usuario no encontrado"}), 404
    # No hay sesión activa
    return jsonify({"error": "No hay sesión"}), 403
