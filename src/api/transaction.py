from flask import Blueprint, request, jsonify, session
from api.models import db, User, TransactionHistory
import stripe

transaction = Blueprint('transaction', __name__)


#RUTA INGRESO DE DINERO CON STRIPE
@transaction.route('/add-funds', methods=['POST'])
def add_funds():
    if 'user_id' not in session:
        return '', 403  #comprobar que el usuario este conectado
    
    data = request.get_json() #obtener la cantidad a añadir
    amount= data.get('amount')

    #si es una cantidad no valida, devuelve error
    if not amount or float(amount) <= 0:
        return jsonify({"error": "Cantidad no valida"}), 400

    #obtiene el usuario de la base de datos
    user = User.query.get(session['user_id'])

    #crear una sesion de pago en Stripe
    stripe_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data':{
                'currency': 'eur',
                'product_data': {
                    'name': 'Recarga de saldo',
                },
                'unit_amount': int(float(amount) * 100), #convierte la cifra en centimos 1€ = 100cent
            },
            'quantity': 1,
        }],
        mode='payment', #definir modo de pago
        success_url='https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/success',
        cancel_url='https://organic-succotash-5gvx65ww5x5vcpvg-3001.app.github.dev/cancel',
        metadata={
            'user_id': user.id
        }
    )

    stripe_payment_url = "https://buy.stripe.com/test_14k9ACdnx2DQ6U8aEF"

#Guardar transaccion en el historial
    new_transaction = TransactionHistory(
        user_id=user.id,
        transaction_type="Recarga de saldo",
        amount=amount,
        result="Confirmada"
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({
        "message": "Redirigiendo a Stripe para procesar el pago",
        "stripe_url": stripe_session.url #url para que el usuario haga el ingreso
    }), 200


#RETIRADA DE SALDO
@transaction.route('/withdraw-funds', methods=['POST'])
def withdraw_funds():
    if 'user_id' not in session:
        return '', 403  #verificar que el usuario esta conectado
    
    data = request.get_json()
    amount = data.get('amount')

    #si indica una cantidad no valida
    if not amount or float(amount) <=0:
        return jsonify({"error": "Cantidad no valida"}), 400
    
    user = User.query.get(session['user_id'])

    #verificar si tiene saldo suficiente
    if user.balance < float(amount):
        return jsonify({"error": "Saldo insuficiente"}), 400
    
    user.balance -= float(amount)

    #Guardar transaccion en el historial
    new_transaction = TransactionHistory(
        user_id=user.id,
        transaction_type="Retirada",
        amount=amount,
        result="Confirmada"
    )
    db.session.add(new_transaction)
    db.session.commit()

    #dinero retirado con exito y actualizacion del saldo
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

#RUTA PARA VER LAS TRANSACCIONES
@transaction.route('/transaction-history', methods=['GET'])
def get_transaction_history():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "No tienes acceso, debes iniciar sesión"}), 403
    
    
    transactions = TransactionHistory.query.filter_by(user_id=user_id).all()
    serialized_transactions = [t.serialize() for t in transactions]
    return jsonify(serialized_transactions), 200