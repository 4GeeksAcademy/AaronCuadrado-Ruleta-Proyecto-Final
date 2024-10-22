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


#RUTA DE REGISTRO
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

#RUTA DE USUARIOS
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]
    return jsonify(users_list), 200

#RUTA DE INICIO DE SESION
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

#RUTA INGRESO DE DINERO CON STRIPE
@api.route('/add-funds', methods=['POST'])
def add_funds():
    if 'user_id' not in session:
        return '', 403
    
    data = request.get_json()
    amount= data.get('amount')

    if not amount or float(amount) <= 0:
        return jsonify({"error": "Cantidad no valida"}), 400

    user = User.query.get(session['user_id'])

    stripe_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data':{
                'currency': 'eur',
                'product_data': {
                    'name': 'Recarga de saldo',
                },
                'unit_amount': int(float(amount) * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/success',
        cancel_url='https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/cancel',
        metadata={
            'user_id': user.id
        }
    )

    stripe_payment_url = "https://buy.stripe.com/test_14k9ACdnx2DQ6U8aEF"

    return jsonify({
        "message": "Redirigiendo a Stripe para procesar el pago",
        "stripe_url": stripe_session.url
    }), 200

#RUTA PARA COMPROBAR SI ESTA LE SESION INICIADA
@api.route('/session-info', methods=['GET'])
def session_info():
    if 'user_id' in session:
        return jsonify({"message": "Sesion activa", "user_id": session['user_id']}), 200
    return jsonify({"error": "No hay sesion"}), 403


import stripe 
stripe.api_key = 'sk_test_51QChOk2LySc2UsGFgu1RKTF6bMDw3S2mVy6XKJXTgHNNAtH1atJLsazX43l1XBR4UqR5zFqqLBY23GKFymypK7Za00NvNwNXaP'

#RUTA PARA AÑADIR STRIPE WEBHOOK
@api.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.webhook.construct_event(
            payload, sig_header, 'whsec_osM6Tq6TZliF8HjxzwgbTTqvYTvucY1g'
        )
    except ValueError as e:
        return jsonify({"error": "Payload invalido"}), 400
    except stripe.error.SignatureVerificationError as e:
        return jsonify({"error": " Firma invalida"}), 400

    if event['type'] == 'checkout.session.completed':
        stripe_session = event['data']['object']
        user_id = stripe_session['metadata']['user_id']
        amount = stripe_session['amount_total'] / 100 #stripe envia el calculo en centimos

        #actualizar saldo en bdd
        user = User.query.get(user_id)
        user.balance += amount
        db.session.commit()

    return '', 200

#RUTA REDIRIGIR SI EL PAGO HA SIDO REALIZADO
@api.route('/success')
def payment_success():
    return "<h1>¡Pago completado con éxito!</h1><p>Tu saldo ha sido recargado.</p>"

#RUTA PARA REDIRIGIR SI EL PAGO HA SIDO RECHAZADO
@api.route('/cancel')
def payment_cancel():
    return "<h1>Has cancelado el proceso de pago.</h1><p>Vuelve a intentarlo cuando estés listo.</p>"

#RETIRADA DE SALDO
@api.route('/withdraw-funds', methods=['POST'])
def withdraw_funds():
    if 'user_id' not in session:
        return '', 403
    
    data = request.get_json()
    amount = data.get('amount')

    if not amount or float(amount) <=0:
        return jsonify({"error": "Cantidad no valida"}), 400
    
    user = User.query.get(session['user_id'])

    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente"}), 400
    
    user.balance -= float(amount)
    db.session.commit()

    return jsonify({
        "message": f"Has retirado {amount}€. Tu nuevo saldo es {user.balance}€.",
        "new_balance": user.balance
    }), 200


#APUESTAS Y TIPOS DE APUESTAS/GANANCIAS
@api.route('/bet', methods=['POST'])
def bet():
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesion"})
    
    data = request.get_json()
    amount = data.get('amount')
    bet_type = data.get('bet_type')
    bet_value = data.get('bet_value')

    if not amount or float(amount) <=0:
        return jsonify({"error": "Cantidad no valida"})
    
    user=User.query.get(session['user_id'])

    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente"}), 400
    
    roulette_number = random.randint(0, 36)
    roulette_color = "black" if roulette_number in BLACK_NUMBERS else "red" if roulette_number in RED_NUMBERS else "green"

    winnings = 0
    message = ""

    if bet_type == "number":
        if int(bet_value) == roulette_number:
            winnings = float(amount) * 36
            message = f"!Felicidades¡ Has ganado {winnings}€ con el numero {roulette_number}"
        else:
            winnings = -float(amount)
            message = f"Has perdido {amount}€. El numero ganador ha sido {roulette_number}€"

    elif bet_type == "color":

        if bet_value == roulette_color:
            winnings = float(amount) * 2
            message = f"¡Felicidades! Has ganado {winnings}€ apostando al color {bet_value}."
        else: winnings = -float(amount)
        message = f"Has perdido {amount}€. El número ganador fue {roulette_number} ({roulette_color})."

    elif bet_type == "parity":

        if (bet_value == "even" and roulette_number % 2 == 0) or (bet_value == "old" and roulette_number % 2 != 0):
            winnings = float(amount) * 2
            message = f"¡Felicidades! Has ganado {winnings}€ apostando a {bet_value}."
        else:
            winnings = -float(amount)
            message = f"Has perdido {amount}€. El número ganador fue {roulette_number}."
    
    user.balance += winnings
    db.session.commit()

    return jsonify({
        "message": message,
        "new_balance": user.balance,
        "roulette_number": roulette_number,
        "roulette_color": roulette_color
    }), 200
    
