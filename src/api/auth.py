from flask import Blueprint, request, jsonify, session
from api.models import db, User
from werkzeug.security import generate_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    birthdate = data.get('birthdate')  # Formato: YYYY-MM-DD

    # Verificación de datos obligatorios
    if not username or not email or not password or not birthdate:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Verificar si el correo o username ya están registrados
    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "El usuario o correo ya están en uso"}), 400

    # Crear nuevo usuario con contraseña encriptada
    new_user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        birthdate=birthdate
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Usuario registrado con éxito"}), 201

@auth.route('/login', methods=['POST'])
def login():
    """Iniciar sesión"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Verificar que se envíen las credenciales
    if not email or not password:
        return jsonify({"error": "Correo y contraseña son obligatorios"}), 400

    # Verificar si el usuario existe
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Correo o contraseña incorrectos"}), 401

    # Crear la sesión
    session['user_id'] = user.id
    return jsonify({"message": "Inicio de sesión exitoso", "user": user.serialize()}), 200


@auth.route('/logout', methods=['POST'])
def logout():
    """Cerrar sesión"""
    if 'user_id' in session:
        session.pop('user_id')
        return jsonify({"message": "Sesión cerrada con éxito"}), 200
    return jsonify({"error": "No hay una sesión activa"}), 400


@auth.route('/admin/vehicles', methods=['POST'])
def admin_add_vehicle():
    """Admin: agregar un nuevo vehículo"""
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403

    # Verificar si el usuario es admin (opcional, puedes implementar roles en el modelo User)
    # Aquí asumimos que el primer usuario es admin
    if session['user_id'] != 1:
        return jsonify({"error": "Solo el admin puede realizar esta acción"}), 403

    data = request.get_json()
    brand = data.get('brand')
    model = data.get('model')
    year = data.get('year')
    color = data.get('color')
    daily_rate = data.get('daily_rate')
    image_url = data.get('image_url')

    # Validar datos obligatorios
    if not brand or not model or not year or not color or not daily_rate:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    # Crear el nuevo vehículo
    new_vehicle = Vehicle(
        brand=brand,
        model=model,
        year=year,
        color=color,
        daily_rate=daily_rate,
        image_url=image_url
    )

    db.session.add(new_vehicle)
    db.session.commit()
    return jsonify({"message": "Vehículo agregado con éxito"}), 201
