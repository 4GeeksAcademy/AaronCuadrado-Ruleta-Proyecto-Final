from flask import Blueprint, request, jsonify, session
from api.models import db, User
import stripe

transaction = Blueprint('transaction', __name__)


#RUTA INGRESO DE DINERO CON STRIPE
@transaction.route('/add-funds', methods=['POST'])
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


#RETIRADA DE SALDO
@transaction.route('/withdraw-funds', methods=['POST'])
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

#RUTA REDIRIGIR SI EL PAGO HA SIDO REALIZADO
@transaction.route('/success')
def payment_success():
    return "<h1>¡Pago completado con éxito!</h1><p>Tu saldo ha sido recargado.</p>"

#RUTA PARA REDIRIGIR SI EL PAGO HA SIDO RECHAZADO
@transaction.route('/cancel')
def payment_cancel():
    return "<h1>Has cancelado el proceso de pago.</h1><p>Vuelve a intentarlo cuando estés listo.</p>"

