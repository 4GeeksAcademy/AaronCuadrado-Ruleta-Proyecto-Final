from flask import Blueprint, request, jsonify
import stripe
from api.models import db, User

webhook = Blueprint('webhook', __name__)

stripe.api_key = 'sk_test_51QChOk2LySc2UsGFgu1RKTF6bMDw3S2mVy6XKJXTgHNNAtH1atJLsazX43l1XBR4UqR5zFqqLBY23GKFymypK7Za00NvNwNXaP'

# RUTA PARA AÑADIR STRIPE WEBHOOK
@webhook.route('/stripe-webhook', methods=['POST'])
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
        amount = stripe_session['amount_total'] / 100  # Stripe envía el cálculo en céntimos

        # Obtener el usuario y actualizar su saldo
        user = User.query.get(user_id)
        if user:
            user.balance += amount
            db.session.commit()
            print(f"Saldo actualizado para el usuario {user_id}: {user.balance} €")
        else:
            print(f"Usuario con ID {user_id} no encontrado")

    return '', 200
