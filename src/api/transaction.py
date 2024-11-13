from flask import Blueprint, request, jsonify, session
from api.models import db, User, TransactionHistory
import stripe

transaction = Blueprint('transaction', __name__)

# Configuración de la clave de API de Stripe
stripe.api_key = 'sk_test_51QChOk2LySc2UsGFgu1RKTF6bMDw3S2mVy6XKJXTgHNNAtH1atJLsazX43l1XBR4UqR5zFqqLBY23GKFymypK7Za00NvNwNXaP'

# RUTA PARA INGRESO DE DINERO CON STRIPE
@transaction.route('/add-funds', methods=['POST'])
def add_funds():
    if 'user_id' not in session:
        return '', 403  # Verificar que el usuario esté conectado
    
    data = request.get_json()
    amount = data.get('amount')

    # Si es una cantidad no válida, devuelve error
    if not amount or float(amount) <= 0:
        return jsonify({"error": "Cantidad no válida"}), 400

    # Obtiene el usuario de la base de datos
    user = User.query.get(session['user_id'])

    # Crear una sesión de pago en Stripe
    stripe_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'eur',
                'product_data': {
                    'name': 'Recarga de saldo',
                },
                'unit_amount': int(float(amount) * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://ideal-guacamole-v6pq4wxxw5w4hrxj-3000.app.github.dev/add-funds/success',  # URL de éxito actualizada al frontend
        cancel_url='https://ideal-guacamole-v6pq4wxxw5w4hrxj-3000.app.github.dev/add-funds/cancel',  # URL de cancelación actualizada al frontend
        metadata={
            'user_id': user.id
        }
    )

    # Guardar transacción en el historial
    new_transaction = TransactionHistory(
        user_id=user.id,
        transaction_type="Recarga de saldo",
        amount=amount,
        result="En curso"
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({
        "message": "Redirigiendo a Stripe para procesar el pago",
        "stripe_url": stripe_session.url
    }), 200

# RUTA PARA RETIRADA DE SALDO
@transaction.route('/withdraw-funds', methods=['POST'])
def withdraw_funds():
    if 'user_id' not in session:
        return '', 403  # Verificar que el usuario está conectado
    
    data = request.get_json()
    amount = data.get('amount')

    if not amount or float(amount) <= 0:
        return jsonify({"error": "Cantidad no válida"}), 400
    
    user = User.query.get(session['user_id'])

    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente"}), 400
    
    user.balance -= float(amount)

    new_transaction = TransactionHistory(
        user_id=user.id,
        transaction_type="Retirada",
        amount=amount,
        result="Confirmada"
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({
        "message": f"Has retirado {amount}€. Tu nuevo saldo es {user.balance}€.",
        "new_balance": user.balance
    }), 200

# RUTA DE ÉXITO DEL PAGO
@transaction.route('/success')
def payment_success():
    return "<h1>¡Pago completado con éxito!</h1><p>Tu saldo ha sido recargado.</p>"

# RUTA DE CANCELACIÓN DEL PAGO
@transaction.route('/cancel')
def payment_cancel():
    return "<h1>Has cancelado el proceso de pago.</h1><p>Vuelve a intentarlo cuando estés listo.</p>"

# RUTA PARA VER EL HISTORIAL DE TRANSACCIONES
@transaction.route('/transaction-history', methods=['GET'])
def get_transaction_history():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "No tienes acceso, debes iniciar sesión"}), 403
    
    transactions = TransactionHistory.query.filter_by(user_id=user_id).all()
    serialized_transactions = [t.serialize() for t in transactions]
    return jsonify(serialized_transactions), 200

@transaction.route('/get-balance', methods=['GET'])
def get_balance():
    """
    Devuelve el saldo actual del usuario autenticado.
    """
    # Verificar si el usuario está autenticado
    if 'user_id' not in session:
        return jsonify({"error": "No tienes acceso, debes iniciar sesión"}), 403

    # Obtener el usuario y su balance
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Retornar el balance actual
    return jsonify({"balance": user.balance}), 200