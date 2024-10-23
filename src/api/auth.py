from flask import Blueprint, request, jsonify, session
from api.models import db, User

auth = Blueprint('auth', __name__)

#RUTA DE REGISTRO
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json() #Obtener los datos del email y password
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

# Usuario se ha registrado y le ha añadido el nuevo saldo
    return jsonify({
        "message": "Usuario registrado con exito",
        "balance": new_user.balance
    }), 201


#RUTA DE INICIO DE SESION
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        #si faltan datos devuelve el error
        return jsonify({"error": "Email y contraseña obligatorios"}), 400
    
    #verificar si el usuario existe y si la contraseña es correcta
    user = User.query.filter_by(email=email).first()

    #datos equivocados
    if not user or user.password != password:
        return jsonify({"error": "Datos incorrectos"}), 400
    
    #guardar el id del usuario en la sesion
    session['user_id'] = user.id
    
    #se ha iniciado sesion correctamente
    return jsonify({
        "message": "Inicio de sesion correcto",
        "user": {
            "id": user.id,
            "email": user.email,
            "balance": user.balance
        }
    }), 200


#RUTA PARA COMPROBAR SI ESTA LE SESION INICIADA
@auth.route('/session-info', methods=['GET'])
def session_info():
    if 'user_id' in session:
        return jsonify({"message": "Sesion activa", "user_id": session['user_id']}), 200
    return jsonify({"error": "No hay sesion"}), 403