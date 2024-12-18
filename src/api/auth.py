from flask import Blueprint, request, jsonify, session
from api.models import db, User
import re

auth = Blueprint('auth', __name__)

# RUTA DE REGISTRO
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Obtener los datos del email, password y username
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')  # Obtener el nombre de usuario

    if not email or not password or not username:
        return jsonify({"error": "Email, contraseña y nombre de usuario son obligatorios"}), 400

    # Verificar si tanto el email como el usuario ya existe
    existing_user = User.query.filter_by(email=email).first()
    existing_username = User.query.filter_by(username=username).first()  # Verificar si el username ya existe
    if existing_user:
        return jsonify({"error": "El correo electrónico ya está registrado"}), 400
    if existing_username:
        return jsonify({"error": "El nombre de usuario ya está en uso"}), 400

    # Verificar que la contraseña tenga al menos 6 caracteres y contenga al menos un número
    if len(password) < 6:
        return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

    # Crear usuario con saldo de 200€
    new_user = User(email=email, password=password, username=username, is_active=True, balance=200.00)
    db.session.add(new_user)
    db.session.commit()

    # Usuario se ha registrado con éxito
    return jsonify({
        "message": "Usuario registrado con éxito",
        "balance": new_user.balance
    }), 201


# RUTA DE INICIO DE SESIÓN
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        # Si faltan datos, devuelve el error
        return jsonify({"error": "Usuario y contraseña obligatorios"}), 400

    # Verificar si el usuario existe y si la contraseña es correcta
    user = User.query.filter_by(username=username).first()

    # Datos equivocados
    if not user or user.password != password:
        return jsonify({"error": "Datos incorrectos"}), 400

    # Guardar el id del usuario en la sesión
    session['user_id'] = user.id

    # Se ha iniciado sesión correctamente
    return jsonify({
        "message": "Inicio de sesión correcto",
        "user": {
            "id": user.id,
            "username": user.username,  # Ahora devuelve el username en la respuesta de login
            "email": user.email,
            "balance": user.balance
        }
    }), 200

# RUTA DE CIERRE DE SESIÓN
@auth.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Limpiar toda la sesión en el servidor
    return jsonify({"message": "Sesión cerrada"}), 200


# RUTA PARA COMPROBAR SI LA SESIÓN ESTÁ INICIADA Y OBTENER EL BALANCE ACTUALIZADO
@auth.route('/session-info', methods=['GET'])
def session_info():
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
    return jsonify({"error": "No hay sesión"}), 403
